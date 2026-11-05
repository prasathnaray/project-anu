const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

function fixture() {
    const user = { user_mail: 'test@example.com', role: 101, centre_id: 'center' };
    const state = { token: null, sql: [], missing: false, malformed: false, sizeMismatch: false };
    const db = { query: async (sql, params) => {
        state.sql.push(sql);
        if (sql.startsWith('SELECT owner_scope')) return { rows: [{ owner_scope: 'institution', owner_centre_id: 'center' }] };
        if (sql.startsWith('SELECT volume_id')) return { rows: [{ volume_id: 'volume' }] };
        if (sql.startsWith('INSERT INTO vol_recordings')) return { rows: [{ recording_id: params[0] }] };
        return { rows: [] };
    }, release() {} };
    const command = class { constructor(input) { this.input = input; } };
    const deps = {
        '../utils/conn': { ...db, connect: async () => db },
        '../model/Volumem': { assertVolumeEditableModel: async () => ({ volume_id: 'volume' }) },
        '../Auth/authorization': require('../Auth/authorization'),
        jsonwebtoken: { sign: (payload) => { state.token = payload; return 'signed'; }, verify: () => state.token },
        '@aws-sdk/s3-request-presigner': { getSignedUrl: async () => 'https://s3.example/signed' },
        '@aws-sdk/client-s3': {
            PutObjectCommand: command, HeadObjectCommand: command, GetObjectCommand: command,
            S3Client: class { async send(cmd) {
                if (state.missing) throw Object.assign(new Error('Missing upload'), { name: 'NoSuchKey' });
                const asset = state.token.assets.find((f) => f.key === cmd.input.Key);
                return { ContentLength: state.sizeMismatch ? 1 : asset.size, ContentType: asset.contentType,
                    Body: { transformToString: async () => state.malformed ? 'invalid' : '{}' } };
            } }
        }
    };
    const exports = {};
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../controller/directRecordingUpload.js'), 'utf8'), {
        require: (id) => deps[id] || require(id), exports, console,
        process: { env: { AWS_S3_BUCKET: 'test', ACCESS_TOKEN_SECRET: 'test' } }
    });
    const req = { user, params: { cluster_id: 'cluster' }, body: { recording_name: 'Test', recording_type: 'step', files: [
        { field: 'recording_file', filename: 'recording.json', size: 19 * 1024 * 1024 },
        { field: 'audio_file', filename: 'audio.wav', size: 100 },
        { field: 'images', filename: 'image.png', size: 100 },
        { field: 'manifest_file', filename: 'manifest.json', size: 2 }
    ] } };
    const response = () => ({ code: 200, set() { return this; }, status(c) { this.code = c; return this; }, json(body) { this.body = body; return this; } });
    return { api: exports, req, state, response };
}

test('19 MiB file uses signed direct PUT and completion atomically saves cluster recording', async () => {
    const { api, req, state, response } = fixture();
    const res = response();
    await api.prepare(req, res);
    assert.equal(res.code, 200);
    assert.equal(res.body.uploads.length, 4);
    assert.equal(res.body.uploads[0].headers['If-None-Match'], '*');
    req.body = { uploadToken: res.body.uploadToken };
    await api.complete(req, res);
    assert.equal(res.code, 200);
    assert.ok(state.sql.includes('COMMIT'));
    assert.ok(state.sql.some((s) => s.includes('ON CONFLICT (recording_id) DO NOTHING')));
});

for (const issue of ['missing', 'malformed', 'sizeMismatch', 'wrongOwner', 'wrongCluster']) {
    test(`completion rejects ${issue} before saving recording`, async () => {
        const { api, req, state, response } = fixture();
        await api.prepare(req, response());
        req.body = { uploadToken: 'signed' };
        if (issue === 'wrongOwner') req.user.user_mail = 'another@example.com';
        else if (issue === 'wrongCluster') req.params.cluster_id = 'other';
        else state[issue] = true;
        const res = response();
        await api.complete(req, res);
        assert.ok([400, 403].includes(res.code));
        assert.ok(!state.sql.some((s) => s.startsWith('INSERT INTO vol_recordings')));
    });
}

test('preparation rejects missing groups, oversized files and unsupported extensions', async () => {
    for (const mutate of [r => r.body.files.pop(), r => r.body.files[0].size = 101 * 1024 * 1024, r => r.body.files[0].filename = 'bad.exe']) {
        const { api, req, response } = fixture();
        mutate(req);
        const res = response();
        await api.prepare(req, res);
        assert.equal(res.code, 400);
    }
});
