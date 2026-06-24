const express = require('express');
const {
    createReattDataController,
    getReattDataController
} = require('../controller/reattController');

const reattRouter = express.Router();

reattRouter.post('/reatt-data', createReattDataController);
reattRouter.get('/reatt-data', getReattDataController);

module.exports = reattRouter;
