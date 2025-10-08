const express = require('express');
const {getResourcesByModuleIdsController} = require('../controller/resourceController')
const getResourcesByModuleIdsRouter = express.Router();
getResourcesByModuleIdsRouter.post('/resources-mId', getResourcesByModuleIdsController)
module.exports = getResourcesByModuleIdsRouter;