const express = require('express');
const {getDashboardC} = require('../controller/dashboardController');
const dashboardRouter = express.Router();
dashboardRouter.get('/get-dashboard-data', getDashboardC);
module.exports = dashboardRouter;