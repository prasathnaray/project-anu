const client = require('../utils/conn.js');
const { listCourses, assertCourseReadable } = require('./contentAccessm.js');
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
        } catch (e) { }
    }

    // Batch creation stores certificate IDs from certification_data. The
    // content-access listing can be empty when legacy publication/ownership
    // metadata is incomplete, so keep the admin certificate dropdown usable.
    if ((!courses || courses.length === 0) && [99, 101, 102].includes(Number(requester.role))) {
        try {
            const certificateRes = await client.query(
                `SELECT certificate_id, certificate_name, curiculum_id,
                        curiculum_id AS curiculum_name
                   FROM public.certification_data
                  WHERE ($1 = 'all' OR LOWER(TRIM(COALESCE(curiculum_id, ''))) = LOWER(TRIM($1)))
                  ORDER BY certificate_name`,
                [String(curiculum_id || 'all')]
            );
            courses = certificateRes.rows || [];
        } catch (e) { }
    }

    if (curiculum_id && curiculum_id !== 'all') {
        let filtered = courses.filter((course) => String(course.curiculum_id || '') === String(curiculum_id));
        if (filtered.length === 0) {
            filtered = courses.filter((course) =>
                String(course.curiculum_id || '').toLowerCase() === String(curiculum_id || '').toLowerCase() ||
                String(course.curiculum_name || '').toLowerCase() === String(curiculum_id || '').toLowerCase()
            );
        }
        courses = filtered;
    }
    const seen = new Set();
    const uniqueCourses = [];
    for (const course of courses) {
        const id = String(course.certificate_id ?? course.course_id ?? '');
        const name = String(course.certificate_name ?? course.course_name ?? '').trim().toLowerCase();
        if (id && seen.has(id)) continue;
        if (name && seen.has('name:' + name)) continue;
        if (id) seen.add(id);
        if (name) seen.add('name:' + name);
        uniqueCourses.push(course);
    }
    return { rows: uniqueCourses };
};

const getCertDetailsByIdm = async (certification_id, requester) => [
    await assertCourseReadable(requester, certification_id)
];
module.exports = { getCertByCurm, getCertDetailsByIdm }
