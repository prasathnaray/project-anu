const path = require('path');
const { BatchClient, SubmitJobCommand } = require('@aws-sdk/client-batch');
const client = require('../utils/conn.js');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const AWS_REGION = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1';
const DEFAULT_JOB_QUEUE = 'vol-conversion-queue';
const DEFAULT_JOB_DEFINITION = 'vol-conversion-job';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_IVS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_IVS_SECRET_KEY;

const batchClient = new BatchClient({
  region: AWS_REGION,
  ...(accessKeyId && secretAccessKey
    ? {
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      }
    : {}),
});

const getBatchConfig = () => {
  const jobQueue = process.env.VOL_CONVERSION_JOB_QUEUE || DEFAULT_JOB_QUEUE;
  const jobDefinition = process.env.VOL_CONVERSION_JOB_DEFINITION || DEFAULT_JOB_DEFINITION;

  const missing = [];
  if (!jobQueue) missing.push('VOL_CONVERSION_JOB_QUEUE');
  if (!jobDefinition) missing.push('VOL_CONVERSION_JOB_DEFINITION');

  if (missing.length > 0) {
    throw new Error(`Missing AWS Batch configuration: ${missing.join(', ')}`);
  }

  return { jobQueue, jobDefinition };
};

const makeJobName = (volumeId) => {
  const safeVolumeId = String(volumeId).replace(/[^A-Za-z0-9_-]/g, '-').slice(0, 80);
  return `vol-conversion-${safeVolumeId}-${Date.now()}`.slice(0, 128);
};

const updateConversionFailure = async (volumeId, errorMessage) => {
  try {
    await client.query(
      `
      UPDATE volume_conv_logs
      SET conversion_completion = false,
          completed_at = NOW(),
          error_message = $2
      WHERE volume_id = $1
      `,
      [volumeId, errorMessage]
    );

    await client.query(
      `
      UPDATE volumes
      SET conversion_process_status = false,
          lifecycle_status = 'failed'
      WHERE volume_id = $1
      `,
      [volumeId]
    );
  } catch (error) {
    console.error(`[${volumeId}] Failed to update conversion failure:`, error);
  }
};

const submitConversionJob = async ({ volumeId, storagePath, volumeName }) => {
  const { jobQueue, jobDefinition } = getBatchConfig();

  const command = new SubmitJobCommand({
    jobName: makeJobName(volumeId),
    jobQueue,
    jobDefinition,
    containerOverrides: {
      environment: [
        { name: 'VOLUME_ID', value: String(volumeId) },
        { name: 'SUPABASE_INPUT_PATH', value: String(storagePath) },
        { name: 'VOLUME_NAME', value: String(volumeName || 'volume') },
      ],
    },
  });

  const response = await batchClient.send(command);
  return {
    jobId: response.jobId,
    jobQueue,
    jobDefinition,
  };
};

/**
 * Submit the conversion to AWS Batch.
 * The Batch container updates volume_conv_logs and volumes when it finishes.
 */
const startVolumeConversion = async (volumeId) => {
  console.log(`[${volumeId}] Submitting AWS Batch volume conversion job`);

  try {
    const volumeResult = await client.query(
      'SELECT volume_id, volume_name, volume_file FROM volumes WHERE volume_id = $1',
      [volumeId]
    );

    if (volumeResult.rows.length === 0) {
      throw new Error('Volume not found in database');
    }

    const volume = volumeResult.rows[0];
    const storagePath = volume.volume_file;
    const volumeName = volume.volume_name || 'volume';

    if (!storagePath) {
      throw new Error('Volume storage path is empty');
    }

    const conversionJob = await submitConversionJob({
      volumeId,
      storagePath,
      volumeName,
    });

    console.log(`[${volumeId}] AWS Batch job submitted: ${conversionJob.jobId}`);
    return conversionJob;
  } catch (error) {
    const message = error.message || 'Failed to submit AWS Batch conversion job';
    console.error(`[${volumeId}] ${message}`);
    await updateConversionFailure(volumeId, message);
    throw error;
  }
};

const getConversionStatus = async (volumeId) => {
  const result = await client.query(
    `
    SELECT
      v.volume_id,
      v.volume_name,
      v.conversion_process_status,
      v.converted_file_path,
      vcl.conversion_completion,
      vcl.started_at,
      vcl.completed_at,
      vcl.error_message,
      vcl.output_file,
      vcl.output_size,
      vcl.public_url,
      vcl.converted_by
    FROM volumes v
    LEFT JOIN volume_conv_logs vcl ON v.volume_id = vcl.volume_id
    WHERE v.volume_id = $1
    `,
    [volumeId]
  );

  return result.rows[0] || null;
};

module.exports = {
  startVolumeConversion,
  getConversionStatus,
};
