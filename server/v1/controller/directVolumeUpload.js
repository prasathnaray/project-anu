const { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { svUploadModel } = require('../model/Volumem');
const { isValidVolBuffer } = require('./volumeController');
const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-south-1', requestChecksumCalculation: 'WHEN_REQUIRED' });
const fields = ['volume_type', 'measurements', 'plane', 'volume_name', 'volume_ga', 'volume_fetal_presentation', 'trimester', 'description'];
const permitted = (u) => [99, 101, 102].includes(Number(u.role)) && (Number(u.role) === 99 || u.centre_id);
exports.prepare = async (req, res) => {
  if (!permitted(req.user)) return res.status(403).json({ message: 'Upload not permitted.' });
  const { filename, size } = req.body;
  if (typeof filename !== 'string' || !/\.vol$/i.test(filename) || !Number.isSafeInteger(size) || size <= 0 || size > 100 * 1024 * 1024) {
    return res.status(400).json({ message: 'Choose a .vol file up to 100 MB.' });
  }
  const metadata = {};
  for (const field of fields) {
    if (typeof req.body[field] !== 'string' || !req.body[field].trim() || req.body[field].length > 10000) return res.status(400).json({ message: `Invalid ${field}.` });
    metadata[field] = req.body[field].trim();
  }
  try {
    const prefix = Number(req.user.role) === 99 ? 'global' : `institutions/${req.user.centre_id}`;
    const key = `${process.env.PRIVATE_CONTENT_BUCKET || process.env.BUCKET_NAME || 'projectanu'}/${prefix}/${randomUUID()}/source/${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const bucket = process.env.AWS_S3_BUCKET;
    const uploadUrl = await getSignedUrl(s3, new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: 'application/octet-stream', ContentLength: size, IfNoneMatch: '*' }), { expiresIn: 900 });
    const uploadToken = jwt.sign({ key, bucket, size, metadata, user: req.user.user_mail, centre: req.user.centre_id || null, role: Number(req.user.role) }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h', audience: 'volume-upload' });
    res.set('Cache-Control', 'no-store').json({ uploadUrl, uploadToken });
  } catch (error) { console.error('Prepare volume upload:', error.name); res.status(500).json({ message: 'Unable to prepare upload.' }); }
};
exports.complete = async (req, res) => {
  if (!permitted(req.user)) return res.status(403).json({ message: 'Upload not permitted.' });
  let upload;
  try { upload = jwt.verify(req.body.uploadToken, process.env.ACCESS_TOKEN_SECRET, { audience: 'volume-upload' }); }
  catch { return res.status(400).json({ message: 'Upload authorization expired or invalid.' }); }
  if (upload.user !== req.user.user_mail || upload.centre !== (req.user.centre_id || null) || upload.role !== Number(req.user.role)) return res.status(403).json({ message: 'Upload owner mismatch.' });
  try {
    const object = { Bucket: upload.bucket, Key: upload.key };
    const head = await s3.send(new HeadObjectCommand(object));
    if (head.ContentLength !== upload.size) return res.status(400).json({ message: 'Uploaded file size mismatch.' });
    const sample = await s3.send(new GetObjectCommand({ ...object, Range: 'bytes=0-511' }));
    if (!isValidVolBuffer(Buffer.from(await sample.Body.transformToByteArray()))) return res.status(400).json({ message: 'Invalid volume file.' });
    const result = await svUploadModel(req.user, ...fields.map((field) => upload.metadata[field]), upload.key);
    if (result.code) return res.status(result.code).json(result);
    return res.status(200).json({ message: 'Volume Uploaded' });
  } catch (error) { console.error('Complete volume upload:', error.name); return res.status(500).json({ message: 'Unable to finalize volume upload.' }); }
};
