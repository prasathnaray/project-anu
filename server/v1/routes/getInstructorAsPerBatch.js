const express = require('express');
const {InstructorBatchC}  = require('../controller/createBatch.js');
const getInstrcutorAsPerBatchrouter = express.Router();
getInstrcutorAsPerBatchrouter.get('/instructor-as-per-batch', InstructorBatchC);
module.exports = getInstrcutorAsPerBatchrouter;