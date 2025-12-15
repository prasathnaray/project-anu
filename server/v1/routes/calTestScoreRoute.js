const express = require('express');
const {calcTestScoreController} = require('../controller/moduleController.js')
const moduleTestScoresRouter = express.Router();
moduleTestScoresRouter.post('/mark-testscores', calcTestScoreController)
module.exports = moduleTestScoresRouter;