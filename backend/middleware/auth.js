const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SECRET = process.env.JWT_SECRET || 'cityheart_dev_secret';

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    const { userId } = jwt.verify(token, SECRET);
    req.user = await User.findById(userId).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch { res.status(401).json({ message: 'Invalid token' }); }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      const { userId } = jwt.verify(token, SECRET);
      req.user = await User.findById(userId).select('-password');
    }
  } catch {}
  next();
};

module.exports = { auth, optionalAuth };
