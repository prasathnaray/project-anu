const express = require('express');
const {associateBatchc} = require('../controller/createBatch');
const associateBatchRouter = express.Router();
associateBatchRouter.post('/associate-batch', associateBatchc);
module.exports = associateBatchRouter;