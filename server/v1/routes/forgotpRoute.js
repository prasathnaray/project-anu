const express = require('express');
const forgotpController = require('../controller/forgotpasswordcontroller');
const ForgotPRouter = express.Router();

ForgotPRouter.post('/forgot-password', forgotpController);

module.exports = ForgotPRouter;