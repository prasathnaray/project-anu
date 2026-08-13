const { signAsset, signAssets } = require('./storageAdapter');

const DEFAULT_FIELDS = new Set([
    'user_profile_photo',
    'public_url',
    'placed_url',
    'volume_file',
    'converted_file_path',
    'manifest_file',
    'rec_files',
    'audio_files',
    'image_files',
    'userImageUrl',
    'expertImageUrl'
]);

const hydrateStorageFields = async (value, fields = DEFAULT_FIELDS) => {
    if (Array.isArray(value)) return Promise.all(value.map((item) => hydrateStorageFields(item, fields)));
    if (!value || typeof value !== 'object') return value;
    const entries = await Promise.all(Object.entries(value).map(async ([key, item]) => {
        if (fields.has(key) && Array.isArray(item)) return [key, await signAssets(item)];
        if (fields.has(key) && typeof item === 'string' && item && item !== '-') {
            return [key, await signAsset(item)];
        }
        return [key, await hydrateStorageFields(item, fields)];
    }));
    return Object.fromEntries(entries);
};

module.exports = { hydrateStorageFields, DEFAULT_FIELDS };
