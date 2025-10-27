const express = require('express');
const {tagCourseController} = require('../controller/courseController')
const tagCourseRouter = express.Router();
tagCourseRouter.post('/tag-course', tagCourseController);
module.exports = tagCourseRouter;