const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const userToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
     
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = userToken;
