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

router.get('/super-admin/system-health', controller.getSystemHealth);
router.get('/superadmin/system-health', controller.getSystemHealth);

// Feature 1: Historical System Performance Monitoring
router.get('/super-admin/system-health-history', controller.getSystemHealthHistory);
router.get('/superadmin/system-health-history', controller.getSystemHealthHistory);

// Feature 2: Advanced Security Monitoring
router.get('/super-admin/security-alerts', controller.getSecurityAlerts);
router.get('/superadmin/security-alerts', controller.getSecurityAlerts);
router.post('/super-admin/security-alerts/:id/action', controller.handleSecurityAlertAction);
router.post('/superadmin/security-alerts/:id/action', controller.handleSecurityAlertAction);

// Feature 3: Institution Performance Ranking
router.get('/super-admin/institution-rankings', controller.getInstitutionRankings);
router.get('/superadmin/institution-rankings', controller.getInstitutionRankings);

// Feature 4: System Maintenance & Backup Monitoring
router.get('/super-admin/system-maintenance', controller.getSystemMaintenance);
router.get('/superadmin/system-maintenance', controller.getSystemMaintenance);

// Feature 5: Automated Dashboard Reports
router.get('/super-admin/export-report', controller.exportReport);
router.get('/superadmin/export-report', controller.exportReport);

module.exports = router;
