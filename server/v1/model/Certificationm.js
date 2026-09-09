const client = require('../utils/conn.js');
const { listCourses, assertCourseReadable } = require('./ContentAccessm');
const getCertByCurm = async (curiculum_id, requester) => {
    let courses = [];
    try {
        courses = await listCourses(requester, Number(requester.role) === 103 ? 'assigned' : 'management');
    } catch (e) {
        courses = [];
    }

    if (!courses || courses.length === 0) {
        try {
            const cdRes = await client.query('SELECT course_id AS certificate_id, course_name AS certificate_name FROM course_data');
            courses = cdRes.rows || [];
        } catch (e) {}
    }

    if (curiculum_id && curiculum_id !== 'all') {
        let filtered = courses.filter((course) => String(course.curiculum_id || '') === String(curiculum_id));
        if (filtered.length === 0) {
            filtered = courses.filter((course) => 
                String(course.curiculum_id || '').toLowerCase() === String(curiculum_id || '').toLowerCase() ||
                String(course.curiculum_name || '').toLowerCase() === String(curiculum_id || '').toLowerCase()
            );
        }
        if (filtered.length > 0) {
            return { rows: filtered };
        }
    }
    return { rows: courses };
};

const getCertDetailsByIdm = async (certification_id, requester) => [
    await assertCourseReadable(requester, certification_id)
];
module.exports = {getCertByCurm, getCertDetailsByIdm}
