const express = require('express');
const controller = require('../controller/superAdminController');

const router = express.Router();
router.get('/super-admins', controller.list);
router.post('/super-admins', controller.create);
router.get('/superadmin/stats', controller.getStats);
router.get('/superadmin-stats', controller.getStats);

// Global Activity Tracking & Statistics APIs
router.get('/super-admin/statistics', controller.getGlobalStatistics);
router.get('/superadmin/statistics', controller.getGlobalStatistics);

router.get('/super-admin/activity-summary', controller.getActivitySummary);
router.get('/superadmin/activity-summary', controller.getActivitySummary);

router.get('/super-admin/recent-activities', controller.getRecentActivities);
router.get('/superadmin/recent-activities', controller.getRecentActivities);

module.exports = router;