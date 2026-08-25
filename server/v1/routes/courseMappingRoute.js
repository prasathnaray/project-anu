const express = require('express');
const {
    createCourseMappingController,
    getCourseMappingsController,
    getCourseMappingsWithRecordingsController
} = require('../controller/CourseMappingController');

const courseMappingRouter = express.Router();

courseMappingRouter.post('/course-mappings', createCourseMappingController);
courseMappingRouter.get('/course-mappings', getCourseMappingsController);
courseMappingRouter.get('/course-mappings/with-recordings', getCourseMappingsWithRecordingsController);

module.exports = courseMappingRouter;
