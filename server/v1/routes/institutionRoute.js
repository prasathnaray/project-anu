const express = require('express');
const { validateCreateScanCenter } = require('../utils/scanCenterValidator');
const { createScanCenterC, getScanCentersC, addInstitutionAdminC } = require('../controller/scancentersController');

const router = express.Router();
router.get('/institutions', getScanCentersC);
router.post('/institutions', validateCreateScanCenter, createScanCenterC);
router.post('/institutions/:institutionId/admins', addInstitutionAdminC);

module.exports = router;
