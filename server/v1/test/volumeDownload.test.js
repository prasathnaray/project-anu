const test = require('node:test');
const assert = require('node:assert/strict');

const modelPath = require.resolve('../model/Volumem');
const storagePath = require.resolve('../utils/storageAdapter');
let volume = null;
let recording = null;
let recordingList = [];
let signedOptions = null;
require.cache[modelPath] = {
  id: modelPath, filename: modelPath, loaded: true,
  exports: {
    getVolumeDownloadModel: async () => volume,
    getVolumeRecordingDownloadListModel: async () => recordingList,
    getVolumeRecordingDownloadModel: async () => recording
  }
};
require.cache[storagePath] = {
  id: storagePath, filename: storagePath, loaded: true,
  exports: {
    parseReference: (reference) => reference ? { objectKey: reference } : null,
    signAsset: async (_, options) => {
      signedOptions = options;
      return 'https://storage.example.test/fresh-download';
    },
    signAssets: async () => []
  }
};

const { getVolumeDownloadController, getVolumeRecordingDownloadListController,
  getVolumeRecordingDownloadController } = require('../controller/VolumeController');
const volumeId = 'c66caf93-83f7-47b9-8edb-2f6ca6f17b9b';
const recordingId = '8df34342-521f-4cbc-ab4d-5406e1b603cc';
const response = () => ({
  code: 200, body: null, headers: {},
  status(code) { this.code = code; return this; },
  set(name, value) { this.headers[name] = value; return this; },
  json(body) { this.body = body; return this; }
});
const request = (file) => ({
  params: { volume_id: volumeId }, query: { file },
  user: { user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' }
});

test('download endpoint rejects unknown volumes and invalid file selection', async () => {
  volume = null;
  const missing = response();
  await getVolumeDownloadController(request('source'), missing);
  assert.equal(missing.code, 404);
  const invalid = response();
  await getVolumeDownloadController(request('other'), invalid);
  assert.equal(invalid.code, 400);
});

test('source file gets a fresh attachment URL', async () => {
  volume = {
    volume_id: volumeId, volume_file: 'projectanu/source/cloud-ac.vol',
    conversion_completion: false, output_file: null
  };
  const res = response();
  await getVolumeDownloadController(request('source'), res);
  assert.equal(res.code, 200);
  assert.equal(res.body.filename, 'cloud-ac.vol');
  assert.equal(res.body.fileType, 'source');
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(signedOptions.downloadName, 'cloud-ac.vol');
});

test('converted download appears only after a stored conversion completes', async () => {
  volume = {
    volume_id: volumeId, volume_file: 'projectanu/source/cloud-ac.vol',
    conversion_completion: false, output_file: 'projectanu/converted/cloud-ac.nii'
  };
  const pending = response();
  await getVolumeDownloadController(request('converted'), pending);
  assert.equal(pending.code, 404);

  volume.conversion_completion = true;
  const completed = response();
  await getVolumeDownloadController(request('converted'), completed);
  assert.equal(completed.code, 200);
  assert.equal(completed.body.filename, 'cloud-ac.nii');
});

test('recording files are listed only for an accessible volume', async () => {
  volume = null;
  const denied = response();
  await getVolumeRecordingDownloadListController(request('source'), denied);
  assert.equal(denied.code, 404);

  volume = { volume_id: volumeId, volume_file: 'projectanu/source/cloud-ac.vol' };
  recordingList = [{ recording_id: recordingId, recording_name: 'Shadow', recording_count: 1 }];
  const listed = response();
  await getVolumeRecordingDownloadListController(request('source'), listed);
  assert.equal(listed.code, 200);
  assert.equal(listed.body.recordings[0].recording_name, 'Shadow');
  assert.equal(listed.headers['Cache-Control'], 'no-store');
});

test('recording downloads select only stored files and valid indexes', async () => {
  recording = {
    recording_id: recordingId,
    rec_files: ['projectanu/recordings/one.json'],
    audio_files: ['projectanu/audio/one.wav'],
    image_files: [], manifest_file: 'projectanu/manifests/manifest.json'
  };
  const req = {
    params: { volume_id: volumeId, recording_id: recordingId },
    query: { file: 'recording', index: '0' }, user: request('source').user
  };
  const json = response();
  await getVolumeRecordingDownloadController(req, json);
  assert.equal(json.code, 200);
  assert.equal(json.body.filename, 'one.json');
  assert.equal(signedOptions.downloadName, 'one.json');

  const missing = response();
  await getVolumeRecordingDownloadController({ ...req, query: { file: 'image', index: '0' } }, missing);
  assert.equal(missing.code, 404);

  const invalid = response();
  await getVolumeRecordingDownloadController({ ...req, query: { file: 'audio', index: '-1' } }, invalid);
  assert.equal(invalid.code, 400);

  const manifest = response();
  await getVolumeRecordingDownloadController({ ...req, query: { file: 'manifest' } }, manifest);
  assert.equal(manifest.code, 200);
  assert.equal(manifest.body.filename, 'manifest.json');
});
