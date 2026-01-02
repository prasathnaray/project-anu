const express = require('express')
const {insDataAnalysisController} = require('../controller/instructorController.js')
const getInstructorDataAnalysisRoute = express.Router();
getInstructorDataAnalysisRoute.get('/instructor-ind', insDataAnalysisController);
module.exports = getInstructorDataAnalysisRoute;