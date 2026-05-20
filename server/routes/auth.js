const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'smartExpenseTracker2026SecretKey';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@expense.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adminPass99';

const { getSystemSettings } = require('./admin');

// Register
router.post('/register', async (req, res) => {
  try {
    const settings = getSystemSettings();
    if (settings.maintenanceMode) {
      return res.status(503).json({ message: 'System is under maintenance. Please try again later.' });
    }
    if (!settings.allowRegistrations) {
      return res.status(403).json({ message: 'New user registrations are currently disabled by the administrator.' });
    }
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
    if (!passRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long, and include at least one uppercase letter, one number, and one special character (e.g. @, $).' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,3}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address ending with a 2 or 3 letter domain (e.g., .com, .in, .org).' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please sign in.' });
    }

    const user = await User.create({ name, email: email.toLowerCase(), password });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const settings = getSystemSettings();
    if (settings.maintenanceMode) {
      return res.status(503).json({ message: 'System is under maintenance. Please try again later.' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect Email or Password!' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Your account has been banned. Contact admin.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect Email or Password!' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Admin Login
router.post('/admin-login', (req, res) => {
  const { email, password } = req.body;

  if (email?.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ isAdmin: true, email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, isAdmin: true });
  }

  res.status(401).json({ message: 'Invalid Admin Credentials!' });
});

// Get current user
router.get('/me', auth, (req, res) => {
  if (req.isAdmin) {
    return res.json({ isAdmin: true, email: req.adminEmail });
  }
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email
    }
  });
});
// Get detailed user profile (same calculation as admin side, but just for self)
router.get('/profile', auth, async (req, res) => {
  try {
    if (req.isAdmin) return res.status(403).json({ message: 'Admins have no profile here' });

    const user = await User.findById(req.user._id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1, _id: -1 })
      .lean();

    const income = transactions.filter(t => t.type === 'income');
    const expenses = transactions.filter(t => t.type === 'expense');
    const totalIncome = income.reduce((s, t) => s + (t.amount || 0), 0);
    const totalExpense = expenses.reduce((s, t) => s + (t.amount || 0), 0);

    // Monthly breakdown (last 6 months)
    const now = new Date();
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
      const monthTx = transactions.filter(t => {
        const td = new Date(t.date);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      });
      monthly.push({
        label,
        income: monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        expense: monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
      });
    }

    // Category breakdown
    const categoryMap = {};
    transactions.forEach(t => {
      if (!categoryMap[t.category]) categoryMap[t.category] = { income: 0, expense: 0, count: 0 };
      categoryMap[t.category][t.type] += t.amount || 0;
      categoryMap[t.category].count += 1;
    });
    const categories = Object.entries(categoryMap).map(([name, v]) => ({ name, ...v }));

    res.json({
      user,
      stats: { totalIncome, totalExpense, net: totalIncome - totalExpense, txCount: transactions.length },
      recentTransactions: transactions.slice(0, 20),
      monthly,
      categories,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Update user profile settings
router.put('/profile', auth, async (req, res) => {
  try {
    if (req.isAdmin) return res.status(403).json({ message: 'Admins cannot update profile here' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, password, monthlyBudget } = req.body;

    if (name) user.name = name;
    if (monthlyBudget !== undefined) user.monthlyBudget = Number(monthlyBudget) || 0;
    if (password) {
      const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/;
      if (!passRegex.test(password)) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long, and include at least one uppercase letter, one number, and one special character (e.g. @, $).' });
      }
      user.password = password;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});
// Reset all user data (delete all transactions for this user)
router.delete('/profile/reset', auth, async (req, res) => {
  try {
    if (req.isAdmin) return res.status(403).json({ message: 'Admins cannot perform reset here' });

    const result = await Transaction.deleteMany({ userId: req.user._id });
    res.json({ message: `Successfully reset account. Removed ${result.deletedCount} transactions.` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
