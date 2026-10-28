const express = require('express');
const { VolumeController, updateVolumeC } = require('../controller/volumeController')
const multer = require('multer');

const path = require('path');

const MAX_VOLUME_UPLOAD_SIZE_MB = Number(process.env.MAX_VOLUME_UPLOAD_SIZE_MB || 100);
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_VOLUME_UPLOAD_SIZE_MB * 1024 * 1024,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase();
        if (ext !== '.vol') {
            const err = new Error('Only .vol files are allowed.');
            err.code = 'INVALID_FILE_TYPE';
            return cb(err);
        }
        cb(null, true);
    }
});

const svUploadRouter = express.Router();
svUploadRouter.post('/sv-upload', upload.single('file'), VolumeController);
svUploadRouter.put('/update-volume', updateVolumeC);

svUploadRouter.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: `Volume file is too large. Maximum allowed size is ${MAX_VOLUME_UPLOAD_SIZE_MB}MB.`
        });
    }

    if (err?.code === 'INVALID_FILE_TYPE' || err?.message === 'Only .vol files are allowed.') {
        return res.status(400).json({
            error: 'Only .vol files are allowed.',
            message: 'Only .vol files are allowed.'
        });
    }

    return next(err);
});

module.exports = svUploadRouter;
