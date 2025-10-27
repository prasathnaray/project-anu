const express = require('express');
const { InTLListC } = require('../controller/createBatch');
const getIndividualTLRouter =  express.Router();
getIndividualTLRouter.get('/tllist-ind', InTLListC);
module.exports = getIndividualTLRouter;