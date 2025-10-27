const express = require('express');
const getResourcesRouter = express.Router();
const {getResourcesController} = require('../controller/resourceController');
getResourcesRouter.get('/get-resources', getResourcesController);
module.exports = getResourcesRouter;