const test = require('node:test');
const assert = require('node:assert/strict');

process.env.BUCKET_NAME = 'projectanu';
process.env.MINDSPARK_ASSET_BUCKET = 'question-images';
process.env.AWS_S3_BUCKET = 'project-anu-content-test';

const { parseReference, canonicalReference } = require('../utils/storageAdapter');

test('canonicalizes a legacy bare object path under its default source bucket', () => {
    assert.equal(canonicalReference('iisub/file.png', 'projectanu'), 'projectanu/iisub/file.png');
});

test('preserves canonical source-bucket-prefixed keys', () => {
    assert.equal(canonicalReference('question-images/mindspark/file.png'), 'question-images/mindspark/file.png');
});

test('extracts bucket and key from Supabase public and signed URLs', () => {
    const publicRef = parseReference('https://example.supabase.co/storage/v1/object/public/projectanu/a%20b/file.json');
    assert.deepEqual(publicRef, {
        sourceBucket: 'projectanu',
        objectKey: 'a b/file.json',
        s3Key: 'projectanu/a b/file.json'
    });
    assert.equal(
        canonicalReference('https://example.supabase.co/storage/v1/object/sign/question-images/x.png?token=secret'),
        'question-images/x.png'
    );
});

test('extracts canonical key from target S3 URI', () => {
    assert.equal(
        canonicalReference('s3://project-anu-content-test/projectanu/volumes/file.vol'),
        'projectanu/volumes/file.vol'
    );
});

test('rejects empty and placeholder references', () => {
    assert.equal(canonicalReference(null), null);
    assert.equal(canonicalReference('-'), null);
});
