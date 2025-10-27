const express = require('express');
const {DisableTrainee} = require('../controller/traineeController');
const disableTraineeRoute = express.Router();

disableTraineeRoute.patch('/disable-trainee/:user_mail/:status', DisableTrainee);

module.exports = disableTraineeRoute;