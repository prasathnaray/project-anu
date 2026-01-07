const express = require('express');
const {getVolumeInstructorViewController} = require('../controller/VolumeController');
const getVolumeByInstructorRouter = express.Router();
getVolumeByInstructorRouter.get('/get-volumes-by-instructor', getVolumeInstructorViewController);
module.exports = getVolumeByInstructorRouter;