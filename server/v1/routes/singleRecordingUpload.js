const express = require('express');
const multer = require('multer');
const fs = require('fs');
const fsp = require('fs/promises');
const os = require('os');
const path = require('path');
const { randomUUID } = require('crypto');
const { Transform, Writable } = require('stream');
const { pipeline } = require('stream/promises');
const { parser } = require('stream-json');
const { requireRole, COURSE_EDITOR_ROLES } = require('../Auth/authorization');

const MAX_FILE_BYTES = 500 * 1024 * 1024;
const MAX_PACKAGE_BYTES = 2 * 1024 * 1024 * 1024;
const aliases = { recording_file: 'recording_file', recording_files: 'recording_file', rec_files: 'recording_file',
    audio_file: 'audio_file', audio_files: 'audio_file', images: 'images', image_files: 'images',
    manifest: 'manifest_file', manifest_file: 'manifest_file' };

async function validateJsonFile(filename) {
    await pipeline(fs.createReadStream(filename), parser({ packValues: false, packKeys: false, packStrings: false, packNumbers: false }),
        new Writable({ objectMode: true, write(_token, _encoding, done) { done(); } }));
}

// Keep file bytes on disk, with a shared package limit checked during receipt.
const storage = {
    _handleFile(req, file, callback) {
        const filename = path.join(req.uploadDirectory, randomUUID());
        let size = 0;
        const counter = new Transform({ transform(chunk, encoding, done) {
            size += chunk.length;
            req.uploadBytes += chunk.length;
            if (req.uploadBytes > MAX_PACKAGE_BYTES) {
                return done(Object.assign(new Error('Recording package exceeds 2 GiB.'), { status: 413 }));
            }
            done(null, chunk);
        } });
        pipeline(file.stream, counter, fs.createWriteStream(filename), { signal: req.uploadAbort.signal })
            .then(() => callback(null, { path: filename, size }), callback);
    },
    _removeFile(_req, file, callback) { fs.unlink(file.path, callback); }
};
const receive = multer({ storage, limits: { fileSize: MAX_FILE_BYTES + 1, files: 61, fields: 8, fieldSize: 8192 },
    fileFilter(_req, file, callback) {
        callback(aliases[file.fieldname] ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname), true);
    }
}).any();

function createRouter({ save = require('../controller/singleRecordingUpload').save } = {}) {
    const router = express.Router();
    let active = 0;
    const upload = async (req, res) => {
        let directory;
        let admitted = false;
        const abort = new AbortController();
        const onClose = () => { if (!res.writableEnded) abort.abort(); };
        res.on('close', onClose);
        try {
            requireRole(req.user, COURSE_EDITOR_ROLES);
            if (active >= 2) return res.set('Retry-After', '30').status(503).json({ message: 'Upload server busy. Please retry shortly.' });
            active++;
            admitted = true;
            if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
                return res.status(503).json({ message: 'Large multipart uploads require the dedicated upload server.' });
            }
            if (!req.is('multipart/form-data')) return res.status(415).json({ message: 'Send multipart/form-data with recording files.' });
            directory = await fsp.mkdtemp(path.join(os.tmpdir(), 'anu-recording-'));
            req.uploadDirectory = directory;
            req.uploadAbort = abort;
            req.uploadBytes = 0;
            await new Promise((resolve, reject) => receive(req, res, error => error ? reject(error) : resolve()));
            const files = req.files.map(file => ({ ...file, field: aliases[file.fieldname] }));
            if (files.some(file => file.size > MAX_FILE_BYTES)) throw new multer.MulterError('LIMIT_FILE_SIZE');
            const result = await save({ user: req.user, clusterId: req.params.cluster_id || req.body.cluster_id,
                body: req.body, files, signal: abort.signal, validateJsonFile });
            res.set('Cache-Control', 'no-store').status(200).json(result);
        } catch (error) {
            if (!res.destroyed && !res.headersSent) {
                const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : error instanceof multer.MulterError ? 400 : error.status || error.statusCode || 500;
                res.status(status).json({ message: error.code === 'LIMIT_FILE_SIZE' ? 'Maximum file size is 500 MiB.' :
                    status === 500 ? 'Unable to save recording. Please retry.' : error.message });
            }
        } finally {
            res.off('close', onClose);
            if (admitted) active--;
            if (directory) await fsp.rm(directory, { recursive: true, force: true });
        }
    };
    router.post('/recordings/new-upload', upload);
    // Existing clients can retain their original path when routed to this server.
    router.post('/clusters/:cluster_id/recordings', upload);
    return router;
}

module.exports = { createRouter, validateJsonFile, MAX_FILE_BYTES, MAX_PACKAGE_BYTES };
