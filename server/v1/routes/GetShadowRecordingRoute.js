const express = require('express');
const {shadowRecordingDataController} = require('../controller/VolumeController.js');
const GetShadowRecordingRouter = express.Router();
GetShadowRecordingRouter.get('/shadow-recordings', shadowRecordingDataController);
module.exports = GetShadowRecordingRouter;