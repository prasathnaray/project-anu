const express = require('express');
const {deleteBatchc} = require('../controller/createBatch');
const deleteBatchRouter = express.Router();
deleteBatchRouter.delete('/delete-batch/:batch_id', deleteBatchc);
module.exports = deleteBatchRouter;