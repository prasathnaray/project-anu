const express = require('express');
const { PerformanceMetrics } = require('../controller/Analytics.js');

const performanceMetricsRouter = express.Router();

performanceMetricsRouter.get('/performance-metrics', PerformanceMetrics);

module.exports = performanceMetricsRouter;
