const {createScanCenterC} = require("../controller/scancentersController");
const { validateCreateScanCenter } = require('../utils/scanCenterValidator');
const express = require('express');
const createscanCentersRouter = express.Router();
createscanCentersRouter.post('/create-scan-center', validateCreateScanCenter, createScanCenterC); 
module.exports = createscanCentersRouter;