const jwt = require('jsonwebtoken');

// Middleware function to protect routes
const auth = (req, res, next) => {
  try {
    // 1. Get token from cookie (assumes you're using cookie-parser middleware)
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 2. Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach decoded user data to request
    req.user = decoded;

    // 4. Continue to next middleware/route
    next();
  } catch (error) {
    console.error('JWT Auth Error:', error.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;