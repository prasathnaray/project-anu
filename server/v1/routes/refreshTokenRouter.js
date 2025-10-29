const express = require('express');
const refreshToken = require('../Auth/refreshToken');
const refreshTokenRouter = express.Router();

refreshTokenRouter.post('/refresh-token', refreshToken);

module.exports = refreshTokenRouter;