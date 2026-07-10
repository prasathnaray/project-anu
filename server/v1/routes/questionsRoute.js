const express = require('express');
const questionsRouter = express.Router();
const multer = require('multer');
const {
    createQuestionsController,
    uploadAssetController,
    getQuestionsController,
    updateQuestionController,
    deleteQuestionController,
    getAttemptDetailsController,
} = require('../controller/mindSparkQuestionController');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: Number(process.env.MAX_MINDSPARK_ASSET_SIZE_MB || 10) * 1024 * 1024 },
});

questionsRouter.post('/mind-spark-questions', createQuestionsController);
questionsRouter.post('/mind-spark-question-assets', upload.single('image'), uploadAssetController);
questionsRouter.get('/mind-spark-questions', getQuestionsController);
questionsRouter.get('/mind-spark-attempt-details', getAttemptDetailsController);
questionsRouter.put('/mind-spark-questions/:question_id', updateQuestionController);
questionsRouter.delete('/mind-spark-questions/:question_id', deleteQuestionController);

questionsRouter.post('/create-question', createQuestionsController);

module.exports = questionsRouter;
