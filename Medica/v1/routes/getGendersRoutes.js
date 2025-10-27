const express = require('express');
const {GenderRatioC} = require('../controller/Analytics')
const getGendersRoute = express.Router();

getGendersRoute.get('/get-gender-ratio', GenderRatioC);

module.exports = getGendersRoute;