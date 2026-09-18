const express = require('express');
const rateLimit = require('express-rate-limit');
const controller = require('../controller/streamingSessionController');

const router = express.Router();
const tokenLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.user.user_mail,
  message: { message: 'Too many streaming connection attempts. Please wait and try again.' }
});

router.post('/publisher-session/:sessionId/activate', tokenLimiter, controller.activatePublisherSession);
router.delete('/publisher-session/:sessionId', controller.stopPublisherSession);
router.post('/self-viewer-session', tokenLimiter, controller.createSelfViewerSession);
router.post('/viewer-session', tokenLimiter, controller.createViewerSession);

module.exports = router;
