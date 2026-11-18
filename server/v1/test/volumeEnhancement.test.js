const test = require('node:test');
const assert = require('node:assert/strict');
const { BatchClient } = require('@aws-sdk/client-batch');

const volumeId = 'c66caf93-83f7-47b9-8edb-2f6ca6f17b9b';
const queries = [];
let claimRows = [{ volume_file: 'projectanu/global/source/sample.vol' }];
let missingEnhancementColumns = false;
let submitted = null;
let batchError = null;
const originalSend = BatchClient.prototype.send;
BatchClient.prototype.send = async function (command) {
  if (batchError) throw batchError;
  submitted = command.input;
  return { jobId: 'batch-job-id' };
};

const dbPath = require.resolve('../utils/conn');
require.cache[dbPath] = {
  id: dbPath, filename: dbPath, loaded: true,
  exports: { query: async (sql, params) => {
    queries.push({ sql, params });
    if (missingEnhancementColumns) {
      throw Object.assign(new Error('column "enhancement_status" does not exist'), { code: '42703' });
    }
    if (sql.includes('RETURNING v.volume_file')) return { rowCount: claimRows.length, rows: claimRows };
    if (sql.includes('SELECT v.enhancement_status')) return { rowCount: 1, rows: [{ enhancement_status: 'running' }] };
    return { rowCount: 1, rows: [] };
  } },
};

const { startEnhancement } = require('../controller/volumeEnhancement');
const response = () => ({
  statusCode: 200,
  status(code) { this.statusCode = code; return this; },
  json(body) { this.body = body; return this; },
});

test('authorized enhancement claims the volume and submits its S3 key to Batch', async () => {
  const res = response();
  await startEnhancement({
    params: { volume_id: volumeId },
    user: { user_mail: 'owner@example.test', role: 102, centre_id: 'centre-a' },
  }, res);
  assert.equal(res.statusCode, 202);
  assert.equal(res.body.job_id, 'batch-job-id');
  assert.match(queries[0].sql, /v\.added_by = \$2/);
  assert.equal(queries[0].params[1], 'owner@example.test');
  assert.equal(submitted.containerOverrides.environment.find(({ name }) => name === 'S3_INPUT_KEY').value,
    'projectanu/global/source/sample.vol');
});

test('an enhancement already running cannot submit a second job', async () => {
  claimRows = [];
  submitted = null;
  const res = response();
  await startEnhancement({
    params: { volume_id: volumeId },
    user: { user_mail: 'owner@example.test', role: 102, centre_id: 'centre-a' },
  }, res);
  assert.equal(res.statusCode, 409);
  assert.equal(submitted, null);
});

test('trainees cannot start enhancement', async () => {
  queries.length = 0;
  const res = response();
  await startEnhancement({
    params: { volume_id: volumeId },
    user: { user_mail: 'trainee@example.test', role: 103, centre_id: 'centre-a' },
  }, res);
  assert.equal(res.statusCode, 403);
  assert.equal(queries.length, 0);
});

test('missing migration returns a useful error without attempting rollback or Batch submission', async () => {
  missingEnhancementColumns = true;
  queries.length = 0;
  submitted = null;
  try {
    const res = response();
    await startEnhancement({
      params: { volume_id: volumeId },
      user: { user_mail: 'owner@example.test', role: 102, centre_id: 'centre-a' },
    }, res);
    assert.equal(res.statusCode, 503);
    assert.match(res.body.message, /database migration/);
    assert.equal(queries.length, 1);
    assert.equal(submitted, null);
  } finally {
    missingEnhancementColumns = false;
  }
});

test('Batch configuration errors return their reason and release the claimed volume', async () => {
  claimRows = [{ volume_file: 'projectanu/global/source/sample.vol' }];
  queries.length = 0;
  batchError = Object.assign(new Error('Job definition vol-enhancement-job not found'), {
    name: 'ClientException', $metadata: { httpStatusCode: 400 },
  });
  try {
    const res = response();
    await startEnhancement({
      params: { volume_id: volumeId },
      user: { user_mail: 'owner@example.test', role: 102, centre_id: 'centre-a' },
    }, res);
    assert.equal(res.statusCode, 503);
    assert.match(res.body.message, /Job definition vol-enhancement-job not found/);
    assert.match(queries.at(-1).sql, /enhancement_status = 'failed'/);
  } finally {
    batchError = null;
  }
});

test.after(() => { BatchClient.prototype.send = originalSend; });
