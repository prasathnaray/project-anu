const express = require('express');
const getVrData = require('../controller/vrDataC');
const getVrDataRouter = express.Router();
getVrDataRouter.get('/get-vr-data', getVrData);
module.exports = getVrDataRouter;