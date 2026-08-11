const express = require('express');
const controller = require('../controller/MRContentController');

const router = express.Router();

router.get('/mr/workspace', controller.getWorkspace);
router.get('/mr/courses', controller.getMrCourses);
router.get('/mr/courses/:courseId/package', controller.getCoursePackage);
router.put('/recordings/:recordingId/validation', controller.validateRecording);
router.post('/courses/:courseId/content', controller.attachContent);

module.exports = router;
