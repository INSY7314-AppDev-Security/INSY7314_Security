const mongoose = require('mongoose');
const logger = require('../utils/logger');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info('DB_CONNECTED');
    console.log('MongoDB connected');
  } catch (error) {
    logger.error('DB_CONNECTION_FAILED', { error: error.message });
    console.error('FATAL: MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;

//Plain English Breakdown for clarity
/*
connectDB opens the connection to MongoDB using the address in .env.
If it fails, the problem is logged and the server stops right away. We do not
want an API that runs without its database.
*/
