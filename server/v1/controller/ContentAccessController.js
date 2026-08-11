const contentAccess = require('../model/ContentAccessm');
const { HttpError } = require('../Auth/authorization');

const sendError = (res, error) => {
    const status = error instanceof HttpError ? error.statusCode : 500;
    if (status === 500) console.error('Content access API error:', error);
    return res.status(status).json({
        code: status,
        status: status === 500 ? 'Error' : 'Request Rejected',
        message: status === 500 ? 'Internal server error' : error.message
    });
};

const handle = (operation, successStatus = 200) => async (req, res) => {
    try {
        const data = await operation(req);
        return res.status(successStatus).json({ code: successStatus, status: 'Success', data });
    } catch (error) {
        return sendError(res, error);
    }
};

const createCourse = handle((req) => contentAccess.createCourse(req.user, req.body), 201);
const listCourses = handle((req) => contentAccess.listCourses(req.user, req.query.view));
const listMyCourses = handle((req) => contentAccess.listEffectiveCourses(req.user));
const updateCourse = handle((req) => contentAccess.updateCourse(req.user, req.params.courseId, req.body));
const publishCourse = handle((req) => contentAccess.setPublication(req.user, req.params.courseId, 'published'));
const archiveCourse = handle((req) => contentAccess.setPublication(req.user, req.params.courseId, 'archived'));
const draftCourse = handle((req) => contentAccess.setPublication(req.user, req.params.courseId, 'draft'));
const setInstitutionAccess = handle((req) => contentAccess.setInstitutionAccess(
    req.user,
    req.params.courseId,
    req.body.mode,
    req.body.institutionIds
));
const replaceAssignments = handle((req) => contentAccess.replaceAssignments(req.user, req.params.courseId, req.body));
const getAssignments = handle((req) => contentAccess.getAssignments(req.user, req.params.courseId));
const getEffectiveAccess = handle((req) => contentAccess.getEffectiveAccess(
    { ...req.user, requested_centre_id: req.query.institutionId },
    req.params.courseId
));
const listMigrationReview = handle((req) => contentAccess.listMigrationReview(req.user));
const resolveCourseOwnership = handle((req) => contentAccess.resolveCourseOwnership(req.user, req.params.courseId, req.body));
const resolveVolumeOwnership = handle((req) => contentAccess.resolveVolumeOwnership(req.user, req.params.volumeId, req.body));
const migrateCourseMapping = handle((req) => contentAccess.migrateCourseMapping(req.user, req.params.mappingId, req.body), 201);

module.exports = {
    sendError,
    createCourse,
    listCourses,
    listMyCourses,
    updateCourse,
    publishCourse,
    archiveCourse,
    draftCourse,
    setInstitutionAccess,
    replaceAssignments,
    getAssignments,
    getEffectiveAccess,
    listMigrationReview,
    resolveCourseOwnership,
    resolveVolumeOwnership,
    migrateCourseMapping
};
