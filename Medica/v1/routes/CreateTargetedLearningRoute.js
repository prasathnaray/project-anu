const express = require('express');
const createTargetedLearningRouter = express.Router();
const {createTargetedLearningC} = require('../controller/createBatch');
createTargetedLearningRouter.post('/create-targeted-learning', createTargetedLearningC);
module.exports = createTargetedLearningRouter;