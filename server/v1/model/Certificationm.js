const { listCourses, assertCourseReadable } = require('./ContentAccessm');
const getCertByCurm = async (curiculum_id, requester) => ({
    rows: (await listCourses(requester, Number(requester.role) === 103 ? 'assigned' : 'management'))
        .filter((course) => String(course.curiculum_id || '') === String(curiculum_id))
});

const getCertDetailsByIdm = async (certification_id, requester) => [
    await assertCourseReadable(requester, certification_id)
];
module.exports = {getCertByCurm, getCertDetailsByIdm}
