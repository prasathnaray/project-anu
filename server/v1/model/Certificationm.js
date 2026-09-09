const { listCourses, assertCourseReadable } = require('./ContentAccessm');
const getCertByCurm = async (curiculum_id, requester) => {
    const courses = await listCourses(requester, Number(requester.role) === 103 ? 'assigned' : 'management');
    let filtered = courses.filter((course) => String(course.curiculum_id || '') === String(curiculum_id));
    if (filtered.length === 0) {
        filtered = courses.filter((course) => 
            String(course.curiculum_id || '').toLowerCase() === String(curiculum_id || '').toLowerCase() ||
            String(course.curiculum_name || '').toLowerCase() === String(curiculum_id || '').toLowerCase()
        );
    }
    if (filtered.length === 0) {
        filtered = courses;
    }
    return { rows: filtered };
};

const getCertDetailsByIdm = async (certification_id, requester) => [
    await assertCourseReadable(requester, certification_id)
];
module.exports = {getCertByCurm, getCertDetailsByIdm}
