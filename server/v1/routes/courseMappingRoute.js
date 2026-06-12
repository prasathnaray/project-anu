const express = require('express');
const {
    createCourseMappingController,
    getCourseMappingsController
} = require('../controller/CourseMappingController');

const courseMappingRouter = express.Router();

courseMappingRouter.post('/course-mappings', createCourseMappingController);
courseMappingRouter.get('/course-mappings', getCourseMappingsController);

module.exports = courseMappingRouter;
