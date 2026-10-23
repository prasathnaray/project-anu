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
const { signAsset } = require('../utils/storageAdapter');
const { hydrateStorageFields } = require('../utils/hydrateStorageFields');

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

module.exports = {
    getClustersController,
    getClusterByIdController,
    getClusterRecordingsController,
    getClusterRecordingCountsController,
    getClusterRecordingDownloadController,
    createClusterController,
    updateClusterController,
    deleteClusterController
};
