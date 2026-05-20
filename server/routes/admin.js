const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// In-memory system settings (persists for server lifetime; extend to DB for production)
let systemSettings = {
  appName: 'SmartExpenseTracker',
  currency: 'Rs.',
  maxBudget: 1000000,
  allowRegistrations: true,
  maintenanceMode: false,
  defaultExpenseCategories: ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Education', 'Other'],
  defaultIncomeCategories: ['Salary', 'Freelance', 'Investment', 'Business', 'Gift', 'Other'],
  contactEmail: 'admin@smartexpensetracker.com',
  supportMessage: 'Welcome to SmartExpenseTracker! Track your expenses wisely.',
};

// ── Public: list categories for users (no admin auth needed) ─────────────────
router.get('/categories/list', (req, res) => {
  res.json({
    expenseCategories: systemSettings.defaultExpenseCategories,
    incomeCategories: systemSettings.defaultIncomeCategories,
  });
});

// ── Public: Get basic public settings (like appName) ─────────────────
router.get('/settings/public', (req, res) => {
  res.json({
    appName: systemSettings.appName,
    allowRegistrations: systemSettings.allowRegistrations,
    maintenanceMode: systemSettings.maintenanceMode
  });
});

// Get admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    const volumeResult = await Transaction.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalVolume = volumeResult[0]?.total || 0;

    // Fetch ALL registered users (so new accounts with no transactions are included)
    const allUsers = await User.find().sort({ createdAt: -1 }).lean();

    // Fetch transaction summaries grouped by userId
    const txActivity = await Transaction.aggregate([
      { $sort: { createdAt: -1, _id: -1 } },
      {
        $group: {
          _id: '$userId',
          transactions: { $push: '$$ROOT' },
          latestDate: { $max: '$createdAt' }
        }
      }
    ]);

    // Build a lookup map: userId (string) -> transaction group
    const txMap = {};
    txActivity.forEach(group => {
      txMap[group._id.toString()] = group;
    });

    // Merge: every user gets an entry; transaction data is filled in if it exists
    const userGroups = allUsers.map(user => {
      const group = txMap[user._id.toString()];
      const transactions = group ? group.transactions : [];
      const incomeTx = transactions.filter(t => t.type === 'income');
      const expenseTx = transactions.filter(t => t.type === 'expense');
      const totalInc = incomeTx.reduce((s, t) => s + (t.amount || 0), 0);
      const totalExp = expenseTx.reduce((s, t) => s + (t.amount || 0), 0);

      return {
        userId: user._id,
        name: user.name || 'Unknown',
        email: user.email || '',
        incomeTx: incomeTx.slice(0, 3),
        expenseTx: expenseTx.slice(0, 3),
        totalInc,
        totalExp,
        net: totalInc - totalExp,
        hasActivity: transactions.length > 0
      };
    });

    res.json({ totalUsers, totalTransactions, totalVolume, userGroups });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    // Compute balance for each user
    const usersWithBalance = await Promise.all(
      users.map(async (user) => {
        const result = await Transaction.aggregate([
          { $match: { userId: user._id } },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' }
            }
          }
        ]);

        let income = 0, expense = 0;
        result.forEach(r => {
          if (r._id === 'income') income = r.total;
          else expense = r.total;
        });

        return {
          ...user.toJSON(),
          balance: income - expense
        };
      })
    );

    res.json(usersWithBalance);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Toggle ban/unban user
router.patch('/users/:id/toggle-ban', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = user.status === 'active' ? 'banned' : 'active';
    await user.save();

    res.json({ message: `User ${user.status === 'active' ? 'unbanned' : 'banned'} successfully`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get category stats — reads from systemSettings (single source of truth)
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const incomeCats = systemSettings.defaultIncomeCategories;
    const expenseCats = systemSettings.defaultExpenseCategories;

    const transactions = await Transaction.find();

    const computeStats = (type, categoryName) => {
      const filtered = transactions.filter(
        t => t.type === type && t.category === categoryName
      );
      return {
        count: filtered.length,
        sum: filtered.reduce((s, t) => s + (t.amount || 0), 0)
      };
    };

    // Also include any categories found in actual transactions
    // that might not be in settings (historical data)
    const allIncomeCatsInTx = [...new Set(
      transactions.filter(t => t.type === 'income').map(t => t.category)
    )];
    const allExpenseCatsInTx = [...new Set(
      transactions.filter(t => t.type === 'expense').map(t => t.category)
    )];

    const mergedIncome = [...new Set([...incomeCats, ...allIncomeCatsInTx])];
    const mergedExpense = [...new Set([...expenseCats, ...allExpenseCatsInTx])];

    const incomeStats = mergedIncome.map(name => ({
      name,
      ...computeStats('income', name)
    }));

    const expenseStats = mergedExpense.map(name => ({
      name,
      ...computeStats('expense', name)
    }));

    res.json({ incomeStats, expenseStats });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Purge invalid transactions
router.delete('/purge-invalid', adminAuth, async (req, res) => {
  try {
    const result = await Transaction.deleteMany({
      $or: [
        { amount: { $lt: 1 } },
        { amount: { $gt: 10000000 } },
        { amount: null }
      ]
    });
    res.json({ message: `Removed ${result.deletedCount} invalid records` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ── User Profile Detail ───────────────────────────────────────────────────────
router.get('/users/:id/profile', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const transactions = await Transaction.find({ userId: req.params.id })
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

// ── System Settings ───────────────────────────────────────────────────────────
router.get('/settings', adminAuth, (req, res) => {
  res.json(systemSettings);
});

router.put('/settings', adminAuth, (req, res) => {
  const allowed = [
    'appName', 'currency', 'maxBudget', 'allowRegistrations',
    'maintenanceMode', 'defaultExpenseCategories', 'defaultIncomeCategories',
    'contactEmail', 'supportMessage'
  ];
  const updates = {};
  allowed.forEach(key => {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  });
  systemSettings = { ...systemSettings, ...updates };
  res.json({ message: 'Settings saved successfully', settings: systemSettings });
});

module.exports = { router, getSystemSettings: () => systemSettings };

