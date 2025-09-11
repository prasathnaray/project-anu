const express = require('express');
const {progressUpdate} = require('../controller/progressController')
const progressRouter = express.Router();;
progressRouter.post('/user-completion', progressUpdate);
module.exports = progressRouter;