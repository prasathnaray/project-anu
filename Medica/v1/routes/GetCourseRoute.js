const express = require('express');
const {getCoursesC} = require('../controller/courseController');
const getCoursesRouter = express.Router();
getCoursesRouter.get('/get-courses', getCoursesC)
module.exports = getCoursesRouter;