const test = require('node:test');
const assert = require('node:assert/strict');

const queries = [];
const mockClient = {
    query: async (sql, params = []) => {
        queries.push({ sql, params });
        if (/GROUP BY c\.cluster_id/.test(sql)) {
            return { rows: [{ cluster_id: 'cluster-a', volumes: [] }] };
        }
        if (/FROM public\.vol_recordings vr/.test(sql)) {
            return { rows: [{ recording_id: 'rec-1', cluster_id: 'cluster-a' }] };
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

const {
    getClustersModel,
    getClusterByIdModel,
    getClusterRecordingsModel,
    getClusterRecordingCountsModel,
    createClusterModel,
    updateClusterModel
} = require('../model/clusterModel');

for (const scenario of ['success', 'missing', 'write failure']) {
    test(`cluster update uses one connection and releases it on ${scenario}`, async () => {
        queries.length = 0;
        const calls = [];
        let releases = 0;
        const failure = new Error('volume insert failed');
        mockClient.connect = async () => ({
            query: async (sql, params) => {
                calls.push({ sql, params });
                if (/SELECT cluster_id/.test(sql)) return { rows: scenario === 'missing' ? [] : [{ cluster_id: 'cluster-a' }] };
                if (/INSERT INTO public.cluster_volumes/.test(sql) && scenario === 'write failure') throw failure;
                return { rows: [] };
            },
            release: () => { releases++; }
        });
        const update = updateClusterModel({ role: 101, centre_id: 'institution-a' }, 'cluster-a', {
            cluster_name: 'Edited', volume_ids: ['11111111-1111-1111-1111-111111111111']
        });
        if (scenario === 'write failure') await assert.rejects(update, error => error === failure);
        else assert.equal((await update).code, scenario === 'missing' ? 404 : 200);
        assert.equal(calls[0].sql, 'BEGIN');
        assert.match(calls[1].sql, /FOR UPDATE/);
        assert.deepEqual(calls[1].params, ['cluster-a', 'institution-a']);
        assert.equal(calls.at(-1).sql, scenario === 'success' ? 'COMMIT' : 'ROLLBACK');
        assert.equal(releases, 1);
        assert.ok(!queries.some(({ sql }) => /^(BEGIN|COMMIT|ROLLBACK)$/.test(sql) || /UPDATE public.clusters\s+SET|DELETE FROM public.cluster_volumes|INSERT INTO public.cluster_volumes/.test(sql)));
        if (scenario === 'missing') assert.equal(calls.length, 3);
    });
}

test('create rejects caller supplied IDs without querying or modifying another institution', async () => {
    queries.length = 0;
    const result = await createClusterModel({ role: 101, centre_id: 'institution-a' }, {
        cluster_id: 'institution-b-cluster', cluster_name: 'Overwrite attempt'
    });
    assert.equal(result.code, 400);
    assert.equal(queries.length, 0);
});

test('create rejects generated ID conflicts and never attaches volumes to an existing cluster', async () => {
    const calls = [];
    let released = false;
    mockClient.connect = async () => ({
        query: async (sql) => { calls.push(sql); return { rows: [] }; },
        release: () => { released = true; }
    });
    const result = await createClusterModel({ role: 101, centre_id: 'institution-a' }, {
        cluster_name: 'New cluster', volume_ids: ['11111111-1111-1111-1111-111111111111']
    });
    assert.equal(result.code, 409);
    assert.ok(calls.some(sql => /ON CONFLICT \(cluster_id\) DO NOTHING/.test(sql)));
    assert.ok(!calls.some(sql => /DO UPDATE|INSERT INTO public\.cluster_volumes/.test(sql)));
    assert.equal(calls.at(-1), 'ROLLBACK');
    assert.ok(released);
});

test('create generates its own ID and commits on one dedicated connection', async () => {
    const calls = [];
    let released = false;
    mockClient.connect = async () => ({
        query: async (sql, params) => {
            calls.push({ sql, params });
            return { rows: /RETURNING cluster_id/.test(sql) ? [{ cluster_id: params[0] }] : [] };
        },
        release: () => { released = true; }
    });
    const result = await createClusterModel({ role: 101, centre_id: 'institution-a' }, { cluster_name: 'New cluster' });
    assert.equal(result.code, 200);
    const insert = calls.find(({ sql }) => /INSERT INTO public.clusters/.test(sql));
    assert.match(insert.params[0], /^CLU-[0-9A-F-]{36}$/);
    assert.equal(insert.params[4], 'institution-a');
    assert.equal(calls.at(-1).sql, 'COMMIT');
    assert.ok(released);
});

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

test('role 101 can fetch isolated recordings for a cluster', async () => {
    queries.length = 0;
    const result = await getClusterRecordingsModel({
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

test('role 101 can fetch isolated recording counts for clusters', async () => {
    queries.length = 0;
    const result = await getClusterRecordingCountsModel({
        role: 101,
        user_mail: 'admin@example.test',
        centre_id: '11111111-1111-1111-1111-111111111111'
    });

    assert.equal(result.code, 200);
    const select = queries.find(({ sql }) => /c\.owner_centre_id = \$1/.test(sql));
    assert.deepEqual(select.params, ['11111111-1111-1111-1111-111111111111']);
});
