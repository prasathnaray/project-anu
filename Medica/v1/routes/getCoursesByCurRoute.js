const express = require('express')
const {getCoursesByCurController} = require('../controller/courseController')
const getCoursesByCuriculumRouter = express.Router();
getCoursesByCuriculumRouter.get('/get-cours-cur/:curiculum_id', getCoursesByCurController);
module.exports = getCoursesByCuriculumRouter;