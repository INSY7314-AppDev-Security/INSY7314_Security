const express = require('express');
const router = express.Router();

// Import the controller functions we just created
const { register, login } = require('../controllers/authController');

// ============================================
// PUBLIC ROUTES (no token needed)
// ============================================

// Register a new user
// POST /api/auth/register
router.post('/register', register);

// Login an existing user
// POST /api/auth/login
router.post('/login', login);

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