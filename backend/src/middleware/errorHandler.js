//404 HANDLER
function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

//CENTRAL ERROR HANDLER
function errorHandler(err, req, res, next) {
  //Log full error on the server
  console.error('ERROR:', err);

  //Known client mistakes get a clear 400/409 instead of a generic 500
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body' });
  }
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid data provided' });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: 'That record already exists' });
  }

  //Never leak stack traces or internal details to the client
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500
      ? 'Something went wrong on our side. Please try again later.'
      : err.message
  });
}

module.exports = { notFound, errorHandler };

