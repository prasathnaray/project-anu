const express = require('express');
const questionsRouter = express.Router();
const {
    createQuestionsController,
    getQuestionsController,
    updateQuestionController,
    deleteQuestionController,
} = require('../controller/mindSparkQuestionController');

questionsRouter.post('/mind-spark-questions', createQuestionsController);
questionsRouter.get('/mind-spark-questions', getQuestionsController);
questionsRouter.put('/mind-spark-questions/:question_id', updateQuestionController);
questionsRouter.delete('/mind-spark-questions/:question_id', deleteQuestionController);

questionsRouter.post('/create-question', createQuestionsController);

module.exports = questionsRouter;
