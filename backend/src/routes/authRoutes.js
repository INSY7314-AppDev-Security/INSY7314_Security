const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
} = require('../middleware/validators');

// Public routes
router.post('/register', registerValidationRules, handleValidationErrors, register);
router.post('/login', loginLimiter, loginValidationRules, handleValidationErrors, login);

// Protected route: only works with a valid token
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You are authorized',
    user: req.user
  });
});

// Admin only test route: proves role checks work
router.get('/admin-check', protect, authorizeRoles('admin'), (req, res) => {
  res.status(200).json({ success: true, message: 'Welcome, admin' });
});

module.exports = router;

//Plain English Breakdown for clarity
/*
router.post('/register') runs the validation rules, then the register function.
router.post('/login') runs the login limiter, the validation rules, then the login function.
router.get('/me') only works with a valid token.
router.get('/admin-check') only works with a valid token AND the admin role.
*/