const express = require('express')
const {getCertificationByCurController} = require('../controller/CertificationController')
const getCertByCuriculumRouter = express.Router();
getCertByCuriculumRouter.get('/get-cert/:curiculum_id', getCertificationByCurController);
module.exports = getCertByCuriculumRouter;