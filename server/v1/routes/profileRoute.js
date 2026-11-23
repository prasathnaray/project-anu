const express = require('express');
const { profilecontroller, updateProfileController } = require('../controller/profilecontroller');
const ProfileRouter = express.Router();

ProfileRouter.get('/profile', profilecontroller);
ProfileRouter.patch('/profile', updateProfileController);

module.exports = ProfileRouter;
