const express = require('express');
const {getAdminC}  = require('../controller/adminController');
const getAdminRouter = express.Router();
getAdminRouter.get('/get-admins', getAdminC)
module.exports = getAdminRouter;