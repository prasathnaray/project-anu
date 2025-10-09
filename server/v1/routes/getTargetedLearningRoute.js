const express = require('express');
const { getTargetedLearningC } = require('../controller/createBatch');
const getTargetedLearningRouter = express.Router();
getTargetedLearningRouter.get('/tllist', getTargetedLearningC)
module.exports = getTargetedLearningRouter;