const express = require('express');
const volumeRecordingRouter = express.Router();
const {volRecordingC} = require('../controller/VolumeController');
const multer = require('multer');

// Configure multer for memory storage (handles multiple files)
const upload = multer({ storage: multer.memoryStorage() });

// Route with multiple file upload middleware
volumeRecordingRouter.post('/uploadvolumerecording', 
    upload.fields([
        { name: 'recording_file', maxCount: 1 },
        { name: 'audio_file', maxCount: 1 }
    ]),
    volRecordingC
);

module.exports = volumeRecordingRouter;