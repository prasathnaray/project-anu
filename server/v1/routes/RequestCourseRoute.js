const express = require('express');
const {requestCourseController} = require('../controller/courseController')
const requestCourseRouter = express.Router();
requestCourseRouter.post('/request-course', requestCourseController)
module.exports = requestCourseRouter;