const express = require('express');
const {CourseController} = require('../controller/courseController');
const createCourseRouter = express.Router();
createCourseRouter.post('/create-course', CourseController)
module.exports =  createCourseRouter;