const express = require('express');
const router = express.Router();

const { register, login } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route – only works with a valid token
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You are authorized',
    user: req.user
  });
});

module.exports = router;

//Plain English Breakdown for clarity
/*
express.Router() creates a mini-router just for authentication.

router.post('/register', register) means:
When someone sends a POST request to /register, run the register function from our controller.

router.post('/login', login) does the same for login.

Later we will attach this router to /api/auth in the main server file, so the full addresses become:
-POST /api/auth/register
-POST /api/auth/login
*/