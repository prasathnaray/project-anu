const supabase = require('../supaBaseClient');

const signedUrlTtlSeconds = Number(process.env.PRIVATE_ASSET_URL_TTL_SECONDS || 900);

const extractStoragePath = (value, bucket) => {
    if (!value || typeof value !== 'string') return null;
    if (!/^https?:\/\//i.test(value)) return value.replace(/^\/+/, '');
    const markers = [`/object/public/${bucket}/`, `/object/sign/${bucket}/`, `/object/authenticated/${bucket}/`];
    const marker = markers.find((candidate) => value.includes(candidate));
    if (!marker) return null;
    return decodeURIComponent(value.split(marker)[1].split('?')[0]);
};

const signPrivateAsset = async (value) => {
    if (!value) return null;
    const candidates = [...new Set([process.env.PRIVATE_CONTENT_BUCKET, process.env.BUCKET_NAME].filter(Boolean))];
    if (candidates.length === 0) throw new Error('PRIVATE_CONTENT_BUCKET or BUCKET_NAME must be configured.');
    const bucket = candidates.find((candidate) => extractStoragePath(value, candidate)) || candidates[0];
    const path = extractStoragePath(value, bucket);
    if (!path) throw new Error('Stored asset is not in the configured private content bucket.');
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, signedUrlTtlSeconds);
    if (error) throw error;
    return data.signedUrl;
};

const signPrivateAssets = async (values) => Promise.all((values || []).map(signPrivateAsset));

module.exports = { extractStoragePath, signPrivateAsset, signPrivateAssets, signedUrlTtlSeconds };
