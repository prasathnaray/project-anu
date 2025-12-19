const express = require('express');
const getResourceBylmandrtRouter = express.Router();
const {getResourceBylmandrtController} = require('../controller/LearningController.js');
getResourceBylmandrtRouter.get('/get-resource-lmandrt', getResourceBylmandrtController);
module.exports =  getResourceBylmandrtRouter;
