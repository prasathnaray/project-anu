const express = require('express');
const volumeRecordingRouter = express.Router();
const {volRecordingC} = require('../controller/VolumeController');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 40 // Allow up to 20 recording files + 20 audio files
    }
});

// Route with multiple file upload middleware
// maxCount allows multiple files for step recordings
// For shadow: only 1 file will be uploaded, but we allow up to 20 for step
volumeRecordingRouter.post('/uploadvolumerecording', 
    upload.fields([
        { name: 'recording_file', maxCount: 20 },  // Changed from 1 to 20
        { name: 'audio_file', maxCount: 20 }       // Changed from 1 to 20
    ]),
    volRecordingC
);

module.exports = volumeRecordingRouter;