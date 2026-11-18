const { createScanCenterC, updateScanCenterC } = require("../controller/scancentersController");
const { validateCreateScanCenter } = require('../utils/scanCenterValidator');
const express = require('express');
const createscanCentersRouter = express.Router();
createscanCentersRouter.post('/create-scan-center', validateCreateScanCenter, createScanCenterC);
createscanCentersRouter.put('/update-scan-center', updateScanCenterC);
module.exports = createscanCentersRouter;