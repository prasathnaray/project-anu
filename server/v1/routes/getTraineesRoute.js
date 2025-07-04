const express = require('express');
const {TraineeController} = require('../controller/traineeController');
const getTraineeRouter = express.Router();

getTraineeRouter.get('/get-trainees', TraineeController);

module.exports = getTraineeRouter;