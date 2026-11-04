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

const { getTraineesm, updateTraineem } = require('../model/traineem');

test('instructor can retrieve trainees in their scan center', async () => {
    const executedQueries = [];
    const mockTrainees = [
        {
            total_count: 1,
            user_name: 'Jane Doe',
            user_email: 'jane@example.test',
            people_id: 'p-1',
            status: 'pending_verification',
            batch_id: ['batch-1'],
            batch_name: 'Batch Alpha'
        }
    ];

    queryHandler = (sql, params, callback) => {
        executedQueries.push({ sql, params });
        callback(null, { rows: mockTrainees, rowCount: 1 });
    };

    const requester = {
        user_mail: 'instructor@example.test',
        role: 102,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await getTraineesm(requester, 1, 10);

    assert.equal(executedQueries.length, 1);
    assert.match(executedQueries[0].sql, /ud\.centre_id = \$3/);
    assert.match(executedQueries[0].sql, /LEFT JOIN public\.batch_people_data bpd/);
    assert.equal(executedQueries[0].params[0], 10); // limit
    assert.equal(executedQueries[0].params[1], 0);  // offset
    assert.equal(executedQueries[0].params[2], requester.centre_id);
    assert.equal(result.rows.length, 1);
    assert.equal(result.rows[0].user_name, 'Jane Doe');
    assert.equal(result.rows[0].batch_name, 'Batch Alpha');
});

test('instructor without scan center cannot retrieve trainees', async () => {
    const requester = {
        user_mail: 'instructor@example.test',
        role: 102,
        centre_id: null
    };

    const result = await getTraineesm(requester, 1, 10);
    assert.equal(result.status, 'Unauthorized');
    assert.equal(result.code, 401);
});

test('instructor can update trainee batch in their scan center', async () => {
    const executedQueries = [];
    queryHandler = (sql, params, callback) => {
        executedQueries.push({ sql, params });
        callback(null, { rowCount: 1 });
    };

    const requester = {
        user_mail: 'instructor@example.test',
        role: 102,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await updateTraineem(requester, 'trainee@example.test', 'new-batch-1');

    assert.equal(result.code, 200);
    assert.equal(executedQueries.length, 1);
    assert.match(executedQueries[0].sql, /UPDATE batch_people_data/i);
    assert.equal(executedQueries[0].params[1], 'trainee@example.test');
    assert.equal(executedQueries[0].params[2], requester.centre_id);
});

