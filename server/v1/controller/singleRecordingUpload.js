const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const { S3Client, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const pool = require('../utils/conn');
const { authorize, validateFiles } = require('./directRecordingUpload');

const s3 = new S3Client({ region: process.env.AWS_REGION || 'ap-south-1', requestChecksumCalculation: 'WHEN_REQUIRED' });
const invalid = message => { throw Object.assign(new Error(message), { status: 400 }); };

exports.save = async ({ user, clusterId, body, files, signal, validateJsonFile }) => {
    if (typeof clusterId !== 'string' || !clusterId.trim()) invalid('cluster_id is required.');
    if (!['step', 'shadow'].includes(body.recording_type)) invalid('recording_type must be step or shadow.');
    if (body.recording_name != null && typeof body.recording_name !== 'string') invalid('recording_name must be text.');
    const name = body.recording_name?.trim() || `${body.recording_type} recording`;
    if (name.length > 255) invalid('recording_name must be at most 255 characters.');
    const descriptors = validateFiles(files.map(f => ({ field: f.field, filename: f.originalname, size: f.size })));
    const volumeId = await authorize(user, clusterId, body.volume_id);
    for (let i = 0; i < files.length; i++) {
        if (descriptors[i].contentType === 'application/json') {
            try { await validateJsonFile(files[i].path); }
            catch { invalid(`Malformed JSON: ${files[i].originalname}`); }
        }
    }
    signal.throwIfAborted();
    const id = randomUUID();
    const bucket = process.env.AWS_S3_BUCKET;
    if (!bucket) throw new Error('AWS_S3_BUCKET is required.');
    const assets = descriptors.map((f, i) => ({ ...f,
        key: `${process.env.BUCKET_NAME || 'projectanu'}/single-recordings/${id}/${i}${path.extname(f.filename).toLowerCase()}` }));
    const uploaded = [];
    let commitStarted = false;
    try {
        for (let i = 0; i < files.length; i++) {
            signal.throwIfAborted();
            const asset = assets[i];
            const upload = new Upload({ client: s3, queueSize: 2, partSize: 8 * 1024 * 1024,
                params: { Bucket: bucket, Key: asset.key, Body: fs.createReadStream(files[i].path),
                    ContentLength: asset.size, ContentType: asset.contentType }, leavePartsOnError: false });
            const cancel = () => { upload.abort().catch(() => {}); };
            signal.addEventListener('abort', cancel, { once: true });
            if (signal.aborted) cancel();
            try { await upload.done(); uploaded.push(asset.key); }
            finally { signal.removeEventListener('abort', cancel); }
        }
        signal.throwIfAborted();
        const refs = field => assets.filter(f => f.field === field).map(f => f.key);
        // Recheck access after receiving and uploading a potentially large package.
        await authorize(user, clusterId, volumeId);
        const db = await pool.connect();
        let recording;
        try {
            await db.query('BEGIN');
            const saved = await db.query(`INSERT INTO vol_recordings
                (recording_id, volume_id, recording_name, recording_type, rec_files, audio_files, image_files, manifest_file, created_by)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
            [id, volumeId, name, body.recording_type, JSON.stringify(refs('recording_file')), JSON.stringify(refs('audio_file')),
                JSON.stringify(refs('images')), refs('manifest_file')[0], user.user_mail]);
            recording = saved.rows[0];
            await db.query('INSERT INTO cluster_recordings (cluster_id, recording_id) VALUES ($1,$2)', [clusterId, id]);
            await db.query("UPDATE volumes SET lifecycle_status = 'recorded' WHERE volume_id = $1", [volumeId]);
            commitStarted = true;
            await db.query('COMMIT');
        } catch (error) { await db.query('ROLLBACK').catch(() => {}); throw error; }
        finally { db.release(); }
        return { code: 200, message: 'Recording uploaded successfully.', recording_id: id, data: recording };
    } catch (error) {
        // A lost COMMIT response is ambiguous; retain objects so a committed row cannot lose its files.
        if (!commitStarted && uploaded.length) {
            await s3.send(new DeleteObjectsCommand({ Bucket: bucket, Delete: { Objects: uploaded.map(Key => ({ Key })) } }))
                .catch(cleanupError => console.warn('Recording object cleanup failed:', cleanupError.name));
        }
        throw error;
    }
};
