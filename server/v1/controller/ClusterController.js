const {
    getClustersModel,
    getClusterByIdModel,
    getClusterRecordingsModel,
    getClusterRecordingCountsModel,
    getClusterRecordingDownloadModel,
    createClusterModel,
    updateClusterModel,
    deleteClusterModel
} = require('../model/ClusterModel');
const { signAsset, uploadAsset } = require('../utils/storageAdapter');
const { hydrateStorageFields } = require('../utils/hydrateStorageFields');
const path = require('path');
const { assertVolumeEditableModel } = require('../model/Volumem');

const contentBucket = () => process.env.PRIVATE_CONTENT_BUCKET || process.env.BUCKET_NAME;
const ownerPrefix = (requester, volume = null) => {
    const scope = volume?.owner_scope || (Number(requester.role) === 99 ? 'super_admin' : 'institution');
    const centreId = volume?.owner_centre_id || requester.centre_id;
    return scope === 'super_admin' ? 'global' : `institutions/${centreId}`;
};

const sendResult = (res, result, notFound = false) => res.status(result.code).json({
    code: result.code,
    status: result.code === 200 ? 'Success' : (notFound ? 'Not Found' : 'Forbidden'),
    ...(result.code === 200 ? { data: result.data } : { message: result.message })
});

const getClustersController = async (req, res) => {
    try {
        const result = await getClustersModel(req.user);
        if (result.code !== 200) {
            return sendResult(res, result);
        }
        const data = await hydrateStorageFields(result.data);
        res.set('Cache-Control', 'no-store');
        return res.status(200).json({
            code: 200,
            status: 'Success',
            data
        });
    } catch (err) {
        console.error('getClustersController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const getClusterByIdController = async (req, res) => {
    try {
        const result = await getClusterByIdModel(req.user, req.params.cluster_id);
        if (result.code !== 200) {
            return sendResult(res, result, result.code === 404);
        }
        const data = await hydrateStorageFields(result.data);
        res.set('Cache-Control', 'no-store');
        return res.status(200).json({
            code: 200,
            status: 'Success',
            data
        });
    } catch (err) {
        console.error('getClusterByIdController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const getClusterRecordingsController = async (req, res) => {
    try {
        const clusterId = req.params.cluster_id || req.query.cluster_id;
        if (!clusterId || typeof clusterId !== 'string' || !clusterId.trim()) {
            return res.status(400).json({ code: 400, status: 'Error', message: 'cluster_id is required.' });
        }
        const result = await getClusterRecordingsModel(req.user, clusterId.trim());
        if (result.code !== 200) {
            return sendResult(res, result, result.code === 404);
        }
        const recordings = await hydrateStorageFields(result.data);
        res.set('Cache-Control', 'no-store');
        return res.status(200).json({
            code: 200,
            status: 'Success',
            data: recordings,
            recordings
        });
    } catch (err) {
        console.error('getClusterRecordingsController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const getClusterRecordingCountsController = async (req, res) => {
    try {
        const result = await getClusterRecordingCountsModel(req.user);
        if (result.code !== 200) {
            return sendResult(res, result);
        }
        const data = await hydrateStorageFields(result.data);
        res.set('Cache-Control', 'no-store');
        return res.status(200).json({
            code: 200,
            status: 'Success',
            data
        });
    } catch (err) {
        console.error('getClusterRecordingCountsController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const getClusterRecordingDownloadController = async (req, res) => {
    const { cluster_id: clusterId, recording_id: recordingId } = req.params;
    const fileType = req.query.file;
    if (!clusterId || !recordingId) {
        return res.status(400).json({ message: 'Invalid cluster or recording ID.' });
    }
    if (!['recording', 'audio', 'image', 'manifest'].includes(fileType)) {
        return res.status(400).json({ message: 'Choose a recording, audio, image, or manifest file.' });
    }
    let index = null;
    if (fileType !== 'manifest') {
        index = Number(req.query.index);
        if (!Number.isInteger(index) || index < 0) {
            return res.status(400).json({ message: 'Invalid file index.' });
        }
    }
    try {
        const recording = await getClusterRecordingDownloadModel(req.user, clusterId, recordingId);
        if (!recording) return res.status(404).json({ message: 'Recording not found.' });
        const fields = { recording: 'rec_files', audio: 'audio_files', image: 'image_files' };
        const files = fileType === 'manifest' ? null : recording[fields[fileType]];
        const reference = fileType === 'manifest'
            ? recording.manifest_file
            : (Array.isArray(files) ? files[index] : null);
        if (!reference) return res.status(404).json({ message: 'File reference not found.' });
        const signedUrl = await signAsset(reference, { downloadName: `${recordingId}_${fileType}.bin` });
        return res.status(200).json({
            url: signedUrl,
            filename: `${recordingId}_${fileType}.bin`
        });
    } catch (error) {
        console.error('getClusterRecordingDownloadController error:', error);
        return res.status(500).json({ message: 'Unable to download recording file.' });
    }
};

const createClusterController = async (req, res) => {
    try {
        const result = await createClusterModel(req.user, req.body || {});
        return sendResult(res, result);
    } catch (err) {
        console.error('createClusterController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const updateClusterController = async (req, res) => {
    try {
        const result = await updateClusterModel(req.user, req.params.cluster_id, req.body || {});
        return sendResult(res, result, result.code === 404);
    } catch (err) {
        console.error('updateClusterController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const deleteClusterController = async (req, res) => {
    try {
        const result = await deleteClusterModel(req.user, req.params.cluster_id);
        return sendResult(res, result, result.code === 404);
    } catch (err) {
        console.error('deleteClusterController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const { volRecordingC } = require('./VolumeController');
const client = require('../utils/conn');

const uploadClusterRecordingController = async (req, res) => {
    try {
        const clusterId = req.params.cluster_id || req.body.cluster_id;
        if (!req.body.volume_id && clusterId) {
            const volRes = await client.query(
                `SELECT volume_id FROM public.cluster_volumes WHERE cluster_id = $1 LIMIT 1`,
                [clusterId]
            );
            if (volRes.rows.length > 0) {
                req.body.volume_id = volRes.rows[0].volume_id;
            }
        }

        const originalJson = res.json.bind(res);
        res.json = async function(body) {
            try {
                const recId = body?.data?.data?.recording_id || body?.data?.recording_id || body?.recording_id;
                if (clusterId && recId) {
                    await client.query(`
                        INSERT INTO public.cluster_recordings (cluster_id, recording_id)
                        VALUES ($1, $2::uuid)
                        ON CONFLICT (cluster_id, recording_id) DO NOTHING;
                    `, [clusterId, recId]);
                }
            } catch (err) {
                console.warn('Failed to link cluster recording:', err.message);
            }
            return originalJson(body);
        };

        return await volRecordingC(req, res);
    } catch (err) {
        console.error('uploadClusterRecordingController error:', err);
        return res.status(500).json({ code: 500, status: 'Error', message: err.message });
    }
};

const replaceClusterRecordingController = async (req, res) => {
    const requester = req.user;
    let recordingId = req.params.recording_id || req.body.recording_id;
    const clusterId = req.params.cluster_id || req.body.cluster_id;

    try {
        if (!recordingId && clusterId) {
            const recType = req.body.recording_type || 'step';
            const findRec = await client.query(
                `SELECT vr.recording_id 
                 FROM public.cluster_recordings cr
                 JOIN public.vol_recordings vr ON vr.recording_id = cr.recording_id
                 WHERE cr.cluster_id = $1 AND LOWER(TRIM(vr.recording_type)) = LOWER(TRIM($2))
                 ORDER BY vr.created_at DESC LIMIT 1`,
                [clusterId, recType]
            );
            if (findRec.rows.length > 0) {
                recordingId = findRec.rows[0].recording_id;
            }
        }

        if (!recordingId) {
            return res.status(400).json({ error: 'recording_id is required to replace recording files.' });
        }

        const recResult = await client.query(
            `SELECT vr.*, v.owner_scope, v.owner_centre_id, v.volume_id
             FROM public.vol_recordings vr
             JOIN public.volumes v ON v.volume_id = vr.volume_id
             WHERE vr.recording_id = $1`,
            [recordingId]
        );

        if (recResult.rows.length === 0) {
            return res.status(404).json({ error: 'Recording not found.' });
        }

        const existingRec = recResult.rows[0];
        const ownedVolume = await assertVolumeEditableModel(requester, existingRec.volume_id);
        if (!ownedVolume) {
            return res.status(403).json({ error: 'You do not have permission to modify this recording.' });
        }

        const storagePrefix = `${ownerPrefix(requester, ownedVolume)}/${existingRec.volume_id}`;
        const timestamp = Date.now();

        const recording_files = req.files?.recording_file || req.files?.recording_files || req.files?.rec_files || [];
        const audio_files = req.files?.audio_file || req.files?.audio_files || [];
        const image_files = req.files?.images || req.files?.image_files || [];
        const manifest_file = req.files?.manifest_file?.[0] || req.files?.manifest?.[0];
        const recording_name = req.body.recording_name?.trim();

        const updates = [];
        const values = [];
        let paramIdx = 1;

        // 1. Replace JSON files if provided
        if (recording_files.length > 0) {
            for (let i = 0; i < recording_files.length; i++) {
                const f = recording_files[i];
                const ext = path.extname(f.originalname).slice(1).toLowerCase();
                if (ext !== 'json') {
                    return res.status(400).json({ error: `File ${f.originalname} is not a valid .json file.` });
                }
                try {
                    JSON.parse(f.buffer.toString('utf-8'));
                } catch (e) {
                    return res.status(400).json({ error: `File ${f.originalname} contains invalid JSON.` });
                }
            }

            const uploadedRecordings = [];
            for (let i = 0; i < recording_files.length; i++) {
                const f = recording_files[i];
                const jsonKey = `${storagePrefix}/recordings/${timestamp}_${i}.json`;
                const uploaded = await uploadAsset({
                    sourceBucket: contentBucket(),
                    objectKey: jsonKey,
                    body: f.buffer,
                    contentType: 'application/json',
                    upsert: true,
                });
                uploadedRecordings.push(uploaded.reference);
            }
            updates.push(`rec_files = $${paramIdx++}`);
            values.push(JSON.stringify(uploadedRecordings));
        }

        // 2. Replace Audio files if provided
        if (audio_files.length > 0) {
            for (let i = 0; i < audio_files.length; i++) {
                const f = audio_files[i];
                const ext = path.extname(f.originalname).slice(1).toLowerCase();
                if (ext !== 'wav') {
                    return res.status(400).json({ error: `Audio file ${f.originalname} must be .wav format.` });
                }
            }

            const uploadedAudio = [];
            for (let i = 0; i < audio_files.length; i++) {
                const f = audio_files[i];
                const audioKey = `${storagePrefix}/audio/${timestamp}_${i}.wav`;
                const uploaded = await uploadAsset({
                    sourceBucket: contentBucket(),
                    objectKey: audioKey,
                    body: f.buffer,
                    contentType: 'audio/wav',
                    upsert: true,
                });
                uploadedAudio.push(uploaded.reference);
            }
            updates.push(`audio_files = $${paramIdx++}`);
            values.push(JSON.stringify(uploadedAudio));
        }

        // 3. Replace Image files if provided
        if (image_files.length > 0) {
            const imageContentTypes = {
                png: 'image/png',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                webp: 'image/webp',
                gif: 'image/gif',
                bmp: 'image/bmp',
            };
            const uploadedImages = [];
            for (let i = 0; i < image_files.length; i++) {
                const f = image_files[i];
                const ext = path.extname(f.originalname).slice(1).toLowerCase();
                if (!imageContentTypes[ext]) {
                    return res.status(400).json({ error: `Image file ${f.originalname} has unsupported format.` });
                }
                const imageKey = `${storagePrefix}/images/${timestamp}_${i}.${ext}`;
                const uploaded = await uploadAsset({
                    sourceBucket: contentBucket(),
                    objectKey: imageKey,
                    body: f.buffer,
                    contentType: imageContentTypes[ext],
                    upsert: true,
                });
                uploadedImages.push(uploaded.reference);
            }
            updates.push(`image_files = $${paramIdx++}`);
            values.push(JSON.stringify(uploadedImages));
        }

        // 4. Replace Manifest file if provided
        if (manifest_file) {
            const ext = path.extname(manifest_file.originalname).slice(1).toLowerCase();
            const manifestContentTypes = { json: 'application/json', manifest: 'text/plain' };
            if (!manifestContentTypes[ext]) {
                return res.status(400).json({ error: 'Manifest file must be .json or .manifest.' });
            }
            const manifestKey = `${storagePrefix}/manifests/${timestamp}.${ext}`;
            const uploaded = await uploadAsset({
                sourceBucket: contentBucket(),
                objectKey: manifestKey,
                body: manifest_file.buffer,
                contentType: manifestContentTypes[ext],
                upsert: true,
            });
            updates.push(`manifest_file = $${paramIdx++}`);
            values.push(uploaded.reference);
        }

        // 5. Update recording name if provided
        if (recording_name) {
            updates.push(`recording_name = $${paramIdx++}`);
            values.push(recording_name);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No files or changes provided to replace.' });
        }

        values.push(recordingId);
        const updateQuery = `
            UPDATE public.vol_recordings
            SET ${updates.join(', ')}
            WHERE recording_id = $${paramIdx}
            RETURNING *;
        `;

        const updateResult = await client.query(updateQuery, values);
        if (clusterId && recordingId) {
            try {
                await client.query(`
                    INSERT INTO public.cluster_recordings (cluster_id, recording_id)
                    VALUES ($1, $2::uuid)
                    ON CONFLICT (cluster_id, recording_id) DO NOTHING;
                `, [clusterId, recordingId]);
            } catch (linkErr) {
                console.warn('Failed to link cluster recording on replace:', linkErr.message);
            }
        }
        return res.status(200).json({
            status: 'Success',
            code: 200,
            message: 'Recording files replaced successfully',
            data: updateResult.rows[0],
        });
    } catch (err) {
        console.error('replaceClusterRecordingController error:', err);
        return res.status(500).json({ error: 'Internal server error', message: err.message });
    }
};

module.exports = {
    getClustersController,
    getClusterByIdController,
    getClusterRecordingsController,
    getClusterRecordingCountsController,
    getClusterRecordingDownloadController,
    uploadClusterRecordingController,
    replaceClusterRecordingController,
    createClusterController,
    updateClusterController,
    deleteClusterController
};
