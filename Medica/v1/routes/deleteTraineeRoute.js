const express = require('express');
const {deleteTraineec} = require('../controller/traineeController');
const deleteTraineeRouter = express.Router();
deleteTraineeRouter.delete('/delete-trainee/:user_mail', deleteTraineec);
module.exports = deleteTraineeRouter;
