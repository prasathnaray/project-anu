const express = require('express');
const { individualBatchC } = require('../controller/createBatch');
const IndBatchProfileRouter = express.Router();
IndBatchProfileRouter.get('/batch-individual/:batch_id', individualBatchC);
module.exports = IndBatchProfileRouter;
