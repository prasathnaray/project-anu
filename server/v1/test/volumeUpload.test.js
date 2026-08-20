const test = require('node:test');
const assert = require('node:assert/strict');

let capturedQuery;
let queryRows = [{}];
const mockClient = {
    query: (sql, params, callback) => {
        capturedQuery = { sql, params };
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

const { svUploadModel, getUploadedVolume, getVolumeInstructorViewModel } = require('../model/Volumem');

const upload = (requester) => svUploadModel(
    requester,
    'Fetal Anatomy',
    'Sample volume',
    '22',
    'Cephalic',
    'Second Trimester',
    'Sample description',
    'global/volume/source/sample.vol'
);

test('Super Admin volume uploads are approved automatically', async () => {
    await upload({ user_mail: 'super@example.test', role: 99, centre_id: null });

    assert.match(capturedQuery.sql, /status, approver_id,\s+ownership_review_required/);
    assert.match(capturedQuery.sql, /\$12, NULL, false/);
    assert.equal(capturedQuery.params[11], true);
});

test('institution volume uploads still require approval', async () => {
    await upload({ user_mail: 'admin@example.test', role: 101, centre_id: 'centre-a' });
    assert.doesNotMatch(capturedQuery.sql, /status, approver_id/);
    assert.equal(capturedQuery.params[11], false);

    await upload({ user_mail: 'tutor@example.test', role: 102, centre_id: 'centre-a' });
    assert.equal(capturedQuery.params[11], false);
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
