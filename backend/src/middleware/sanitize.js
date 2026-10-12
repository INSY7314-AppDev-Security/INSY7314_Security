// Removes keys that start with $ or contain a dot, so nobody can
// sneak MongoDB operators into a request.
function stripDollarKeys(obj) {
  if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        stripDollarKeys(obj[key]);
      }
    }
  }
}

function sanitizeInput(req, res, next) {
  stripDollarKeys(req.body);
  stripDollarKeys(req.params);
  next();
}

module.exports = { sanitizeInput };

