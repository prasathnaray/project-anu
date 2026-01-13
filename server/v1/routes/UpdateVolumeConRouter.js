const express = require('express');
const updateVolumeConRouter = express.Router();
const {convertVolumeLimiter} = require('../utils/convertVolumeLimiter.js');
const { updateVolumeConController } = require('../controller/VolumeController.js');
updateVolumeConRouter.put('/convert-vol/:volume_id', convertVolumeLimiter, updateVolumeConController);
module.exports = updateVolumeConRouter;