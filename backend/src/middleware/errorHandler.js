const logger = require('../utils/logger');

//404 HANDLER
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

// Writes the full detail to the logs. The client never sees any of it.
function logError(level, event, err, req, statusCode) {
  logger.log(level, event, {
    statusCode,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip,
    userId: req.user && req.user.id,
    error: err.message,
    stack: statusCode >= 500 ? err.stack : undefined
  });
}

//CENTRAL ERROR HANDLER
function errorHandler(err, req, res, next) {
  //Known client mistakes get a clear 400/409/413 instead of a generic 500
  if (err.type === 'entity.parse.failed') {
    logError('warn', 'REQUEST_ERROR', err, req, 400);
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
  }
  if (err.type === 'entity.too.large') {
    logError('warn', 'REQUEST_ERROR', err, req, 413);
    return res.status(413).json({ success: false, message: 'Request body is too large' });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    logError('warn', 'REQUEST_ERROR', err, req, 400);
    return res.status(400).json({ success: false, message: 'Invalid data provided' });
  }
  if (err.code === 11000) {
    logError('warn', 'REQUEST_ERROR', err, req, 409);
    return res.status(409).json({ success: false, message: 'That record already exists' });
  }

  //Never leak stack traces or internal details to the client
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  //Log full error on the server
  logError(
    statusCode >= 500 ? 'error' : 'warn',
    statusCode >= 500 ? 'SERVER_ERROR' : 'REQUEST_ERROR',
    err, req, statusCode
  );

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500
      ? 'Something went wrong on our side. Please try again later.'
      : err.message
  });
}

module.exports = { notFound, errorHandler };
