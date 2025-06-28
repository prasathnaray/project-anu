const express = require('express');
const profilecontroller = require('../controller/profilecontroller');
const ProfileRouter = express.Router();

ProfileRouter.get('/profile', profilecontroller);

module.exports = ProfileRouter;