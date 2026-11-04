const test = require('node:test');
const assert = require('node:assert/strict');

let queryHandler = (sql, params, callback) => {
    callback(null, { rows: [], rowCount: 0 });
};

const mockClient = {
    query: (sql, params, callback) => {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        if (typeof callback === 'function') {
            return queryHandler(sql, params, callback);
        }
        return new Promise((resolve, reject) => {
            queryHandler(sql, params, (err, res) => {
                if (err) reject(err);
                else resolve(res);
            });
        });
    }
};

const connectionPath = require.resolve('../utils/conn');
require.cache[connectionPath] = { id: connectionPath, filename: connectionPath, loaded: true, exports: mockClient };

const { createBatchm } = require('../model/Batchm');
const { getCertByCurm } = require('../model/certificationm');

test('instructor can create a batch with a unique name', async () => {
    const executedQueries = [];
    queryHandler = (sql, params, callback) => {
        executedQueries.push({ sql, params });
        if (/SELECT batch_id FROM batch_data/i.test(sql)) {
            return callback(null, { rows: [] });
        }
        if (/INSERT INTO batch_data/i.test(sql)) {
            return callback(null, { rowCount: 1 });
        }
        callback(null, { rows: [] });
    };

    const requester = {
        user_mail: 'instructor@example.test',
        role: 102,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await createBatchm(
        'New Unique Batch',
        '2026-11-03',
        '2026-12-31',
        JSON.stringify(['course-1']),
        'curriculum-1',
        requester
    );

    assert.equal(result.rowCount, 1);
    assert.equal(executedQueries.length, 2);
    assert.match(executedQueries[0].sql, /SELECT batch_id FROM batch_data/i);
    assert.match(executedQueries[1].sql, /INSERT INTO batch_data/i);
    assert.equal(executedQueries[1].params[0], 'New Unique Batch');
    assert.equal(executedQueries[1].params[5], requester.centre_id);
});

test('batch creation returns 409 conflict when batch name already exists in the center', async () => {
    queryHandler = (sql, params, callback) => {
        if (/SELECT batch_id FROM batch_data/i.test(sql)) {
            return callback(null, { rows: [{ batch_id: 'existing-batch-1' }] });
        }
        callback(null, { rows: [] });
    };

    const requester = {
        user_mail: 'instructor@example.test',
        role: 102,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await createBatchm(
        'Existing Batch Name',
        '2026-11-03',
        '2026-12-31',
        JSON.stringify(['course-1']),
        'curriculum-1',
        requester
    );

    assert.equal(result.code, 409);
    assert.equal(result.status, 'Conflict');
    assert.equal(result.message, 'Batch already exists.');
});

test('getCertByCurm deduplicates certificates so options are displayed only once', async () => {
    queryHandler = (sql, params, callback) => {
        // Mock listCourses returning multiple rows for UFC and BTC due to lateral join with batches
        callback(null, {
            rows: [
                { certificate_id: 'cert-1', certificate_name: 'UFC', curiculum_id: 'OBG', batch_name: 'Batch 1' },
                { certificate_id: 'cert-1', certificate_name: 'UFC', curiculum_id: 'OBG', batch_name: 'Batch 2' },
                { certificate_id: 'cert-1', certificate_name: 'UFC', curiculum_id: 'OBG', batch_name: 'Batch 3' },
                { certificate_id: 'cert-2', certificate_name: 'BTC', curiculum_id: 'OBG', batch_name: 'Batch 1' },
                { certificate_id: 'cert-2', certificate_name: 'BTC', curiculum_id: 'OBG', batch_name: 'Batch 2' }
            ]
        });
    };

    const requester = {
        user_mail: 'instructor@example.test',
        role: 102,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await getCertByCurm('OBG', requester);

    assert.equal(result.rows.length, 2);
    const names = result.rows.map(r => r.certificate_name);
    assert.deepEqual(names, ['UFC', 'BTC']);
});
