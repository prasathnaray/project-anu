const express = require('express');
const { induuidController } = require('../controller/traineeController');
const induuidRouter = express.Router();
induuidRouter.get('/trainee/:people_id', induuidController);
module.exports = induuidRouter;