const express = require('express');
const {
    createCourseMappingController,
    getCourseMappingsController,
    getCourseMappingsWithRecordingsController,
    tagCustomCourseController
} = require('../controller/CourseMappingController');

const courseMappingRouter = express.Router();

courseMappingRouter.post('/course-mappings', createCourseMappingController);
courseMappingRouter.get('/course-mappings', getCourseMappingsController);
courseMappingRouter.get('/course-mappings/with-recordings', getCourseMappingsWithRecordingsController);
courseMappingRouter.post('/course-mappings/:mapping_id/tags', tagCustomCourseController);

module.exports = courseMappingRouter;
