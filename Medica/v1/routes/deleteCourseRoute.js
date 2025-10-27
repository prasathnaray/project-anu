const express = require('express');
const {courseDeletionController} = require('../controller/courseController');
const deleteCourseRouter = express.Router();
deleteCourseRouter.delete('/delete-course/:course_id', courseDeletionController)
module.exports = deleteCourseRouter;