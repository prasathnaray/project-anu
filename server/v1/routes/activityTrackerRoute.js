const express = require('express');
const router = express.Router();
const controller = require('../controller/activityTrackerController');
const jwt = require('jsonwebtoken');

// Soft auth middleware: extracts user info from Bearer token if provided without 401 failure
const softAuth = (req, res, next) => {
  const authHeader = req.headers?.authorization || '';
  const token = /^Bearer (.+)$/i.exec(authHeader)?.[1] || req.cookies?.refreshToken;
  if (token) {
    try {
      const decoded = jwt.decode(token);
      if (decoded) {
        req.user = {
          ...decoded,
          user_mail: decoded.user_mail || decoded.email,
          role: decoded.role,
          people_id: decoded.people_id || decoded.id
        };
      }
    } catch (_) {}
  }
  next();
};

router.post('/activity-logs/track', softAuth, controller.trackClientActivity);
router.get('/activity-logs/statistics', controller.getStatistics);
router.get('/activity-logs/recent', controller.getRecent);
router.get('/activity-logs/summary', controller.getSummary);

module.exports = router;
