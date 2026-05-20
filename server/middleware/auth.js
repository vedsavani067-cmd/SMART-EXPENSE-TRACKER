const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'smartExpenseTracker2026SecretKey';

// Protect user routes
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if it's an admin token
    if (decoded.isAdmin) {
      req.isAdmin = true;
      req.adminEmail = decoded.email;
      return next();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Account has been banned' });
    }

    req.user = user;
    return next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Protect admin routes
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    req.isAdmin = true;
    req.adminEmail = decoded.email;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { auth, adminAuth };
