const test = require('node:test');
const assert = require('node:assert/strict');
const { S3Client } = require('@aws-sdk/client-s3');

process.env.AWS_S3_BUCKET = 'content-test';
const volumeId = 'c66caf93-83f7-47b9-8edb-2f6ca6f17b9b';
const prefix = `projectanu/converted_vol_files/enhanced/${volumeId}/`;
let rows = [{ enhancement_status: 'completed', enhancement_manifest: `${prefix}manifest.json` }];
let listCalls = 0;

const dbPath = require.resolve('../utils/conn');
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: { query: async (sql, params) => {
    assert.match(sql, /v\.added_by = \$2/);
    assert.deepEqual(params, [volumeId, 'owner@example.test']);
    return { rowCount: rows.length, rows };
  } },
};

const presignerPath = require.resolve('@aws-sdk/s3-request-presigner');
const realPresigner = require.cache[presignerPath];
require.cache[presignerPath] = {
  id: presignerPath, filename: presignerPath, loaded: true,
  exports: { getSignedUrl: async (_, command) => `https://example.test/${command.input.Key}` },
};

const originalSend = S3Client.prototype.send;
S3Client.prototype.send = async function () {
  listCalls++;
  return { Contents: [
    { Key: `${prefix}frame_01.nrrd`, Size: 20 },
    { Key: `${prefix}previews/f00_axial.pgm`, Size: 5 },
    { Key: `${prefix}frame_00.nrrd`, Size: 10 },
    { Key: `${prefix}manifest.json`, Size: 100 },
  ] };
};

const { listEnhancedFiles } = require('../controller/volumeEnhancement');
const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  set() { return this; },
  json(body) { this.body = body; return this; },
});
const request = (role = 102) => ({
  params: { volume_id: volumeId },
  user: { user_mail: 'owner@example.test', role, centre_id: 'centre-a' },
});

test('lists only stored NRRD frames in order for an authorized volume', async () => {
  const res = response();
  await listEnhancedFiles(request(), res);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.frame_count, 2);
  assert.deepEqual(res.body.files.map(file => file.name), ['frame_00.nrrd', 'frame_01.nrrd']);
  assert.equal(res.body.files[0].size, 10);
  assert.match(res.body.files[0].url, /frame_00\.nrrd$/);
  assert.equal(listCalls, 1);
});

test('trainees cannot list enhanced files', async () => {
  listCalls = 0;
  const res = response();
  await listEnhancedFiles(request(103), res);
  assert.equal(res.statusCode, 403);
  assert.equal(listCalls, 0);
});

test('files are unavailable until enhancement completes', async () => {
  rows = [{ enhancement_status: 'running', enhancement_manifest: null }];
  listCalls = 0;
  const res = response();
  await listEnhancedFiles(request(), res);
  assert.equal(res.statusCode, 409);
  assert.equal(listCalls, 0);
});

test.after(() => {
  S3Client.prototype.send = originalSend;
  require.cache[presignerPath] = realPresigner;
});
