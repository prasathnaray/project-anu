const test = require('node:test');
const assert = require('node:assert/strict');

test('volume upload URL carries temporary AWS session credentials without signing Content-Length', async () => {
  const original = Object.fromEntries([
    'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_SESSION_TOKEN',
    'AWS_S3_BUCKET', 'ACCESS_TOKEN_SECRET'
  ].map((key) => [key, process.env[key]]));
  Object.assign(process.env, {
    AWS_ACCESS_KEY_ID: 'ASIATEST1234567890',
    AWS_SECRET_ACCESS_KEY: 'test-secret',
    AWS_SESSION_TOKEN: 'test-session-token',
    AWS_S3_BUCKET: 'example-content-bucket',
    ACCESS_TOKEN_SECRET: 'test-jwt-secret'
  });

  try {
    const { prepare } = require('../controller/directVolumeUpload');
    let body;
    const res = {
      set() { return this; },
      json(value) { body = value; return this; },
      status(code) { throw new Error(`Unexpected status ${code}`); }
    };
    await prepare({
      user: { role: 101, centre_id: '11111111-1111-1111-1111-111111111111', user_mail: 'admin@example.test' },
      body: {
        filename: 'sample.vol', size: 1024, volume_type: 'Fetal Anatomy',
        volume_name: 'Sample', volume_ga: '22', volume_fetal_presentation: 'Cephalic',
        trimester: 'Second Trimester', animated_volume: 'No', maternal_age: '28'
      }
    }, res);

    const url = new URL(body.uploadUrl);
    assert.equal(url.searchParams.get('X-Amz-Security-Token'), 'test-session-token');
    assert.equal(url.searchParams.get('X-Amz-SignedHeaders'), 'host;if-none-match');
  } finally {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
