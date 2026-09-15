const test = require('node:test');
const assert = require('node:assert/strict');

const dbPath = require.resolve('../utils/conn');
const conversionPath = require.resolve('../utils/startPythonProcess');
let lastQuery = null;
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: { query: async (sql, params) => {
    lastQuery = { sql, params };
    return { rows: [{ volume_id: params[0], volume_file: 'projectanu/source/file.vol' }] };
  } }
};
require.cache[conversionPath] = {
  id: conversionPath, filename: conversionPath, loaded: true,
  exports: { startVolumeConversion: async () => {} }
};

const { getVolumeDownloadModel, getVolumeRecordingDownloadListModel,
  getVolumeRecordingDownloadModel } = require('../model/Volumem');
const volumeId = 'c66caf93-83f7-47b9-8edb-2f6ca6f17b9b';
const recordingId = '8df34342-521f-4cbc-ab4d-5406e1b603cc';

test('download lookup uses the same uploader and centre scope as the volume list', async () => {
  await getVolumeDownloadModel(
    { user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' }, volumeId
  );
  assert.deepEqual(lastQuery.params, [volumeId, 'admin@example.test', 102, 'centre-a']);
  assert.match(lastQuery.sql, /v\.ownership_review_required = false/);
  assert.match(lastQuery.sql, /v\.owner_centre_id = \$4/);

  await getVolumeDownloadModel(
    { user_mail: 'tutor@example.test', role: 102, centre_id: 'centre-a' }, volumeId
  );
  assert.deepEqual(lastQuery.params, [volumeId, 'tutor@example.test']);
  assert.match(lastQuery.sql, /v\.added_by = \$2/);
});

test('trainees cannot request a volume download lookup', async () => {
  lastQuery = null;
  const result = await getVolumeDownloadModel(
    { user_mail: 'trainee@example.test', role: 103, centre_id: 'centre-a' }, volumeId
  );
  assert.equal(result, null);
  assert.equal(lastQuery, null);
});

test('recording list and file lookup use the volume access scope', async () => {
  const admin = { user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' };
  await getVolumeRecordingDownloadListModel(admin, volumeId);
  assert.deepEqual(lastQuery.params, [volumeId, 'admin@example.test', 102, 'centre-a']);
  assert.match(lastQuery.sql, /v\.owner_centre_id = \$4/);

  await getVolumeRecordingDownloadModel(admin, volumeId, recordingId);
  assert.deepEqual(lastQuery.params, [volumeId, recordingId, 'admin@example.test', 102, 'centre-a']);
  assert.match(lastQuery.sql, /vr\.recording_id = \$2/);
  assert.match(lastQuery.sql, /v\.ownership_review_required = false/);
});
