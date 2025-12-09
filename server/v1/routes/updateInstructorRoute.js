const express = require('express');
const updateInstructorRouter = express.Router();
const {updateInstructorController} = require('../controller/instructorController');
updateInstructorRouter.put('/instructor/update', updateInstructorController);
module.exports = updateInstructorRouter;