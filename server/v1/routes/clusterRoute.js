const express = require('express');
const { getClustersController, getClusterByIdController } = require('../controller/ClusterController');

const clusterRouter = express.Router();
clusterRouter.get('/clusters', getClustersController);
clusterRouter.get('/clusters/:cluster_id', getClusterByIdController);

module.exports = clusterRouter;
