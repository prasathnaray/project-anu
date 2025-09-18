const express = require('express');
const createModuleRouter = express.Router();
const {CreateModule} = require('../controller/moduleController.js');
createModuleRouter.post('/create-module', CreateModule);
module.exports = createModuleRouter;