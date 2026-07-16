const express = require('express');
const {
    submitChallengeController,
    getChallengeAttemptDetailsController,
} = require('../controller/challengeController');

const challengeRouter = express.Router();

challengeRouter.post('/challenges/submit', submitChallengeController);
challengeRouter.get('/challenges/attempt-details', getChallengeAttemptDetailsController);

module.exports = challengeRouter;
