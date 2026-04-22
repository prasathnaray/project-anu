const express = require('express');
const questionsRouter = express.Router();
const { questionsController } = require('../controller/questionsController');
questionsRouter.post('/create-question', questionsController)
module.exports = questionsRouter;