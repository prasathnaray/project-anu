const express = require('express');
const {getLearningByIdController} = require('../controller/LearningController.js');
const GetLearningModuleByIdRouter = express.Router();
GetLearningModuleByIdRouter.get('/get-lmid/:certificate_id', getLearningByIdController)
module.exports =  GetLearningModuleByIdRouter;