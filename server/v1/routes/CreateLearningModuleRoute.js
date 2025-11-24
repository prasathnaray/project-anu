const express = require('express');
const {createLearningController} = require('../controller/LearningController.js');
const CreateLearningModuleRouter = express.Router();
CreateLearningModuleRouter.post('/create-learning-module', createLearningController)
module.exports =  CreateLearningModuleRouter;