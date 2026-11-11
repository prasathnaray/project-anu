const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { once } = require('events');
const { createRouter, validateJsonFile, MAX_FILE_BYTES } = require('../routes/singleRecordingUpload');

async function send(port, size, route = '/api/v1/recordings/new-upload') {
    const req = http.request({ hostname: '127.0.0.1', port, method: 'POST', path: route,
        headers: { 'Content-Type': 'multipart/form-data; boundary=recording-test' } });
    const response = new Promise((resolve, reject) => {
        req.on('error', reject);
        req.on('response', res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ code: res.statusCode, body: JSON.parse(body) }));
        });
    });
    req.write('--recording-test\r\nContent-Disposition: form-data; name="recording_type"\r\n\r\nstep\r\n');
    req.write('--recording-test\r\nContent-Disposition: form-data; name="audio_file"; filename="large.wav"\r\nContent-Type: audio/wav\r\n\r\n');
    const chunk = Buffer.alloc(1024 * 1024);
    for (let left = size; left > 0; left -= chunk.length) {
        if (!req.write(chunk.subarray(0, Math.min(left, chunk.length)))) await once(req, 'drain');
    }
    req.end('\r\n--recording-test--\r\n');
    return response;
}

test('single multipart request receives exactly 500 MiB on disk and cleans temporary files', async () => {
    let uploadedPath;
    const app = express();
    app.use((req, _res, next) => { req.user = { user_mail: 'test@example.com', role: 101 }; next(); });
    app.use('/api/v1', createRouter({ save: async ({ files, body }) => {
        uploadedPath = files[0].path;
        assert.equal(body.recording_type, 'step');
        assert.equal(files[0].size, MAX_FILE_BYTES);
        assert.equal((await fs.stat(uploadedPath)).size, MAX_FILE_BYTES);
        assert.equal(files[0].buffer, undefined);
        return { recording_id: 'saved' };
    } }));
    const server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
        const result = await send(server.address().port, MAX_FILE_BYTES);
        assert.equal(result.code, 200);
        assert.equal(result.body.recording_id, 'saved');
        const oversized = await send(server.address().port, MAX_FILE_BYTES + 1);
        assert.equal(oversized.code, 413);
        // Cleanup runs after the response is sent.
        for (let i = 0; i < 100; i++) {
            try { await fs.stat(uploadedPath); } catch (error) { if (error.code === 'ENOENT') return; throw error; }
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        assert.fail('Temporary upload file was not removed');
    } finally { await new Promise(resolve => server.close(resolve)); }
});

test('streaming JSON validation rejects malformed JSON without assembling an object', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'recording-json-test-'));
    const filename = path.join(directory, 'recording.json');
    try {
        await fs.writeFile(filename, '{"frames":[1,2,3]}');
        await validateJsonFile(filename);
        await fs.writeFile(filename, '{"frames":[1,2,}');
        await assert.rejects(validateJsonFile(filename));
    } finally { await fs.rm(directory, { recursive: true, force: true }); }
});
