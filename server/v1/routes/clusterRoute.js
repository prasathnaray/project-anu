const express = require('express');
const {
    getClustersController,
    getClusterByIdController,
    getClusterRecordingsController,
    getClusterRecordingCountsController,
    getClusterRecordingDownloadController,
    createClusterController,
    updateClusterController,
    deleteClusterController
} = require('../controller/ClusterController');

const clusterRouter = express.Router();

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
