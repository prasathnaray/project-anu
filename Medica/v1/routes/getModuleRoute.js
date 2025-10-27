const express = require('express');
const {GetModule} = require('../controller/moduleController.js');
const getModuleRouter = express.Router();
getModuleRouter.get('/get-module', GetModule);
module.exports = getModuleRouter;