const express = require('express');
const {getVolumeInstructorViewController, getVolumeDownloadController, getVolumeRecordingDownloadListController, getVolumeRecordingDownloadController} = require('../controller/VolumeController');
const getVolumeByInstructorRouter = express.Router();
getVolumeByInstructorRouter.get('/get-volumes-by-instructor', getVolumeInstructorViewController);
getVolumeByInstructorRouter.get('/volumes/:volume_id/download', getVolumeDownloadController);
getVolumeByInstructorRouter.get('/volumes/:volume_id/recordings', getVolumeRecordingDownloadListController);
getVolumeByInstructorRouter.get('/volumes/:volume_id/recordings/:recording_id/download', getVolumeRecordingDownloadController);
module.exports = getVolumeByInstructorRouter;
