const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    HeadObjectCommand
} = require('@aws-sdk/client-s3');
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const supabase = require('../supaBaseClient');

const DEFAULT_SOURCE_BUCKET = process.env.BUCKET_NAME || 'projectanu';
const SIGNED_URL_TTL_SECONDS = Number(
    process.env.STORAGE_SIGNED_URL_TTL_SECONDS || process.env.PRIVATE_ASSET_URL_TTL_SECONDS || 900
);
const KNOWN_SOURCE_BUCKETS = () => [...new Set([
    process.env.BUCKET_NAME || 'projectanu',
    process.env.PRIVATE_CONTENT_BUCKET,
    process.env.MINDSPARK_ASSET_BUCKET || 'question-images'
].filter(Boolean))];

let s3Client;

const provider = () => String(process.env.STORAGE_PROVIDER || 'supabase').toLowerCase();
const fallbackEnabled = () => String(process.env.STORAGE_READ_FALLBACK || '').toLowerCase() === 'supabase';
const targetBucket = () => {
    if (!process.env.AWS_S3_BUCKET) throw new Error('AWS_S3_BUCKET is required when STORAGE_PROVIDER=s3.');
    return process.env.AWS_S3_BUCKET;
};
const getS3Client = () => {
    if (!s3Client) {
        const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_IVS_ACCESS_KEY;
        const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_IVS_SECRET_KEY;
        s3Client = new S3Client({
            region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-south-1',
            ...(accessKeyId && secretAccessKey ? { credentials: { accessKeyId, secretAccessKey } } : {})
        });
    }
    return s3Client;
};

const cleanPath = (value) => String(value || '').replace(/^\/+/, '');

const parseReference = (value, defaultSourceBucket = DEFAULT_SOURCE_BUCKET) => {
    if (!value || typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed || trimmed === '-') return null;

    if (trimmed.startsWith('s3://')) {
        const withoutScheme = trimmed.slice(5);
        const slash = withoutScheme.indexOf('/');
        if (slash < 0) return null;
        const bucket = withoutScheme.slice(0, slash);
        const key = cleanPath(withoutScheme.slice(slash + 1));
        if (bucket === process.env.AWS_S3_BUCKET) {
            const sourceBucket = KNOWN_SOURCE_BUCKETS().find((candidate) => key.startsWith(`${candidate}/`));
            return sourceBucket ? { sourceBucket, objectKey: key.slice(sourceBucket.length + 1), s3Key: key } : null;
        }
        return { sourceBucket: bucket, objectKey: key, s3Key: `${bucket}/${key}` };
    }

    if (/^https?:\/\//i.test(trimmed)) {
        try {
            const url = new URL(trimmed);
            const match = url.pathname.match(/\/storage\/v1\/object\/(?:public|sign|authenticated)\/([^/]+)\/(.+)$/);
            if (!match) return null;
            const sourceBucket = decodeURIComponent(match[1]);
            const objectKey = decodeURIComponent(match[2]);
            return { sourceBucket, objectKey, s3Key: `${sourceBucket}/${objectKey}` };
        } catch (_) {
            return null;
        }
    }

    const path = cleanPath(trimmed);
    const knownPrefix = KNOWN_SOURCE_BUCKETS().find((candidate) => path.startsWith(`${candidate}/`));
    if (knownPrefix) {
        return { sourceBucket: knownPrefix, objectKey: path.slice(knownPrefix.length + 1), s3Key: path };
    }
    return { sourceBucket: defaultSourceBucket, objectKey: path, s3Key: `${defaultSourceBucket}/${path}` };
};

const canonicalReference = (value, defaultSourceBucket = DEFAULT_SOURCE_BUCKET) =>
    parseReference(value, defaultSourceBucket)?.s3Key || null;

const isNotFound = (error) => error?.name === 'NotFound' || error?.name === 'NoSuchKey' || error?.$metadata?.httpStatusCode === 404;

const uploadAsset = async ({ sourceBucket = DEFAULT_SOURCE_BUCKET, objectKey, body, contentType, upsert = false, metadata = {} }) => {
    const parsed = parseReference(objectKey, sourceBucket);
    if (!parsed) throw new Error('A valid storage object key is required.');

    if (provider() !== 's3') {
        const { error } = await supabase.storage.from(parsed.sourceBucket).upload(parsed.objectKey, body, {
            contentType,
            upsert
        });
        if (error) throw error;
        return { reference: parsed.s3Key, sourceBucket: parsed.sourceBucket, objectKey: parsed.objectKey };
    }

    const client = getS3Client();
    if (!upsert) {
        try {
            await client.send(new HeadObjectCommand({ Bucket: targetBucket(), Key: parsed.s3Key }));
            const error = new Error(`Storage object already exists: ${parsed.s3Key}`);
            error.code = 'OBJECT_EXISTS';
            throw error;
        } catch (error) {
            if (!isNotFound(error)) throw error;
        }
    }

    const params = {
        Bucket: targetBucket(),
        Key: parsed.s3Key,
        Body: body,
        ContentType: contentType || 'application/octet-stream',
        Metadata: Object.fromEntries(Object.entries(metadata).map(([key, value]) => [key, String(value)]))
    };
    const size = Buffer.isBuffer(body) ? body.length : null;
    if (size !== null && size < 5 * 1024 * 1024) {
        await client.send(new PutObjectCommand(params));
    } else {
        await new Upload({ client, params }).done();
    }
    return { reference: parsed.s3Key, sourceBucket: parsed.sourceBucket, objectKey: parsed.objectKey };
};

const signSupabaseFallback = async (parsed, expiresIn) => {
    const { data, error } = await supabase.storage.from(parsed.sourceBucket).createSignedUrl(parsed.objectKey, expiresIn);
    if (error) throw error;
    return data.signedUrl;
};

const signAsset = async (value, { defaultSourceBucket = DEFAULT_SOURCE_BUCKET, expiresIn = SIGNED_URL_TTL_SECONDS } = {}) => {
    const parsed = parseReference(value, defaultSourceBucket);
    if (!parsed) return null;
    if (provider() !== 's3') return signSupabaseFallback(parsed, expiresIn);

    try {
        await getS3Client().send(new HeadObjectCommand({ Bucket: targetBucket(), Key: parsed.s3Key }));
        return getSignedUrl(
            getS3Client(),
            new GetObjectCommand({ Bucket: targetBucket(), Key: parsed.s3Key }),
            { expiresIn }
        );
    } catch (error) {
        if (!isNotFound(error) || !fallbackEnabled()) throw error;
        console.warn(`S3 storage fallback used for ${parsed.s3Key}`);
        return signSupabaseFallback(parsed, expiresIn);
    }
};

const signAssets = async (values, options) => Promise.all((values || []).map((value) => signAsset(value, options)));

module.exports = {
    DEFAULT_SOURCE_BUCKET,
    SIGNED_URL_TTL_SECONDS,
    provider,
    parseReference,
    canonicalReference,
    uploadAsset,
    signAsset,
    signAssets
};
