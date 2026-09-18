const express = require('express');
const rateLimit = require('express-rate-limit');
const { createLegacyPublisherSession } = require('../controller/streamingSessionController');

const router = express.Router();
const tokenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.user_mail,
  message: { message: 'Too many streaming connection attempts. Please wait and try again.' }
});

router.post('/tokenn', tokenLimiter, createLegacyPublisherSession);

module.exports = router;
