// Load environment variables from .env file
require('dotenv').config();

const https = require('https');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const app = require('./app');

// ============================================
// START THE SERVER
// ============================================

const PORT = process.env.PORT || 5000;

const keyPath = path.join(__dirname, '..', 'certs', 'key.pem');
const certPath = path.join(__dirname, '..', 'certs', 'cert.pem');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  logger.error('STARTUP_FAILED', { reason: 'TLS certificate/key not found in /certs' });
  console.error('FATAL: TLS certificate/key not found in /certs.');
  process.exit(1);
}

const httpsOptions = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath),
};

connectDB().then(() => {
  https.createServer(httpsOptions, app).listen(PORT, () => {
    logger.info('SERVER_STARTED', { port: PORT, protocol: 'https', cloudLogging: logger.cloudLoggingEnabled });
    console.log(`Server is running securely on https://localhost:${PORT}`);
  });
});

//Plain English Breakdown for clarity
/*
server.js loads the secrets from .env, checks the HTTPS certificate exists,
connects to MongoDB, and only then starts the HTTPS server.
The app itself (middleware and routes) lives in app.js.
*/
