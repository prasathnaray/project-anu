const express = require('express');
const moduleCompleteUserRouter = express.Router();
const { completeModule } = require('../controller/moduleController.js');
moduleCompleteUserRouter.get('/resource-completion', completeModule);
module.exports = moduleCompleteUserRouter;