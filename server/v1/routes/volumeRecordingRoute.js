const express = require('express');
const volumeRecordingRouter = express.Router();
const {volRecordingC, getRecordingsController} = require('../controller/VolumeController');
const multer = require('multer');

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB per file
        files: 61 // Allow up to 20 JSON, 20 audio, 20 image, and 1 manifest file
    }
});

volumeRecordingRouter.get('/recordings', getRecordingsController);

// Route with multiple file upload middleware
// Both recording types accept repeated recording/audio/image files and one manifest.
volumeRecordingRouter.post('/uploadvolumerecording', 
    upload.fields([
        { name: 'recording_file', maxCount: 20 },
        { name: 'audio_file', maxCount: 20 },
        { name: 'images', maxCount: 20 },
        { name: 'manifest_file', maxCount: 1 }
    ]),
    volRecordingC
);

module.exports = volumeRecordingRouter;
