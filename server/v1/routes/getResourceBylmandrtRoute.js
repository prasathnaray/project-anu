const express = require('express');
const getResourceBylmandrtRouter = express.Router();
const { getResourceBylmandrtController } = require('../controller/learningController.js');
getResourceBylmandrtRouter.get('/get-resource-lmandrt', getResourceBylmandrtController);
module.exports = getResourceBylmandrtRouter;
