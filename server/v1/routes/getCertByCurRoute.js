const express = require('express')
const { getCertificationByCurController } = require('../controller/certificationController')
const getCertByCuriculumRouter = express.Router();
getCertByCuriculumRouter.get('/get-cert/:curiculum_id', getCertificationByCurController);
module.exports = getCertByCuriculumRouter;