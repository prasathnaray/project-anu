const express = require('express');
const { createQueryC, getQueriesC, updateQueryStatusC, deleteQueryC } = require('../controller/queriesController.js');
const queriesRouter = express.Router();

queriesRouter.post('/queries', createQueryC);
queriesRouter.get('/queries', getQueriesC);
queriesRouter.put('/queries/:query_id/status', updateQueryStatusC);
queriesRouter.delete('/queries/:query_id', deleteQueryC);

module.exports = queriesRouter;
