const model = require('../model/MRContentm');
const { sendError } = require('./ContentAccessController');

const handle = (operation, status = 200) => async (req, res) => {
    try {
        const data = await operation(req);
        return res.status(status).json({ code: status, status: 'Success', data });
    } catch (error) {
        return sendError(res, error);
    }
};

module.exports = {
    getWorkspace: handle((req) => model.getWorkspace(req.user)),
    getMrCourses: handle((req) => model.getMrCourses(req.user)),
    getCoursePackage: handle((req) => model.getCoursePackage(req.user, req.params.courseId)),
    validateRecording: handle((req) => model.validateRecording(req.user, req.params.recordingId, req.body.state)),
    attachContent: handle((req) => model.attachContent(req.user, req.params.courseId, req.body), 201)
};
