const express = require('express');
const updateVolumeConRouter = express.Router();
const { updateVolumeConController } = require('../controller/VolumeController.js');
updateVolumeConRouter.put('/convert-vol/:volume_id', updateVolumeConController);
module.exports = updateVolumeConRouter;