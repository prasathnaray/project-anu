const express = require('express');
const {CreateTraineeController} = require('../controller/traineeController');
const createTraineeRouter = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
createTraineeRouter.post('/create-trainee', upload.single('file'), CreateTraineeController);
module.exports = createTraineeRouter;