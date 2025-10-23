const express = require('express');
const filterBatchRouter = express.Router();
const {filterBatchC} = require('../controller/createBatch.js');
filterBatchRouter.get('/batch-filter', filterBatchC);
module.exports = filterBatchRouter;