const express = require('express');
const multer = require('multer');
const {
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
} = require('../controller/clusterController');

const clusterRouter = express.Router();

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 61 // Allow up to 20 JSON, 20 audio, 20 image, and 1 manifest file
    }
});

// List all cluster data (like /get-volumes for volumes)
clusterRouter.get('/clusters', getClustersController);
clusterRouter.get('/get-clusters', getClustersController);
clusterRouter.get('/cluster', getClustersController);

// Recordings are isolated separately (like /volumes/:volume_id/recordings and /volume-recording-counts)
clusterRouter.get('/clusters/recording-counts', getClusterRecordingCountsController);
clusterRouter.get('/cluster-recording-counts', getClusterRecordingCountsController);
clusterRouter.get('/clusters/recordings', getClusterRecordingsController);
clusterRouter.get('/cluster-recordings', getClusterRecordingsController);
clusterRouter.get('/clusters/:cluster_id/recordings', getClusterRecordingsController);
clusterRouter.get('/clusters/:cluster_id/recordings/:recording_id/download', getClusterRecordingDownloadController);

const recordingUploadFields = upload.fields([
    { name: 'recording_file', maxCount: 20 },
    { name: 'recording_files', maxCount: 20 },
    { name: 'rec_files', maxCount: 20 },
    { name: 'audio_file', maxCount: 20 },
    { name: 'audio_files', maxCount: 20 },
    { name: 'images', maxCount: 20 },
    { name: 'image_files', maxCount: 20 },
    { name: 'manifest_file', maxCount: 1 },
    { name: 'manifest', maxCount: 1 }
]);

// Upload cluster recording files (JSON, audio, image, manifest)
clusterRouter.post('/clusters/:cluster_id/recordings',
    recordingUploadFields,
    uploadClusterRecordingController
);

// Replace / update cluster recording files (JSON, audio, image, manifest)
clusterRouter.put('/clusters/:cluster_id/recordings/:recording_id',
    recordingUploadFields,
    replaceClusterRecordingController
);

clusterRouter.post('/clusters/:cluster_id/recordings/replace',
    recordingUploadFields,
    replaceClusterRecordingController
);

clusterRouter.put('/clusters/:cluster_id/recordings/replace',
    recordingUploadFields,
    replaceClusterRecordingController
);

clusterRouter.post('/clusters/recordings/replace',
    recordingUploadFields,
    replaceClusterRecordingController
);

clusterRouter.put('/clusters/recordings/replace',
    recordingUploadFields,
    replaceClusterRecordingController
);

// Single cluster details & mutations
clusterRouter.get('/clusters/:cluster_id', getClusterByIdController);
clusterRouter.get('/cluster/:cluster_id', getClusterByIdController);
clusterRouter.post('/clusters', createClusterController);
clusterRouter.post('/cluster', createClusterController);
clusterRouter.post('/create-cluster', createClusterController);
clusterRouter.post('/add-cluster', createClusterController);
clusterRouter.put('/clusters/:cluster_id', updateClusterController);
clusterRouter.put('/cluster/:cluster_id', updateClusterController);
clusterRouter.delete('/clusters/:cluster_id', deleteClusterController);
clusterRouter.delete('/cluster/:cluster_id', deleteClusterController);

module.exports = clusterRouter;
