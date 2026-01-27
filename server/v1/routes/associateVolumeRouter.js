const express = require('express');
const associateVolumeRouter = express.Router();
const {assocVolumeController} = require('../controller/VolumeController.js');
associateVolumeRouter.post('/associateVolume', assocVolumeController);
module.exports = associateVolumeRouter;