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

const { InstructorBatch } = require('../model/Batchm');

test('InstructorBatch returns center instructors when trainee batch has no instructors in batch_people_data', async () => {
    queryHandler = (sql, params, callback) => {
        if (sql.includes('SELECT \n                    bd.batch_id') || sql.includes('FROM public.batch_data bd')) {
            // Batch exists, but instructors array is null/empty
            callback(null, {
                rows: [{
                    batch_id: 'batch-1',
                    batch_name: 'BN01',
                    batch_end_date: '2026-12-31',
                    batch_status: 'current',
                    instructor_count: 0,
                    instructors: null,
                    instructor_emails: null
                }]
            });
        } else if (sql.includes('WHERE user_role = \'102\'')) {
            callback(null, {
                rows: [
                    { instructor_name: 'Dr. Instructor', instructor_email: 'instructor@anu.com' }
                ]
            });
        } else {
            callback(null, { rows: [] });
        }
    };

    const requester = {
        role: '103',
        centre_id: 'centre-1',
        user_mail: 'trainee@anu.com',
        people_id: 'trainee-1'
    };

    const res = await InstructorBatch(requester, 'trainee-1');
    assert.ok(res.rows.length > 0);
    const batch = res.rows[0];
    assert.deepEqual(batch.instructors, ['Dr. Instructor']);
    assert.deepEqual(batch.instructor_emails, ['instructor@anu.com']);
});

test('InstructorBatch returns center instructors when trainee is not in any batch yet', async () => {
    queryHandler = (sql, params, callback) => {
        if (sql.includes('FROM public.batch_data bd')) {
            callback(null, { rows: [] });
        } else if (sql.includes('WHERE user_role = \'102\'')) {
            callback(null, {
                rows: [
                    { instructor_name: 'Dr. Jane', instructor_email: 'jane@anu.com' }
                ]
            });
        } else {
            callback(null, { rows: [] });
        }
    };

    const requester = {
        role: '103',
        centre_id: 'centre-1',
        user_mail: 'rohinth@anu.com',
        people_id: 'rohinth-uuid'
    };

    const res = await InstructorBatch(requester, 'rohinth-uuid');
    assert.ok(res.rows.length > 0);
    assert.equal(res.rows[0].batch_id, 'center_instructors');
    assert.deepEqual(res.rows[0].instructors, ['Dr. Jane']);
    assert.deepEqual(res.rows[0].instructor_emails, ['jane@anu.com']);
});

test('InstructorBatch falls back to active instructors if center query yields no instructors', async () => {
    let callCount = 0;
    queryHandler = (sql, params, callback) => {
        if (sql.includes('FROM public.batch_data bd')) {
            callback(null, { rows: [] });
        } else if (sql.includes('WHERE user_role = \'102\'')) {
            callCount++;
            if (callCount === 1) {
                // First call with centre_id returns empty
                callback(null, { rows: [] });
            } else {
                // Fallback call returns system-wide active instructor
                callback(null, {
                    rows: [
                        { instructor_name: 'Fallback Instructor', instructor_email: 'fallback@anu.com' }
                    ]
                });
            }
        } else {
            callback(null, { rows: [] });
        }
    };

    const requester = {
        role: '103',
        centre_id: 'empty-centre',
        user_mail: 'newtrainee@anu.com',
        people_id: 'p-new'
    };

    const res = await InstructorBatch(requester, 'p-new');
    assert.ok(res.rows.length > 0);
    assert.deepEqual(res.rows[0].instructors, ['Fallback Instructor']);
    assert.deepEqual(res.rows[0].instructor_emails, ['fallback@anu.com']);
});

test('InstructorBatch rejects unprivileged roles', async () => {
    const requester = {
        role: '50',
        user_mail: 'guest@anu.com'
    };
    const res = await InstructorBatch(requester, 'any-id');
    assert.equal(res.code, 401);
});

test('Frontend parseInstructorList populates dropdown with unique instructors from batches and center', () => {
    const parseInstructorList = (result) => {
        if (!result || !Array.isArray(result)) return [];
        const instructorMap = new Map();
        result.forEach(batch => {
            if (batch.instructors && batch.instructor_emails && Array.isArray(batch.instructor_emails)) {
                batch.instructor_emails.forEach((email, idx) => {
                    if (email && !instructorMap.has(email)) {
                        instructorMap.set(email, {
                            instructor_id: email,
                            instructor_name: batch.instructors[idx] || email
                        });
                    }
                });
            }
            const directEmail = batch.instructor_id || batch.user_email || batch.email;
            const directName = batch.instructor_name || batch.user_name || batch.name;
            if (directEmail && !instructorMap.has(directEmail)) {
                instructorMap.set(directEmail, {
                    instructor_id: directEmail,
                    instructor_name: directName || directEmail
                });
            }
        });
        return Array.from(instructorMap.values());
    };

    // Case 1: Trainee in batch with center instructors
    const apiResult = [
        {
            batch_id: 'batch-1',
            batch_name: 'BN01',
            instructors: ['Dr. John Smith', 'Dr. Sarah Connor'],
            instructor_emails: ['john@anu.com', 'sarah@anu.com']
        },
        {
            batch_id: 'center_instructors',
            batch_name: 'Center Instructors',
            instructors: ['Dr. John Smith', 'Dr. Kyle Reese'],
            instructor_emails: ['john@anu.com', 'kyle@anu.com']
        }
    ];

    const dropdownList = parseInstructorList(apiResult);
    assert.equal(dropdownList.length, 3);
    assert.deepEqual(dropdownList, [
        { instructor_id: 'john@anu.com', instructor_name: 'Dr. John Smith' },
        { instructor_id: 'sarah@anu.com', instructor_name: 'Dr. Sarah Connor' },
        { instructor_id: 'kyle@anu.com', instructor_name: 'Dr. Kyle Reese' }
    ]);
});
