const express = require('express');
const {deleteTargetedLearningC} = require('../controller/createBatch')
const deleteTargetedLearningRouter = express.Router();
deleteTargetedLearningRouter.delete('/tl-delete/:targeted_learning_id', deleteTargetedLearningC);
module.exports = deleteTargetedLearningRouter;