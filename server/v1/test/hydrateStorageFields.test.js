const test = require('node:test');
const assert = require('node:assert/strict');

const storagePath = require.resolve('../utils/storageAdapter');
const signed = [];

require.cache[storagePath] = {
    id: storagePath,
    filename: storagePath,
    loaded: true,
    exports: {
        parseReference: (reference) => ({
            objectKey: String(reference).replace(/^projectanu\//, '')
        }),
        signAsset: async (reference, options) => {
            signed.push({ reference, options });
            return `signed:${reference}`;
        },
        signAssets: async (references) => references.map((reference) => `signed:${reference}`)
    }
};

const { hydrateStorageFields } = require('../utils/hydrateStorageFields');

test('recording asset URLs are signed as named downloads', async () => {
    const result = await hydrateStorageFields({
        rec_files: ['projectanu/volume_recordings/session recording.json'],
        audio_files: ['projectanu/volume_audio/session audio.wav'],
        image_files: ['projectanu/volume_images/session image.png'],
        manifest_file: 'projectanu/volume_manifests/session manifest.json',
        volume_file: 'projectanu/volumes/scan.vol'
    });

    assert.deepEqual(result.rec_files, ['signed:projectanu/volume_recordings/session recording.json']);
    assert.deepEqual(result.audio_files, ['signed:projectanu/volume_audio/session audio.wav']);
    assert.deepEqual(result.image_files, ['signed:projectanu/volume_images/session image.png']);
    assert.equal(result.manifest_file, 'signed:projectanu/volume_manifests/session manifest.json');
    assert.equal(result.volume_file, 'signed:projectanu/volumes/scan.vol');
    assert.deepEqual(signed, [
        {
            reference: 'projectanu/volume_recordings/session recording.json',
            options: { downloadName: 'session_recording.json' }
        },
        {
            reference: 'projectanu/volume_audio/session audio.wav',
            options: { downloadName: 'session_audio.wav' }
        },
        {
            reference: 'projectanu/volume_images/session image.png',
            options: { downloadName: 'session_image.png' }
        },
        {
            reference: 'projectanu/volume_manifests/session manifest.json',
            options: { downloadName: 'session_manifest.json' }
        },
        {
            reference: 'projectanu/volumes/scan.vol',
            options: undefined
        }
    ]);
});
