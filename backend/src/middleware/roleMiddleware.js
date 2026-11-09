const logger = require('../utils/logger');

// Role-based access control (RBAC).
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // protect should already have set req.user. If not, treat as not logged in.
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, please log in'
      });
    }

    // Logged in, but the role is not allowed to do this action
    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('ACCESS_DENIED', {
        userId: req.user.id,
        role: req.user.role,
        method: req.method,
        path: req.originalUrl,
        ip: req.ip
      });
      return res.status(403).json({
        success: false,
        message: 'Forbidden: your role is not allowed to perform this action'
      });
    }

    next();
  };
}

module.exports = { authorizeRoles };