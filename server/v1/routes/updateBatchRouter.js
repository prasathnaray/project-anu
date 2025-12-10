const express = require('express');
const {updateBatchC} = require('../controller/createBatch.js');
const updateBatchRouter = express.Router();
updateBatchRouter.put('/update-batch-data', updateBatchC);
module.exports = updateBatchRouter;