const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Every refused request is logged, so attacks on the tokens can be seen
function logAuthFailure(req, reason) {
  logger.warn('AUTH_FAILED', { reason, ip: req.ip, method: req.method, path: req.originalUrl });
}

function protect(req, res, next) {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logAuthFailure(req, 'no_token');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request so other routes can use it
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next(); // allow the request to continue
  } catch (error) {
    logAuthFailure(req, 'invalid_token');
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
}

// A logged-in user tried something their role does not allow
function logAccessDenied(req) {
  logger.warn('ACCESS_DENIED', {
    userId: req.user && req.user.id,
    role: req.user && req.user.role,
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  });
}

// Only lets certain roles through, for example authorizeRoles('freelancer')
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      logAccessDenied(req);
      return res.status(403).json({
        success: false,
        message: 'Access denied: you do not have permission to do this'
      });
    }
    next();
  };
}

module.exports = { protect, authorizeRoles };