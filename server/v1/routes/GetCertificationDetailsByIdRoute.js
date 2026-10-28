const express = require('express');
const GetCertificationDetailsByIdRouter = express.Router();
const { GetCertificationDetailsByIds } = require('../controller/certificationController.js');
GetCertificationDetailsByIdRouter.get('/get-certdetails/:certification_id', GetCertificationDetailsByIds);
module.exports = GetCertificationDetailsByIdRouter;