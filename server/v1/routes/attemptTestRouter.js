const express = require('express');
const {attemptTestCont} = require('../controller/moduleController.js')
const attemptTestRouter = express.Router();
attemptTestRouter.put('/mark-testscores-re', attemptTestCont)
module.exports = attemptTestRouter;