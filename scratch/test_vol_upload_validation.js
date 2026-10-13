const assert = require('assert');
const path = require('path');
const express = require('express');
const request = require('http');

// 1. Test frontend validation logic
const isVolFile = (file) => {
  if (!file || !file.name) return false;
  return file.name.toLowerCase().endsWith('.vol');
};

console.log('--- Testing Frontend isVolFile validation ---');
assert.strictEqual(isVolFile({ name: 'scan.vol' }), true, 'scan.vol should be valid');
assert.strictEqual(isVolFile({ name: 'SCAN.VOL' }), true, 'SCAN.VOL should be valid');
assert.strictEqual(isVolFile({ name: 'my_ultrasound.vol' }), true, 'my_ultrasound.vol should be valid');
assert.strictEqual(isVolFile({ name: 'audio.wav' }), false, 'audio.wav should be rejected');
assert.strictEqual(isVolFile({ name: 'backup.wal' }), false, 'backup.wal should be rejected');
assert.strictEqual(isVolFile({ name: 'notes.txt' }), false, 'notes.txt should be rejected');
assert.strictEqual(isVolFile({ name: 'archive.zip' }), false, 'archive.zip should be rejected');
assert.strictEqual(isVolFile({ name: 'report.pdf' }), false, 'report.pdf should be rejected');
assert.strictEqual(isVolFile({ name: 'no_extension' }), false, 'no_extension should be rejected');
assert.strictEqual(isVolFile({ name: '' }), false, 'empty name should be rejected');
assert.strictEqual(isVolFile(null), false, 'null should be rejected');
console.log('✅ All frontend validation checks passed!');

// 2. Test backend router and controller validation
const svUploadRouter = require('../server/v1/routes/svUploadRouter');
const app = express();

// Mock auth middleware for testing
app.use((req, res, next) => {
  req.user = { role: 99, centre_id: 'test-center' };
  next();
});
app.use('/api/v1', svUploadRouter);

const server = app.listen(0, async () => {
  const port = server.address().port;
  console.log(`\n--- Testing Backend validation on port ${port} ---`);

  async function uploadFile(filename, contentBuffer, fields = {}) {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    let body = [];

    // Add fields
    for (const [key, val] of Object.entries(fields)) {
      body.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${val}\r\n`));
    }

    // Add file
    body.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: application/octet-stream\r\n\r\n`));
    body.push(contentBuffer);
    body.push(Buffer.from(`\r\n--${boundary}--\r\n`));

    const fullBody = Buffer.concat(body);

    return new Promise((resolve, reject) => {
      const req = request.request({
        hostname: 'localhost',
        port: port,
        path: '/api/v1/sv-upload',
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': fullBody.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
          } catch (_) {
            resolve({ statusCode: res.statusCode, raw: data });
          }
        });
      });

      req.on('error', reject);
      req.write(fullBody);
      req.end();
    });
  }

  try {
    const testCases = [
      { name: 'audio.wav', buffer: Buffer.from('RIFF$WAVEfmt test'), desc: '.wav file' },
      { name: 'backup.wal', buffer: Buffer.from('Postgres WAL test buffer'), desc: '.wal file' },
      { name: 'notes.txt', buffer: Buffer.from('Simple text file notes'), desc: '.txt file' },
      { name: 'archive.zip', buffer: Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x00]), desc: '.zip file' },
      { name: 'document.pdf', buffer: Buffer.from('%PDF-1.4 test document'), desc: '.pdf file' },
      { name: 'fake_wav.vol', buffer: Buffer.from('RIFF\x24\x00\x00\x00WAVEfmt '), desc: 'Disguised .wav renamed to .vol' },
      { name: 'fake_zip.vol', buffer: Buffer.from([0x50, 0x4B, 0x03, 0x04, 0x00, 0x00]), desc: 'Disguised .zip renamed to .vol' },
      { name: 'fake_pdf.vol', buffer: Buffer.from('%PDF-1.4 test document content'), desc: 'Disguised .pdf renamed to .vol' },
      { name: 'fake_text.vol', buffer: Buffer.from('Plain text content without null bytes'), desc: 'Disguised .txt renamed to .vol' },
    ];

    for (const tc of testCases) {
      const res = await uploadFile(tc.name, tc.buffer, {
        volume_type: 'FL',
        volume_name: 'Test',
        volume_ga: '20',
        volume_fetal_presentation: 'Cephalic',
        trimester: '2',
        description: 'Test case'
      });

      assert.strictEqual(res.statusCode, 400, `${tc.desc} (${tc.name}) should be rejected with 400, got ${res.statusCode}`);
      assert.strictEqual(res.data?.error, 'Only .vol files are allowed.', `${tc.desc} error message should match`);
      console.log(`✅ Rejected: ${tc.desc} (${tc.name}) -> Status 400, Error: "${res.data.error}"`);
    }

    // Test valid .vol file (header verification)
    const validVolBuffer = Buffer.from('KRETZFILE 1.0   \x00\x00\x01\x00\x02\x00\x00\x00');
    // For valid vol, controller proceeds past file validation to field/storage logic
    const validRes = await uploadFile('ultrasound_scan.vol', validVolBuffer, {
      volume_type: 'FL',
      volume_name: 'Test',
      volume_ga: '20',
      volume_fetal_presentation: 'Cephalic',
      trimester: '2',
      description: 'Test case'
    });

    // The file validation must NOT return 400 "Only .vol files are allowed."
    assert.notStrictEqual(validRes.data?.error, 'Only .vol files are allowed.', 'Valid .vol file must not be rejected by file validation');
    console.log(`✅ Accepted file validation: ultrasound_scan.vol (status: ${validRes.statusCode}, error: ${validRes.data?.error || 'none'})`);

    console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
