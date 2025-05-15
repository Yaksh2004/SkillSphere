const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const recruiterToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== 'recruiter') {
      return res.status(403).json({ message: 'Access denied: Recruiter only' });
    }

    req.recruiter = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = recruiterToken;
