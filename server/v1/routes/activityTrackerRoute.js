const express = require('express');
const router = express.Router();
const controller = require('../controller/activityTrackerController');

router.post('/activity-logs/track', controller.trackClientActivity);
router.get('/activity-logs/statistics', controller.getStatistics);
router.get('/activity-logs/recent', controller.getRecent);
router.get('/activity-logs/summary', controller.getSummary);

module.exports = router;
