const express = require('express');
const practiceRouter = express.Router();
const { bulkCreatePracticeResultsController, getPracticesByUser } = require('../controller/practiceController');
practiceRouter.get('/practice-i-ii', getPracticesByUser);
practiceRouter.post('/practice-i-ii', bulkCreatePracticeResultsController);
module.exports = practiceRouter;
