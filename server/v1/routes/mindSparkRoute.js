const express = require('express');
const mindSparkRouter = express.Router();
const {mindsparkController} = require('../controller/scancentersController');
mindSparkRouter.post('/mind-spark-options', mindsparkController);
module.exports = mindSparkRouter;
