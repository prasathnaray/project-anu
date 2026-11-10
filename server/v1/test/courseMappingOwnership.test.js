const test = require('node:test');
const assert = require('node:assert/strict');

const queries = [];
const mockClient = {
    query: async (sql, params = []) => {
        queries.push({ sql, params });

        if (/SELECT cluster_id FROM public\.clusters/.test(sql)) {
            return { rows: params[0] === 'other-cluster' ? [] : [{ cluster_id: params[0] }] };
        }
        if (/SELECT mapping_id FROM public\.course_mapping/.test(sql) && /mapping_id = \$1::uuid/.test(sql)) {
            return { rows: [{ mapping_id: params[0] }] };
        }
        if (/INSERT INTO public\.course_mapping_placements/.test(sql)) {
            return { rows: [{ mapping_id: params[0], centre_id: params[1], certificate_name: params[2], unit_name: params[3] }] };
        }
        if (/FROM public\.cluster_recordings cr/.test(sql) && /SELECT vr\.recording_id/.test(sql)) {
            return { rows: params[1] === 'missing-recording' ? [] : [{ recording_id: params[1] }] };
        }

        if (/SELECT volume_id, volume_name, volume_type, trimester/.test(sql)) {
            return {
                rows: [{
                    volume_id: '22222222-2222-2222-2222-222222222222',
                    volume_name: 'Sample volume',
                    volume_type: 'Fetal Anatomy',
                    trimester: 'Second Trimester'
                }]
            };
        }

        if (/SELECT mapping_id/.test(sql)) return { rows: [] };
        if (/INSERT INTO public\.course_mapping/.test(sql)) return { rows: [{ mapping_id: params[0] }] };
        if (/shadow_vr\.recording_id/.test(sql)) {
            return {
                rows: [{
                    mapping_id: 'mapping-a',
                    shadow_recording: { recording_id: 'shadow-a' },
                    step_recording: { recording_id: 'step-a' }
                }]
            };
        }
        if (/SELECT\s+cm\.\*/.test(sql)) return { rows: [] };

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
    createCourseMappingModel,
    getCourseMappingsModel,
    getCourseMappingsWithRecordingsModel,
    tagCustomCourseModel
} = require('../model/CourseMappingm');

test('course creation persists ownership from the authenticated Institution Admin', async () => {
    const requester = {
        user_mail: 'admin@example.test',
        role: 101,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await createCourseMappingModel(
        requester,
        'Second Trimester',
        'Fetal Anatomy',
        'Sample volume',
        'SVT Course',
        'Free Scan',
        null,
        null,
        'Sample course',
        'Description',
        'Doctor'
    );

    const insert = queries.find(({ sql }) => /INSERT INTO public\.course_mapping/.test(sql));
    assert.equal(result.code, 201);
    assert.match(insert.sql, /owner_scope/);
    assert.match(insert.sql, /owner_centre_id/);
    assert.deepEqual(insert.params.slice(-2), ['institution', requester.centre_id]);
});

test('custom course stores its cluster and validates selected recordings in that cluster', async () => {
    queries.length = 0;
    const requester = {
        user_mail: 'admin@example.test',
        role: 101,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };
    const result = await createCourseMappingModel(
        requester, null, null, null, 'Custom Course', 'Free Scan',
        '22222222-2222-2222-2222-222222222222', null,
        'Custom course', 'Description', 'Doctor', 'cluster-a'
    );
    const insert = queries.find(({ sql }) => /INSERT INTO public\.course_mapping/.test(sql));
    assert.equal(result.code, 201);
    assert.match(insert.sql, /cluster_id/);
    assert.doesNotMatch(insert.sql, /volume_id/);
    assert.equal(insert.params[1], 'cluster-a');
    assert.ok(queries.some(({ sql }) => /FROM public\.cluster_recordings cr/.test(sql)));

    queries.length = 0;
    const missing = await createCourseMappingModel(
        requester, null, null, null, 'Custom Course', 'Free Scan',
        'missing-recording', null, 'Custom course', 'Description', 'Doctor', 'cluster-a'
    );
    assert.equal(missing.code, 404);
    assert.equal(queries.some(({ sql }) => /INSERT INTO public\.course_mapping/.test(sql)), false);
});

test('tagging a custom course places it in a scan center unit', async () => {
    queries.length = 0;
    const requester = {
        user_mail: 'admin@example.test', role: 101,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };
    const result = await tagCustomCourseModel(
        requester, '22222222-2222-2222-2222-222222222222',
        { certificate_name: 'BTC', unit_name: 'BPD & HC' }
    );
    assert.equal(result.code, 200);
    const mapping = queries.find(({ sql }) => /SELECT mapping_id FROM public\.course_mapping/.test(sql));
    assert.deepEqual(mapping.params.slice(1), [requester.centre_id]);
    const insert = queries.find(({ sql }) => /INSERT INTO public\.course_mapping_placements/.test(sql));
    assert.deepEqual(insert.params.slice(1, 4), [requester.centre_id, 'BTC', 'BPD & HC']);
    assert.doesNotMatch(insert.sql, /section_name/);

    queries.length = 0;
    const invalid = await tagCustomCourseModel(
        requester, '22222222-2222-2222-2222-222222222222',
        { certificate_name: 'BTC', unit_name: 'Other' }
    );
    assert.equal(invalid.code, 400);
    assert.equal(queries.some(({ sql }) => /INSERT INTO public\.course_mapping_placements/.test(sql)), false);

    queries.length = 0;
    const globalTag = await tagCustomCourseModel(
        { user_mail: 'super@example.test', role: 99 },
        '22222222-2222-2222-2222-222222222222',
        { certificate_name: 'BTC', unit_name: 'BPD & HC' }
    );
    assert.equal(globalTag.code, 403);
    assert.equal(queries.length, 0);
});

test('trainee course reads are scoped to the authenticated center', async () => {
    queries.length = 0;
    const requester = {
        user_mail: 'trainee@example.test',
        role: 103,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await getCourseMappingsModel(requester);
    const select = queries.find(({ sql }) => /SELECT\s+cm\.\*/.test(sql));

    assert.equal(result.code, 200);
    assert.match(select.sql, /cm\.owner_scope = 'institution'/);
    assert.match(select.sql, /cm\.owner_centre_id = \$1/);
    assert.doesNotMatch(select.sql, /shadow_vr/);
    assert.match(select.sql, /course_mapping_placements/);
    assert.deepEqual(select.params, [requester.centre_id]);
});

test('enriched course reads join shadow and step recordings within the mapped volume', async () => {
    queries.length = 0;
    const requester = {
        user_mail: 'trainee@example.test',
        role: 103,
        centre_id: '11111111-1111-1111-1111-111111111111'
    };

    const result = await getCourseMappingsWithRecordingsModel(requester, {
        course_type: 'Free Scan'
    });
    const select = queries.find(({ sql }) => /shadow_vr\.recording_id/.test(sql));

    assert.equal(result.code, 200);
    assert.match(select.sql, /shadow_vr\.volume_id = cm\.volume_id/);
    assert.match(select.sql, /step_vr\.volume_id = cm\.volume_id/);
    assert.match(select.sql, /cm\.owner_centre_id = \$1/);
    assert.match(select.sql, /LOWER\(TRIM\(cm\.course_type\)\) = LOWER\(TRIM\(\$2\)\)/);
    assert.deepEqual(select.params, [requester.centre_id, 'Free Scan']);
    assert.deepEqual(result.data[0].shadow_recording, { recording_id: 'shadow-a' });
    assert.deepEqual(result.data[0].step_recording, { recording_id: 'step-a' });
});
