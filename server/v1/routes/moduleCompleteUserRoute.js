const express = require('express');
const moduleCompleteUserRouter = express.Router();
const { completeModule } = require('../controller/moduleController.js');
moduleCompleteUserRouter.get('/complete-module', completeModule);
module.exports = moduleCompleteUserRouter;