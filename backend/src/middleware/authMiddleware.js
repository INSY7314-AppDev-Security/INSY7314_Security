const jwt = require('jsonwebtoken');

function protect(req, res, next) {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
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
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token failed'
    });
  }
}

module.exports = { protect };