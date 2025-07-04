const express = require('express');
const {CreateTraineeController} = require('../controller/traineeController');
const createTraineeRouter = express.Router();
const multer = require('multer');
const upload = multer();
createTraineeRouter.post('/create-trainee', upload.none(), CreateTraineeController);

module.exports = createTraineeRouter;