const express = require('express');
const {getVolumeDataC} = require('../controller/VolumeController');
const getVolumeDataRouter = express.Router();
getVolumeDataRouter.get('/get-volumes', getVolumeDataC);
module.exports = getVolumeDataRouter;