const express = require('express');
const {VolumeController} = require('../controller/VolumeController')
const svUploadRouter = express.Router();
svUploadRouter.post('/sv-upload', VolumeController)
module.exports = svUploadRouter;
