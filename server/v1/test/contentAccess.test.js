const test = require('node:test');
const assert = require('node:assert/strict');

let queryHandler = async () => ({ rows: [], rowCount: 0 });
const mockClient = {
    query: (...args) => queryHandler(...args),
    connect: async () => ({ query: (...args) => queryHandler(...args), release: () => {} })
};
const connectionPath = require.resolve('../utils/conn');
require.cache[connectionPath] = { id: connectionPath, filename: connectionPath, loaded: true, exports: mockClient };

const contentAccess = require('../model/ContentAccessm');

test('trainee catalog query enforces institution eligibility and assignment', async () => {
    let captured;
    queryHandler = async (sql, params) => {
        captured = { sql, params };
        return { rows: [{ certificate_id: 'course-a' }] };
    };
    const rows = await contentAccess.listEffectiveCourses({
        user_mail: 'trainee@a.test', role: 103, centre_id: '11111111-1111-1111-1111-111111111111'
    });
    assert.equal(rows.length, 1);
    assert.deepEqual(captured.params, ['11111111-1111-1111-1111-111111111111', 'trainee@a.test']);
    assert.match(captured.sql, /publication_status = 'published'/);
    assert.match(captured.sql, /course_institution_access/);
    assert.match(captured.sql, /course_batch_assignments/);
    assert.match(captured.sql, /state = 'excluded'/);
});

test('assignment replacement rejects batches from another institution before writing', async () => {
    const statements = [];
    queryHandler = async (sql) => {
        statements.push(sql);
        if (sql === 'BEGIN' || sql === 'ROLLBACK') return { rows: [] };
        if (sql.includes('SELECT cd.certificate_id')) return { rows: [{ certificate_id: 'course-a' }] };
        if (sql.includes('SELECT batch_id FROM batch_data')) return { rows: [] };
        throw new Error(`Unexpected SQL: ${sql}`);
    };
    await assert.rejects(
        () => contentAccess.replaceAssignments(
            { user_mail: 'admin@a.test', role: 101, centre_id: '11111111-1111-1111-1111-111111111111' },
            '22222222-2222-2222-2222-222222222222',
            { batchIds: ['batch-from-b'], assignedTraineeIds: [], excludedTraineeIds: [] }
        ),
        (error) => error.statusCode === 400
    );
    assert.equal(statements.some((sql) => sql.includes('DELETE FROM course_batch_assignments')), false);
    assert.equal(statements.at(-1), 'ROLLBACK');
});

test('Super Admin creates core courses as global drafts', async () => {
    const calls = [];
    queryHandler = async (sql, params) => {
        calls.push({ sql, params });
        if (sql.includes('INSERT INTO certification_data')) {
            return { rows: [{ certificate_id: '33333333-3333-3333-3333-333333333333', course_kind: 'core' }] };
        }
        return { rows: [] };
    };
    const course = await contentAccess.createCourse(
        { user_mail: 'owner@anu.test', role: 99, centre_id: null },
        { name: 'Biometry', courseKind: 'core', curriculumId: null }
    );
    assert.equal(course.course_kind, 'core');
    assert.deepEqual(calls[0].params.slice(2, 5), ['core', 'super_admin', null]);
    assert.equal(calls[0].params[6], 'all');
});
