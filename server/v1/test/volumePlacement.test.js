const test = require('node:test');
const assert = require('node:assert/strict');

const volumeId = '6982d3f3-8617-49a7-9b0d-d160db9adf6c';
const requester = { user_mail: 'creator@example.test', role: 102, centre_id: 'centre-a' };
let uploadedAsset;
let savedPlacement;

const modelPath = require.resolve('../model/Volumem');
require.cache[modelPath] = {
    id: modelPath,
    filename: modelPath,
    loaded: true,
    exports: {
        assertVolumeEditableModel: async () => ({
            volume_id: volumeId,
            owner_scope: 'institution',
            owner_centre_id: 'centre-a'
        }),
        placedVolumeConversionModel: async (...args) => {
            savedPlacement = args;
            return { rowCount: 1, rows: [{ volume_id: volumeId }] };
        }
    }
};

const storagePath = require.resolve('../utils/storageAdapter');
require.cache[storagePath] = {
    id: storagePath,
    filename: storagePath,
    loaded: true,
    exports: {
        uploadAsset: async (asset) => {
            uploadedAsset = asset;
            return {
                reference: `projectanu/${asset.objectKey}`,
                objectKey: asset.objectKey
            };
        },
        signAsset: async (reference) => `signed:${reference}`,
        signAssets: async () => []
    }
};

const hydratePath = require.resolve('../utils/hydrateStorageFields');
require.cache[hydratePath] = {
    id: hydratePath,
    filename: hydratePath,
    loaded: true,
    exports: { hydrateStorageFields: async (value) => value }
};

const { volumePlacementController } = require('../controller/VolumeController');

const response = () => ({
    statusCode: null,
    body: null,
    status(code) {
        this.statusCode = code;
        return this;
    },
    send(body) {
        this.body = body;
        return this;
    },
    json(body) {
        this.body = body;
        return this;
    }
});

test('placement POST overwrites the stable per-volume JSON object', async () => {
    uploadedAsset = null;
    savedPlacement = null;
    const res = response();
    const fileBuffer = Buffer.from('{"version":2}');

    await volumePlacementController({
        user: requester,
        body: { volume_id: volumeId },
        file: {
            buffer: fileBuffer,
            mimetype: 'application/json',
            originalname: 'placement.json'
        }
    }, res);

    assert.equal(res.statusCode, 200);
    assert.equal(uploadedAsset.objectKey, `institutions/centre-a/${volumeId}/placements/placement.json`);
    assert.equal(uploadedAsset.upsert, true);
    assert.equal(uploadedAsset.contentType, 'application/json');
    assert.equal(uploadedAsset.body, fileBuffer);
    assert.deepEqual(savedPlacement, [
        requester,
        volumeId,
        `projectanu/institutions/centre-a/${volumeId}/placements/placement.json`
    ]);
    assert.equal(res.body.assetPath, savedPlacement[2]);
    assert.equal(res.body.assetUrl, `signed:${savedPlacement[2]}`);
});
