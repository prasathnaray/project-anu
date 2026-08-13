const { parseReference, signAsset, signAssets, SIGNED_URL_TTL_SECONDS } = require('./storageAdapter');

const extractStoragePath = (value, bucket) => parseReference(value, bucket)?.objectKey || null;
const signPrivateAsset = (value) => signAsset(value, {
    defaultSourceBucket: process.env.PRIVATE_CONTENT_BUCKET || process.env.BUCKET_NAME
});
const signPrivateAssets = (values) => signAssets(values, {
    defaultSourceBucket: process.env.PRIVATE_CONTENT_BUCKET || process.env.BUCKET_NAME
});

module.exports = {
    extractStoragePath,
    signPrivateAsset,
    signPrivateAssets,
    signedUrlTtlSeconds: SIGNED_URL_TTL_SECONDS
};
