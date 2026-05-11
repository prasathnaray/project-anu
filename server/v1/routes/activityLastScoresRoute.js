const express = require('express');
const { ActivityLastScores } = require('../controller/Analytics.js');
const activityLastScoresRouter = express.Router();

activityLastScoresRouter.get('/activity-last-scores', ActivityLastScores);

module.exports = activityLastScoresRouter;
