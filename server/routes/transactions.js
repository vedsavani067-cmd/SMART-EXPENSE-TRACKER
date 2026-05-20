const express = require('express');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all transactions for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1, _id: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add a transaction
router.post('/', auth, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 1 || amt > 10000000) {
      return res.status(400).json({ message: 'Amount must be between 1 and 1,00,00,000 (1 Cr).' });
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount: amt,
      category,
      description: description || '',
      date
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete a transaction
router.delete('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.deleteOne({ _id: req.params.id });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
