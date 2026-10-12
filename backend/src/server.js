// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const { sanitizeInput } = require('./middleware/sanitize');

// Import routes
const authRoutes = require('./routes/authRoutes');
const gigRoutes = require('./routes/gigRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const incomeRoutes = require('./routes/incomeRoutes');

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

app.use(cors());
app.use(express.json());

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
const { notFound, errorHandler } = require('./middleware/errorHandler');

app.use(notFound);
app.use(errorHandler);

// ============================================
// START THE SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const keyPath = path.join(__dirname, '..', 'certs', 'key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('FATAL: TLS certificate/key not found in /certs.');
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

connectDB().then(() => {
  https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`Server is running securely on https://localhost:${PORT}`);
  });
});
