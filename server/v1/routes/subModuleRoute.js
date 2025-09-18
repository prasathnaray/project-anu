const express = require('express');
const subModuleRouter = express.Router();
const { subModuleController } = require('../controller/moduleController.js');
subModuleRouter.post('/sub-module', subModuleController);
module.exports = subModuleRouter;