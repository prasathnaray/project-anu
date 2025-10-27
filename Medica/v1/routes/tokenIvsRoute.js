const express = require('express');
const {tokenIvs} = require('../controller/streamingController.js')
const tokenIvsRouter = express.Router();
tokenIvsRouter.post('/tokenn', tokenIvs);
module.exports = tokenIvsRouter;