const test = require('node:test');
const assert = require('node:assert/strict');

const queries = [];
const mockClient = {
    query: async (sql, params = []) => {
        queries.push({ sql, params });
        if (/GROUP BY c\.cluster_id/.test(sql)) {
            return { rows: [{ cluster_id: 'cluster-a', volumes: [] }] };
        }
        return { rows: [] };
    }
};

const connectionPath = require.resolve('../utils/conn');
require.cache[connectionPath] = {
    id: connectionPath,
    filename: connectionPath,
    loaded: true,
    exports: mockClient
};

const { getClustersModel, getClusterByIdModel } = require('../model/ClusterModel');

test('role 101 can read institution-scoped clusters', async () => {
    queries.length = 0;
    const result = await getClustersModel({
        role: 101,
        user_mail: 'admin@example.test',
        centre_id: '11111111-1111-1111-1111-111111111111'
    });

    assert.equal(result.code, 200);
    const select = queries.find(({ sql }) => /GROUP BY c\.cluster_id/.test(sql));
    assert.match(select.sql, /c\.owner_centre_id = \$1/);
    assert.deepEqual(select.params, ['11111111-1111-1111-1111-111111111111']);
});

test('non-admin users cannot read cluster data', async () => {
    const result = await getClustersModel({
        role: 102,
        user_mail: 'tutor@example.test',
        centre_id: '11111111-1111-1111-1111-111111111111'
    });

    assert.equal(result.code, 403);
});

test('role 101 cluster detail is scoped by id and centre', async () => {
    queries.length = 0;
    const result = await getClusterByIdModel({
        role: 101,
        user_mail: 'admin@example.test',
        centre_id: '11111111-1111-1111-1111-111111111111'
    }, 'cluster-a');

    assert.equal(result.code, 200);
    const select = queries.find(({ sql }) => /c\.cluster_id = \$1/.test(sql));
    assert.deepEqual(select.params, [
        'cluster-a',
        '11111111-1111-1111-1111-111111111111'
    ]);
});
