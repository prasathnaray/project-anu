const express = require('express');
const LoginRequest = require('../Auth/authController.js');
const LoginRouter = express.Router();

LoginRouter.post('/login', LoginRequest);

module.exports = LoginRouter;