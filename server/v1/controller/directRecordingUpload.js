const path = require('path');
const { randomUUID } = require('crypto');
const jwt = require('jsonwebtoken');
const { S3Client, PutObjectCommand, HeadObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const pool = require('../utils/conn');
const { assertVolumeEditableModel } = require('../model/Volumem');
const { canEditOwnedEntity, requireRole, COURSE_EDITOR_ROLES } = require('../Auth/authorization');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-south-1', requestChecksumCalculation: 'WHEN_REQUIRED' });
const MB = 1024 * 1024;
const types = {
    recording_file: { '.json': 'application/json' },
    audio_file: { '.wav': 'audio/wav' },
    images: { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.bmp': 'image/bmp' },
    manifest_file: { '.json': 'application/json', '.manifest': 'text/plain' }
};
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const owner = (user) => JSON.stringify([user.user_mail, Number(user.role), user.centre_id || null]);

function validateFiles(files) {
    if (!Array.isArray(files) || !files.length || files.length > 61) fail(400, 'Supply 1-20 recording, audio and image files and exactly one manifest.');
    const counts = {};
    let total = 0;
    const validated = files.map((file) => {
        if (!file || typeof file.filename !== 'string' || file.filename.length > 255) fail(400, 'Invalid filename.');
        const contentType = types[file.field]?.[path.extname(file.filename).toLowerCase()];
        if (!contentType || !Number.isSafeInteger(file.size) || file.size <= 0 || file.size > 100 * MB) fail(400, 'Invalid field, extension or size (maximum 100 MiB per file).');
        counts[file.field] = (counts[file.field] || 0) + 1;
        total += file.size;
        return { field: file.field, filename: file.filename, size: file.size, contentType };
    });
    if (total > 250 * MB) fail(400, 'Recording package exceeds 250 MiB.');
    for (const field of Object.keys(types)) {
        if (!counts[field] || counts[field] > (field === 'manifest_file' ? 1 : 20)) fail(400, `Invalid file count for ${field}.`);
    }
    return validated;
}

async function authorize(user, clusterId, requestedVolume) {
    requireRole(user, COURSE_EDITOR_ROLES);
    const result = await pool.query('SELECT owner_scope, owner_centre_id FROM clusters WHERE cluster_id = $1', [clusterId]);
    const cluster = result.rows[0];
    if (!cluster || !canEditOwnedEntity(user, cluster.owner_scope, cluster.owner_centre_id)) fail(404, 'Cluster not found or not editable.');
    const links = await pool.query('SELECT volume_id FROM cluster_volumes WHERE cluster_id = $1 ORDER BY volume_id', [clusterId]);
    const volumeId = requestedVolume || links.rows[0]?.volume_id;
    if (!volumeId || !links.rows.some((r) => r.volume_id === volumeId) || !await assertVolumeEditableModel(user, volumeId)) fail(404, 'An editable volume linked to this cluster is required.');
    return volumeId;
}

function errorResponse(res, error) {
    const status = error.status || error.statusCode || (['NoSuchKey', 'NotFound'].includes(error.name) ? 400 : 500);
    console.warn('Direct recording upload:', error.name, status);
    return res.status(status).json({ message: status === 500 ? 'Unable to process recording upload. Please retry.' : error.message });
}

exports.prepare = async (req, res) => {
    try {
        const { recording_name, recording_type, volume_id, files } = req.body;
        if (typeof recording_name !== 'string' || !recording_name.trim() || recording_name.length > 255 || !['shadow', 'step'].includes(recording_type)) fail(400, 'A recording name and shadow/step recording type are required.');
        const descriptors = validateFiles(files);
        const volumeId = await authorize(req.user, req.params.cluster_id, volume_id);
        const id = randomUUID();
        const bucket = process.env.AWS_S3_BUCKET;
        const prefix = `${process.env.BUCKET_NAME || 'projectanu'}/direct-recordings/${id}`;
        const assets = descriptors.map((f, index) => ({ ...f, key: `${prefix}/${index}${path.extname(f.filename).toLowerCase()}` }));
        const uploads = await Promise.all(assets.map(async (f, index) => ({
            index, field: f.field, filename: f.filename,
            uploadUrl: await getSignedUrl(s3, new PutObjectCommand({ Bucket: bucket, Key: f.key, ContentLength: f.size, ContentType: f.contentType, IfNoneMatch: '*' }), { expiresIn: 3600, signableHeaders: new Set(['content-type', 'if-none-match']) }),
            method: 'PUT', headers: { 'Content-Type': f.contentType, 'If-None-Match': '*' }
        })));
        const uploadToken = jwt.sign({ id, bucket, assets, owner: owner(req.user), clusterId: req.params.cluster_id, volumeId, name: recording_name.trim(), type: recording_type }, process.env.ACCESS_TOKEN_SECRET, { audience: 'recording-upload', expiresIn: '1h' });
        return res.set('Cache-Control', 'no-store').json({ uploadToken, uploads, expiresIn: 3600 });
    } catch (error) { return errorResponse(res, error); }
};

exports.complete = async (req, res) => {
    let upload;
    try { upload = jwt.verify(req.body.uploadToken, process.env.ACCESS_TOKEN_SECRET, { algorithms: ['HS256'], audience: 'recording-upload' }); }
    catch { return res.status(400).json({ message: 'Invalid or expired uploadToken.' }); }
    try {
        if (upload.owner !== owner(req.user) || upload.clusterId !== req.params.cluster_id) fail(403, 'Upload owner or cluster mismatch.');
        await authorize(req.user, upload.clusterId, upload.volumeId);
        // Objects cannot be overwritten through the signed PUT. Verify every object before saving.
        for (const f of upload.assets) {
            const object = { Bucket: upload.bucket, Key: f.key };
            const head = await s3.send(new HeadObjectCommand(object));
            if (head.ContentLength !== f.size || head.ContentType !== f.contentType) fail(400, `Upload size or content type mismatch: ${f.filename}`);
            if (f.contentType === 'application/json') {
                const result = await s3.send(new GetObjectCommand(object));
                try { JSON.parse(await result.Body.transformToString()); }
                catch { fail(400, `Malformed JSON: ${f.filename}`); }
            }
        }
        const refs = (field) => upload.assets.filter((f) => f.field === field).map((f) => f.key);
        const db = await pool.connect();
        let recording;
        try {
            await db.query('BEGIN');
            // The signed upload ID is also the recording ID, so completion retries are idempotent.
            const saved = await db.query(`INSERT INTO vol_recordings
                (recording_id, volume_id, recording_name, recording_type, rec_files, audio_files, image_files, manifest_file, created_by)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                ON CONFLICT (recording_id) DO NOTHING RETURNING *`,
            [upload.id, upload.volumeId, upload.name, upload.type, JSON.stringify(refs('recording_file')), JSON.stringify(refs('audio_file')), JSON.stringify(refs('images')), refs('manifest_file')[0], req.user.user_mail]);
            recording = saved.rows[0] || (await db.query('SELECT * FROM vol_recordings WHERE recording_id = $1', [upload.id])).rows[0];
            await db.query('INSERT INTO cluster_recordings (cluster_id, recording_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [upload.clusterId, upload.id]);
            await db.query("UPDATE volumes SET lifecycle_status = 'recorded' WHERE volume_id = $1", [upload.volumeId]);
            await db.query('COMMIT');
        } catch (error) { await db.query('ROLLBACK'); throw error; }
        finally { db.release(); }
        return res.set('Cache-Control', 'no-store').status(200).json({ code: 200, message: 'Recording saved successfully.', recording_id: upload.id, data: recording });
    } catch (error) { return errorResponse(res, error); }
};

exports.validateFiles = validateFiles;
