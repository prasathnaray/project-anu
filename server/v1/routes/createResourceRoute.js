const express = require('express');
const createResourceRouter = express.Router();
const {CreateResourceController} = require('../controller/resourceController');
createResourceRouter.post('/create-resource', CreateResourceController);
module.exports = createResourceRouter;