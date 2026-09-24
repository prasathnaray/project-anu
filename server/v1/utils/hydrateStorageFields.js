const path = require('path');
const { parseReference, signAsset, signAssets } = require('./storageAdapter');

const DEFAULT_FIELDS = new Set([
    'user_profile_photo',
    'public_url',
    'placed_url',
    'volume_file',
    'converted_file_path',
    'manifest_file',
    'manifest_files',
    'rec_files',
    'audio_files',
    'image_files',
    'images_files',
    'userImageUrl',
    'expertImageUrl'
]);

const DOWNLOAD_FIELDS = new Set([
    'rec_files',
    'audio_files',
    'image_files',
    'images_files',
    'manifest_file',
    'manifest_files'
]);

const downloadName = (value) => {
    const parsed = parseReference(value);
    if (!parsed) return 'download';
    return path.posix.basename(parsed.objectKey)
        .replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 140) || 'download';
};

const signDownload = (value) => signAsset(value, { downloadName: downloadName(value) });

const hydrateStorageFields = async (value, fields = DEFAULT_FIELDS) => {
    if (Array.isArray(value)) return Promise.all(value.map((item) => hydrateStorageFields(item, fields)));
    if (!value || typeof value !== 'object' || value instanceof Date) return value;
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => {
        if (fields.has(key) && Array.isArray(item)) {
            return [key, DOWNLOAD_FIELDS.has(key)
                ? await Promise.all(item.map(signDownload))
                : await signAssets(item)];
        }
        if (fields.has(key) && typeof item === 'string' && item && item !== '-') {
            return [key, DOWNLOAD_FIELDS.has(key)
                ? await signDownload(item)
                : await signAsset(item)];
        }
        return [key, await hydrateStorageFields(item, fields)];
    }));
    return Object.fromEntries(entries);
};

module.exports = { hydrateStorageFields, DEFAULT_FIELDS };
