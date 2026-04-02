const express = require('express');
const { getSubmissionsC } = require('../controller/submissionsController');
const getSubmissionsRouter = express.Router();

getSubmissionsRouter.get('/get-submissions', getSubmissionsC);

module.exports = getSubmissionsRouter;
