const express = require('express');
const {shadowRecordingDataController, volumeRecordingCountsController} = require('../controller/VolumeController.js');
const GetShadowRecordingRouter = express.Router();
GetShadowRecordingRouter.get('/shadow-recordings', shadowRecordingDataController);
GetShadowRecordingRouter.get('/shadow-recording-counts', volumeRecordingCountsController);
GetShadowRecordingRouter.get('/volume-recording-counts', volumeRecordingCountsController);
module.exports = GetShadowRecordingRouter;
