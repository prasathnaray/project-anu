const express = require('express');
const updateTraineeRouter = express.Router();
const {updateTraineeController} = require('../controller/traineeController');
updateTraineeRouter.put('/trainee/update', updateTraineeController);
module.exports = updateTraineeRouter;