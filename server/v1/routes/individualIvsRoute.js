const express = require('express');
const {getIndividualStreamingData} = require('../controller/streamingController');

const getIndividualIvsRouter = express.Router();

getIndividualIvsRouter.get('/ivs-ind', getIndividualStreamingData)

module.exports = getIndividualIvsRouter;

