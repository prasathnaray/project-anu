const test = require('node:test');
const assert = require('node:assert/strict');

const calls = [];
const connectionPath = require.resolve('../utils/conn');
require.cache[connectionPath] = {
    id: connectionPath,
    filename: connectionPath,
    loaded: true,
    exports: {
        query: (sql, params, callback) => {
            calls.push({ sql, params });
            const result = /SELECT COUNT\(\*\)/.test(sql)
                ? { rows: [{ count: '2' }] }
                : { rows: [], rowCount: 1 };
            callback(null, result);
        }
    }
};

const {
    getQueriesm,
    updateQueryStatusm,
    deleteQuerym
} = require('../model/queries');

const institutionAdmin = {
    user_mail: 'admin@center-a.test',
    role: 101,
    centre_id: '11111111-1111-1111-1111-111111111111'
};

test('Institution Admin query list is restricted to instructors and trainees in their center', async () => {
    calls.length = 0;
    const result = await getQueriesm(institutionAdmin, 1, 10);

    assert.equal(result.total, 2);
    assert.equal(calls.length, 2);
    assert.match(calls[0].sql, /ud\.centre_id = \$1/);
    assert.match(calls[0].sql, /ud\.user_role IN \('102', '103'\)/);
    assert.deepEqual(calls[0].params, [institutionAdmin.centre_id, 10, 0]);
    assert.match(calls[1].sql, /ud\.centre_id = \$1/);
    assert.deepEqual(calls[1].params, [institutionAdmin.centre_id]);
});

test('Institution Admin updates and deletes cannot cross center boundaries', async () => {
    calls.length = 0;
    await updateQueryStatusm(institutionAdmin, 'query-a', 'resolved');
    await deleteQuerym(institutionAdmin, 'query-a');

    assert.match(calls[0].sql, /FROM user_data ud/);
    assert.match(calls[0].sql, /ud\.centre_id = \$3/);
    assert.deepEqual(calls[0].params, ['resolved', 'query-a', institutionAdmin.centre_id]);

    assert.match(calls[1].sql, /USING user_data ud/);
    assert.match(calls[1].sql, /ud\.centre_id = \$2/);
    assert.deepEqual(calls[1].params, ['query-a', institutionAdmin.centre_id]);
});

test('Institution Admin without a center is denied before querying the database', async () => {
    calls.length = 0;
    const result = await getQueriesm(
        { user_mail: 'orphan-admin@example.test', role: 101, centre_id: null },
        1,
        10
    );

    assert.equal(result.code, 403);
    assert.equal(calls.length, 0);
});

test('Super Admin retains the global query view', async () => {
    calls.length = 0;
    await getQueriesm({ user_mail: 'super@example.test', role: 99 }, 1, 10);

    assert.match(calls[0].sql, /WHERE TRUE/);
    assert.deepEqual(calls[0].params, [10, 0]);
});
