const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  registerValidationRules,
  loginValidationRules,
  handleValidationErrors
} = require('../middleware/validators');

// Public routes
router.post('/register', registerValidationRules, handleValidationErrors, register);
router.post('/login', loginValidationRules, handleValidationErrors, login);

// Protected route – only works with a valid token
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You are authorized',
    user: req.user
  });
});

module.exports = router;
