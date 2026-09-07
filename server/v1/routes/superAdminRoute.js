const express = require('express');
const controller = require('../controller/superAdminController');

const router = express.Router();
router.get('/super-admins', controller.list);
router.post('/super-admins', controller.create);
router.get('/superadmin/stats', controller.getStats);
router.get('/superadmin-stats', controller.getStats);

module.exports = router;

