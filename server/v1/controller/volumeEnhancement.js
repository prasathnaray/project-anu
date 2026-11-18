const { BatchClient, SubmitJobCommand } = require('@aws-sdk/client-batch');
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const client = require('../utils/conn');
const { volumeAccessScope } = require('../Auth/volumeAuthorization');

const batch = new BatchClient({ region: process.env.AWS_REGION || 'ap-south-1' });
const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-south-1' });
const isUuid = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

const startEnhancement = async (req, res) => {
  const volumeId = req.params.volume_id;
  if (!isUuid(volumeId)) return res.status(400).json({ message: 'Invalid volume ID.' });
  const scope = volumeAccessScope(req.user, 'v', 2);
  if (!scope) return res.status(403).json({ message: 'Volume access denied.' });

  let volumeClaimed = false;
  let submittedJobId = null;
  try {
    const claimed = await client.query(
      `UPDATE public.volumes v SET enhancement_status = 'running', enhancement_error = NULL,
         enhancement_manifest = NULL, enhancement_job_id = NULL
       WHERE v.volume_id = $1 AND ${scope.clause} AND v.ownership_review_required = false
         AND v.enhancement_status IN ('pending', 'failed')
       RETURNING v.volume_file`,
      [volumeId, ...scope.params]
    );
    if (!claimed.rowCount) {
      const existing = await client.query(
        `SELECT v.enhancement_status FROM public.volumes v
         WHERE v.volume_id = $1 AND ${scope.clause} AND v.ownership_review_required = false`,
        [volumeId, ...scope.params]
      );
      return res.status(existing.rowCount ? 409 : 404).json({
        message: existing.rowCount ? `Enhancement is ${existing.rows[0].enhancement_status}.` : 'Volume not found.'
      });
    }
    volumeClaimed = true;
    if (!claimed.rows[0].volume_file) throw new Error('Source volume file is missing.');

    const submitted = await batch.send(new SubmitJobCommand({
      jobName: `vol-enhancement-${volumeId}-${Date.now()}`.slice(0, 128),
      jobQueue: process.env.VOL_ENHANCEMENT_JOB_QUEUE || 'vol-conversion-queue',
      jobDefinition: process.env.VOL_ENHANCEMENT_JOB_DEFINITION || 'vol-enhancement-job',
      containerOverrides: { environment: [
        { name: 'VOLUME_ID', value: volumeId },
        { name: 'S3_INPUT_KEY', value: claimed.rows[0].volume_file },
        { name: 'AWS_S3_BUCKET', value: process.env.AWS_S3_BUCKET || '' },
      ] },
    }));
    submittedJobId = submitted.jobId;
    await client.query('UPDATE public.volumes SET enhancement_job_id = $2 WHERE volume_id = $1', [volumeId, submittedJobId]);
    return res.status(202).json({ volume_id: volumeId, status: 'running', job_id: submitted.jobId });
  } catch (error) {
    if (error?.code === '42703' && /enhancement_status|enhancement_error|enhancement_manifest|enhancement_job_id/.test(error.message || '')) {
      return res.status(503).json({ message: 'Volume enhancement is unavailable until the database migration is applied.' });
    }
    if (error?.name === 'ClientException' && error?.$metadata?.httpStatusCode === 400) {
      console.error('AWS Batch rejected enhancement:', error.message);
    } else {
      console.error('Enhancement submission failed:', error);
    }
    if (volumeClaimed && !submittedJobId) {
      await client.query(
        `UPDATE public.volumes SET enhancement_status = 'failed', enhancement_error = $2
         WHERE volume_id = $1 AND enhancement_status = 'running' AND enhancement_job_id IS NULL`,
        [volumeId, error.message || 'Unable to submit enhancement job.']
      ).catch((rollbackError) => console.error('Enhancement rollback failed:', rollbackError));
    }
    if (error?.name === 'ClientException' && error?.$metadata?.httpStatusCode === 400) {
      return res.status(503).json({ message: `AWS Batch rejected the enhancement job: ${error.message}` });
    }
    return res.status(502).json({ message: 'Unable to start enhancement.' });
  }
};

const listEnhancedFiles = async (req, res) => {
  const volumeId = req.params.volume_id;
  if (!isUuid(volumeId)) return res.status(400).json({ message: 'Invalid volume ID.' });
  const scope = volumeAccessScope(req.user, 'v', 2);
  if (!scope) return res.status(403).json({ message: 'Volume access denied.' });

  try {
    const result = await client.query(
      `SELECT v.enhancement_status, v.enhancement_manifest FROM public.volumes v
       WHERE v.volume_id = $1 AND ${scope.clause} AND v.ownership_review_required = false`,
      [volumeId, ...scope.params]
    );
    if (!result.rowCount) return res.status(404).json({ message: 'Volume not found.' });
    const volume = result.rows[0];
    if (volume.enhancement_status !== 'completed' || !volume.enhancement_manifest) {
      return res.status(409).json({ message: 'Enhanced files are not ready yet.' });
    }

    const prefix = `projectanu/converted_vol_files/enhanced/${volumeId}/`;
    if (volume.enhancement_manifest !== `${prefix}manifest.json`) {
      console.error('Unexpected enhancement manifest path for volume', volumeId);
      return res.status(502).json({ message: 'Enhanced files could not be listed.' });
    }
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error('AWS_S3_BUCKET is not configured.');

    const objects = [];
    let continuationToken;
    do {
      const page = await s3.send(new ListObjectsV2Command({
        Bucket: bucket, Prefix: prefix, ContinuationToken: continuationToken,
      }));
      objects.push(...(page.Contents || []));
      continuationToken = page.NextContinuationToken;
    } while (continuationToken);

    const frameObjects = objects.filter((object) => /^frame_\d{2}\.nrrd$/.test(object.Key?.slice(prefix.length) || ''))
      .sort((a, b) => a.Key.localeCompare(b.Key));
    const files = await Promise.all(frameObjects.map(async (object) => {
      const name = object.Key.slice(prefix.length);
      const url = await getSignedUrl(s3, new GetObjectCommand({
        Bucket: bucket, Key: object.Key, ResponseContentDisposition: `attachment; filename="${name}"`,
      }), { expiresIn: 900 });
      return { name, size: object.Size, url };
    }));
    res.set('Cache-Control', 'no-store');
    return res.status(200).json({ volume_id: volumeId, frame_count: files.length, files });
  } catch (error) {
    console.error('Enhanced file list failed:', error);
    return res.status(502).json({ message: 'Unable to load enhanced files.' });
  }
};

module.exports = { startEnhancement, listEnhancedFiles };
