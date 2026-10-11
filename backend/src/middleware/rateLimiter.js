const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Limit login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                   // max 5 attempts per window
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Limit bookings. Counted per logged-in user (the limiter runs after the JWT
// check), so people sharing one network do not block each other.
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // max 10 booking attempts per window
  keyGenerator: (req) =>
    req.user && req.user.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip),
  message: {
    success: false,
    message: 'Too many booking attempts. Please try again after 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { loginLimiter, bookingLimiter };
