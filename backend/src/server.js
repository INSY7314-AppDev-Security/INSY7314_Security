// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import our auth routes
const authRoutes = require('./routes/authRoutes');

// Create the Express application
const app = express();

// ============================================
// MIDDLEWARE (runs on every request)
// ============================================

// Security headers
app.use(helmet());

// Allow requests from other origins (needed later for frontend)
app.use(cors());

// Allow the server to read JSON data from requests
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// All authentication routes start with /api/auth
app.use('/api/auth', authRoutes);

// Simple test route to check if the server is alive
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HustleHub+ API is running'
  });
});

// ============================================
// START THE SERVER
// ============================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

//Plain English Breakdown fro clarity
/*
require('dotenv').config() loads the secret values from the .env file.
helmet() adds basic security headers.
cors() allows the frontend (later) to talk to this backend.
express.json() lets us read the data people send in requests.
app.use('/api/auth', authRoutes) connects our register and login routes.
app.listen(...) actually starts the server so it can receive requests.
*/