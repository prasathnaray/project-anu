const express = require('express');
const practiceRouter = express.Router();
const { bulkCreatePracticeResultsController } = require('../controller/practiceController');
practiceRouter.post('/practice-i-ii', bulkCreatePracticeResultsController);
module.exports = practiceRouter;