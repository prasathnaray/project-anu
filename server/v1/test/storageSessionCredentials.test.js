const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

test('image URL signing preserves the Lambda temporary session token', async () => {
    let options;
    const module = { exports: {} };
    const mocks = {
        dotenv: { config() {} },
        '../supaBaseClient': {},
        '@aws-sdk/lib-storage': {},
        '@aws-sdk/client-s3': {
            S3Client: class { constructor(config) { options = config; } },
            GetObjectCommand: class { constructor(input) { this.input = input; } }
        },
        '@aws-sdk/s3-request-presigner': { getSignedUrl: async () => 'https://s3.example/image?signed=true' }
    };
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../utils/storageAdapter.js'), 'utf8'), {
        require: id => mocks[id] || require(id), module, __dirname, console, Buffer, setTimeout,
        process: { env: {
            STORAGE_PROVIDER: 's3', AWS_S3_BUCKET: 'content', BUCKET_NAME: 'projectanu',
            AWS_ACCESS_KEY_ID: 'temporary-key', AWS_SECRET_ACCESS_KEY: 'temporary-secret',
            AWS_SESSION_TOKEN: 'required-session-token'
        } }
    });
    const url = await module.exports.signAsset('projectanu/measurement_images/user.png');
    assert.equal(options.credentials.sessionToken, 'required-session-token');
    assert.equal(url, 'https://s3.example/image?signed=true');
});
