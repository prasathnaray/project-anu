const express = require('express');
const refreshToken = require('../Auth/refreshToken');
const refreshTokenRouter = express.Router();

refreshTokenRouter.post('/token', refreshToken);

module.exports = refreshTokenRouter;