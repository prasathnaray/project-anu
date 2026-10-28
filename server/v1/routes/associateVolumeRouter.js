const express = require('express');
const associateVolumeRouter = express.Router();
const { assocVolumeController } = require('../controller/volumeController.js');
associateVolumeRouter.post('/associateVolume', assocVolumeController);
module.exports = associateVolumeRouter;