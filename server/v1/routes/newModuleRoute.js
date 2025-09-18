const express = require('express');
const NewModuleRouter = express.Router();
const { ModuleNewController } = require('../controller/moduleController.js');
NewModuleRouter.post('/create-new-module', ModuleNewController);
module.exports = NewModuleRouter;