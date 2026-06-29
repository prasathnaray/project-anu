const express = require('express');
const {VolumeController} = require('../controller/VolumeController')
const multer = require('multer');

const MAX_VOLUME_UPLOAD_SIZE_MB = Number(process.env.MAX_VOLUME_UPLOAD_SIZE_MB || 100);
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_VOLUME_UPLOAD_SIZE_MB * 1024 * 1024,
        files: 1,
    }
});

const svUploadRouter = express.Router();
svUploadRouter.post('/sv-upload', upload.single('file'), VolumeController);

svUploadRouter.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: `Volume file is too large. Maximum allowed size is ${MAX_VOLUME_UPLOAD_SIZE_MB}MB.`
        });
    }

    return next(err);
});

module.exports = svUploadRouter;
