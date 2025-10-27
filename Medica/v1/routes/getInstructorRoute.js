const express = require('express');
const {getInstructorData} = require('../controller/instructorController');
const getInstructorRouter = express.Router();
getInstructorRouter.get('/get-instructors', getInstructorData);
module.exports = getInstructorRouter;