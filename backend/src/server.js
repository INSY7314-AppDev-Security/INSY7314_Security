// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');

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
// ERROR HANDLING (must be registered LAST, after all routes)
// ============================================
const { notFound, errorHandler } = require('./middleware/errorHandler');

app.use(notFound);
app.use(errorHandler);

// ============================================
// START THE SERVER OVER HTTPS
// ============================================

const PORT = process.env.PORT || 5000;

// Paths to our local self-signed certificate and private key.
// See certs/README.md for how these were generated.
const keyPath = path.join(__dirname, '..', 'certs', 'key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');

// Fail loudly if the cert/key are missing, instead of silently falling
// back to plain HTTP. HustleHub+ handles credentials and financial data,
// so the server should never start without encryption.
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('FATAL: TLS certificate/key not found in /certs. See certs/README.md to generate one.');
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`Server is running securely on https://localhost:${PORT}`);
});

//Plain English Breakdown for clarity
/*
require('dotenv').config() loads the secret values from the .env file.
helmet() adds basic security headers.
cors() allows the frontend (later) to talk to this backend.
express.json() lets us read the data people send in requests.
app.use('/api/auth', authRoutes) connects our register and login routes.
notFound catches any URL that doesn't match a route and returns a clean 404.
errorHandler catches every error passed via next(error) anywhere in the app and
sends back a safe message - no stack traces, no internal details - while logging
the real error to our own console for debugging.
app.listen(...) actually starts the server so it can receive requests.

https.createServer(...) wraps our Express app in an encrypted HTTPS connection
using a local certificate, instead of plain unencrypted HTTP. This matters
because register/login send passwords and tokens over the network - HTTPS
stops anyone intercepting that traffic from reading it.
*/