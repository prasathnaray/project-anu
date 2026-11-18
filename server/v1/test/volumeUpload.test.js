const test = require('node:test');
const assert = require('node:assert/strict');

let capturedQuery;
let queryRows = [{}];
let simulateMissingEnhancementColumns = false;
let simulateMissingAnimatedColumn = false;
let queryAttempts = 0;
const mockClient = {
    query: (sql, params, callback) => {
        queryAttempts++;
        capturedQuery = { sql, params };
        if (simulateMissingAnimatedColumn && /\banimated_volume\b/.test(sql)) {
            return callback(Object.assign(new Error('column "animated_volume" does not exist'), {
                code: '42703', routine: sql.includes('INSERT') ? 'checkInsertTargets' : 'errorMissingColumn'
            }));
        }
        if (simulateMissingEnhancementColumns && sql.includes('v.enhancement_status')) {
            return callback(Object.assign(new Error('column v.enhancement_status does not exist'), { code: '42703' }));
        }
        callback(null, { rowCount: queryRows.length, rows: queryRows });
    }
};

const connectionPath = require.resolve('../utils/conn');
require.cache[connectionPath] = {
    id: connectionPath,
    filename: connectionPath,
    loaded: true,
    exports: mockClient
};

const conversionPath = require.resolve('../utils/startPythonProcess');
require.cache[conversionPath] = {
    id: conversionPath,
    filename: conversionPath,
    loaded: true,
    exports: { startVolumeConversion: () => {} }
};

const {
    svUploadModel,
    getUploadedVolume,
    getVolumeInstructorViewModel,
    placedVolumeConversionModel,
    getRecordingsModel,
    updateVolumeModel
} = require('../model/Volumem');

const upload = (requester) => svUploadModel(
    requester,
    'Fetal Anatomy',
    null,
    null,
    'Sample volume',
    '22',
    'Cephalic',
    'Second Trimester',
    '',
    'global/volume/source/sample.vol',
    28
);

test('Super Admin volume uploads are approved automatically', async () => {
    await upload({ user_mail: 'super@example.test', role: 99, centre_id: null });

    assert.match(capturedQuery.sql, /status, approver_id,\s+ownership_review_required/);
    assert.match(capturedQuery.sql, /\$14, NULL, false/);
    assert.equal(capturedQuery.params[13], true);
    assert.equal(capturedQuery.params[1], null);
    assert.equal(capturedQuery.params[2], null);
});

test('institution admin volume uploads are approved automatically', async () => {
    await upload({ user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' });
    assert.doesNotMatch(capturedQuery.sql, /status, approver_id/);
    assert.equal(capturedQuery.params[13], true);
});

test('instructor volume uploads still require approval', async () => {
    await upload({ user_mail: 'tutor@example.test', role: 102, centre_id: 'centre-a' });
    assert.equal(capturedQuery.params[13], false);
});

test('volume upload falls back to legacy columns when animated_volume is missing', async () => {
    simulateMissingAnimatedColumn = true;
    queryAttempts = 0;
    try {
        await upload({ user_mail: 'tutor@example.test', role: 102, centre_id: 'centre-a' });
        assert.equal(queryAttempts, 2);
        assert.doesNotMatch(capturedQuery.sql, /\banimated_volume\b/);
        assert.equal(capturedQuery.params.length, 15);
    } finally {
        simulateMissingAnimatedColumn = false;
    }
});

test('volume edit updates maternal age with the core volume metadata', async () => {
    const result = await updateVolumeModel(
        { user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' },
        'volume-a', 'Fetal Anatomy', 'Sample volume', '22', 'Cephalic', 'Second Trimester', 28
    );
    assert.equal(result.code, 200);
    assert.match(capturedQuery.sql, /maternal_age = COALESCE\(\$6, maternal_age\)/);
    assert.equal(capturedQuery.params[5], 28);
});

test('volume edit falls back to legacy columns when animated_volume is missing', async () => {
    simulateMissingAnimatedColumn = true;
    queryAttempts = 0;
    try {
        const result = await updateVolumeModel(
            { user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' },
            'volume-a', 'Fetal Anatomy', 'Sample volume', '22', 'Cephalic', 'Second Trimester', 28, true
        );
        assert.equal(result.code, 200);
        assert.equal(queryAttempts, 2);
        assert.doesNotMatch(capturedQuery.sql, /\banimated_volume\b/);
        assert.match(capturedQuery.sql, /volume_id = \$7/);
        assert.equal(capturedQuery.params[6], 'volume-a');
    } finally {
        simulateMissingAnimatedColumn = false;
    }
});

test('Super Admin volume responses omit approver_id', async () => {
    const requester = { user_mail: 'super@example.test', role: 99, centre_id: null };
    queryRows = [{ volume_id: 'volume-a', status: true, approver_id: 'legacy@example.test' }];

    const uploaded = await getUploadedVolume(requester);
    assert.deepEqual(uploaded.data, [{ volume_id: 'volume-a', status: true }]);

    const instructorView = await getVolumeInstructorViewModel(requester);
    assert.deepEqual(instructorView.rows, [{ volume_id: 'volume-a', status: true }]);
});

test('institution volume responses retain approver_id', async () => {
    const requester = { user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' };
    queryRows = [{ volume_id: 'volume-a', status: false, approver_id: 'reviewer@example.test' }];

    const uploaded = await getUploadedVolume(requester);
    assert.equal(uploaded.data[0].approver_id, 'reviewer@example.test');
});

test('volume list still loads before the enhancement migration is applied', async () => {
    simulateMissingEnhancementColumns = true;
    try {
        const result = await getVolumeInstructorViewModel({ user_mail: 'tutor@example.test', role: 102, centre_id: 'centre-a' });
        assert.equal(result.rows.length, 1);
        assert.doesNotMatch(capturedQuery.sql, /v\.(?:enhancement_status|enhancement_manifest|enhancement_error|animated_volume)/);
    } finally {
        simulateMissingEnhancementColumns = false;
    }
});

test('recordings are fetched by volume only for the authenticated creator', async () => {
    const requester = { user_mail: 'creator@example.test', role: 102, centre_id: 'centre-a' };
    const volumeId = 'volume-a';
    queryRows = [{ recording_id: 'recording-a', volume_id: volumeId, created_by: requester.user_mail }];

    const result = await getRecordingsModel(requester, volumeId);

    assert.match(capturedQuery.sql, /WHERE vr\.created_by = \$1/);
    assert.match(capturedQuery.sql, /AND vr\.volume_id = \$2/);
    assert.deepEqual(capturedQuery.params, [requester.user_mail, volumeId]);
    assert.deepEqual(result.data, queryRows);
});

test('placing a volume upserts its single placement row', async () => {
    const requester = { user_mail: 'creator@example.test', role: 102, centre_id: 'centre-a' };
    const volumeId = 'volume-a';
    const placedUrl = 'projectanu/institutions/centre-a/volume-a/placements/placement.json';

    await placedVolumeConversionModel(requester, volumeId, placedUrl);

    assert.match(capturedQuery.sql, /ON CONFLICT \(volume_id\) DO UPDATE SET/);
    assert.match(capturedQuery.sql, /placed_url = EXCLUDED\.placed_url/);
    assert.match(capturedQuery.sql, /placed_by = EXCLUDED\.placed_by/);
    assert.match(capturedQuery.sql, /created_at = EXCLUDED\.created_at/);
    assert.deepEqual(capturedQuery.params, [volumeId, placedUrl, requester.user_mail, requester.user_mail]);
});
