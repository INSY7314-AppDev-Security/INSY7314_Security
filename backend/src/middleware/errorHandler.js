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

//Plain English Breakdown for clarity
/*
notFound catches any request to a URL we don't have a route for (e.g. /api/blah)
and returns a clean 404 instead of Express's default HTML error page.

errorHandler is the LAST piece of middleware in server.js. Any time a controller
calls next(error), the request skips straight here instead of crashing the server
or showing the user a stack trace.

We log the REAL error with console.error so we (the developers) can see exactly
what broke, but the RESPONSE sent to the client is always a safe, generic message
for 500 errors - no file paths, no stack traces, no internal details. This stops
attackers learning about our code structure through error messages.
*/