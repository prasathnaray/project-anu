const express = require('express');
const {getScanCentersC} = require('../controller/scancentersController');
const getScanCenterRouter = express.Router();
getScanCenterRouter.get('/get-scan-centers', getScanCentersC);
module.exports = getScanCenterRouter;