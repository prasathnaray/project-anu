const express = require('express');
const volumeRecordingRouter = express.Router();
const { volRecordingC, getRecordingsController } = require('../controller/volumeController');
const multer = require('multer');

const MAX_RECORDING_UPLOAD_SIZE_MB = Number(
    process.env.MAX_RECORDING_UPLOAD_SIZE_MB || process.env.MAX_VOLUME_UPLOAD_SIZE_MB || 100
);

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_RECORDING_UPLOAD_SIZE_MB * 1024 * 1024,
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
