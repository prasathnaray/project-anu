const express = require('express');
const volumeRecordingRouter = express.Router();
const {volRecordingC} = require('../controller/VolumeController');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 60 // Allow up to 20 JSON, 20 audio, and 20 image files
    }
});

// Route with multiple file upload middleware
// Both shadow and step recordings can upload multiple files of each type.
volumeRecordingRouter.post('/uploadvolumerecording', 
    upload.fields([
        { name: 'recording_file', maxCount: 20 },
        { name: 'audio_file', maxCount: 20 },
        { name: 'images', maxCount: 20 }
    ]),
    volRecordingC
);

module.exports = volumeRecordingRouter;
