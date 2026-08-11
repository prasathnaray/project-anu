const express = require('express');
const controller = require('../controller/SuperAdminController');

const router = express.Router();
router.get('/super-admins', controller.list);
router.post('/super-admins', controller.create);

module.exports = router;
