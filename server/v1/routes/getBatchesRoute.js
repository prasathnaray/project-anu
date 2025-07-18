const express = require('express');
const {getBatchData} = require('../controller/createBatch');
const getBatchesRouter = express.Router();
getBatchesRouter.get('/get-batches', getBatchData);
module.exports = getBatchesRouter;