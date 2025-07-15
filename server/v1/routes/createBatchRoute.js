const express = require('express');
const {batchCreation} = require('../controller/createBatch');
const batchCreationRouter = express.Router();
const multer = require('multer');
batchCreationRouter.post('/create-batch', batchCreation);
module.exports = batchCreationRouter;