const express = require('express');
const {instructorController} = require('../controller/instructorController');
const deleteInstructorRouter = express.Router();
deleteInstructorRouter.delete('/delete-ins/:user_mail', instructorController);
module.exports = deleteInstructorRouter;