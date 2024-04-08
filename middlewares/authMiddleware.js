import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const token = req.headers['token'];
  if (!token) {
    return res.status(403).json({ success: false, message: 'No token provided.' });
  }
  // verify the token in the request header
  jwt.verify(token, 'mysecretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Failed to authenticate token.' });
    }
    req.decoded = decoded;
    next();
  });
};

export default authMiddleware;
