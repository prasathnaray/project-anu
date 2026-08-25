const test = require('node:test');
const assert = require('node:assert/strict');

const queries = [];
const mockClient = {
    query: async (sql, params = []) => {
        queries.push({ sql, params });

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
    getCourseMappingsWithRecordingsModel
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
