const express = require('express');
const {
    submitChallengeController,
    getChallengeAttemptDetailsController,
    getChallengeQuestionsController,
} = require('../controller/challengeController');

const challengeRouter = express.Router();

challengeRouter.get('/challenges/questions', getChallengeQuestionsController);
challengeRouter.post('/challenges/submit', submitChallengeController);
challengeRouter.get('/challenges/attempt-details', getChallengeAttemptDetailsController);

module.exports = challengeRouter;
