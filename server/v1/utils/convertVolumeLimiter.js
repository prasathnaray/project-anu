const rateLimit = require("express-rate-limit");

const convertVolumeLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 1,                  // max 1 starts
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // limit per user, not per IP
    return req.user.user_mail;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many conversion requests. Please wait."
    });
  }
});
module.exports = { convertVolumeLimiter };