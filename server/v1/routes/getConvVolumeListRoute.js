const express = require('express');
const getConvVolumeListRouter = express.Router();
const {getConvVolumeListController} = require('../controller/VolumeController.js');
getConvVolumeListRouter.get('/converted-volumes', getConvVolumeListController);
module.exports = getConvVolumeListRouter;