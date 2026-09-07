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

