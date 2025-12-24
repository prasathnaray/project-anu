const express = require('express');
const {VolumeController} = require('../controller/VolumeController')
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const svUploadRouter = express.Router();
svUploadRouter.post('/sv-upload', upload.single('file'), VolumeController)
module.exports = svUploadRouter;