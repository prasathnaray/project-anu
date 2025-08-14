const express = require('express');
const  sendNotification  = require('../controller/notificationController.js');
const notifyRouter = express.Router();
notifyRouter.post('/send', sendNotification);
module.exports = notifyRouter;