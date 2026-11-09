const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sanitizeInput } = require('./middleware/sanitize');

// Import routes
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Create the Express application
const app = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Only the HustleHub+ frontend may call this API from a browser.
// CORS_ORIGIN in .env can hold more than one address, separated by commas.
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600 // browsers may remember the preflight answer for 10 minutes
}));

// Reject request bodies bigger than 10 kb (413). Our largest real request is a
// gig, which is far smaller, so this only stops oversized or abusive payloads.
app.use(express.json({ limit: '10kb' }));

app.use(sanitizeInput);

// ============================================
// ROUTES
// ============================================

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/income', incomeRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HustleHub+ API is running'
  });
});

// ============================================
// ERROR HANDLING
// ============================================

app.use(notFound);
app.use(errorHandler);

module.exports = app;

//Plain English Breakdown for clarity
/*
This file builds the Express app: security headers, CORS, JSON parsing with a
size limit, input sanitising, all the routes and the error handlers.
It does NOT start the server. server.js does that. Keeping them apart means
tests can load the app without HTTPS certificates or a database.
CORS: browsers only get an answer if the request comes from an allowed frontend
address. Tools like Postman do not send an Origin header, so they still work.
*/
