const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { evaluateSession } = require('../utils/sessionCheck');
const { logSecurityEvent } = require('../utils/securityEvents');
const logger = require('../utils/logger');

// Every refused request is logged, so attacks on the tokens can be seen
function logAuthFailure(req, reason) {
  logger.warn('AUTH_FAILED', { reason, ip: req.ip, method: req.method, path: req.originalUrl });
}

async function protect(req, res, next) {
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

  // 1. Check the signature and expiry
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    logAuthFailure(req, 'invalid_token');
    logSecurityEvent('TOKEN_REJECTED', { reason: 'invalid_or_expired', ip: req.ip });
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }

  try {
    // 2. Check the token against the user's CURRENT record in the database
    const user = await User.findById(decoded.id).select('role +tokenVersion').lean();
    const session = evaluateSession(decoded, user);

    if (!session.ok) {
      logSecurityEvent('TOKEN_REJECTED', {
        reason: session.reason,
        userId: String(decoded.id),
        ip: req.ip
      });
      // Same message for every reason, so the API does not explain itself to attackers
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }

    // Attach the user info to the request so other routes can use it
    req.user = {
      id: decoded.id,
      role: session.role
    };

    next(); // allow the request to continue
  } catch (error) {
    next(error); // a database problem is a server error, not a login problem
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