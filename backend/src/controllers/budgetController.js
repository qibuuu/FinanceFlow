const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

/**
 * @desc    Get all budgets for logged-in user (optionally filtered by month/year)
 * @route   GET /api/budgets
 * @access  Private
 */
const getBudgets = async (req, res, next) => {
  try {
    const now = new Date();
    const month = req.query.month ? Number(req.query.month) : now.getMonth() + 1;
    const year = req.query.year ? Number(req.query.year) : now.getFullYear();

    const budgets = await Budget.find({ user: req.user._id, month, year });

    // Calculate actual spending for each budget category in the given month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    const spending = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: 'expense',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const spendingMap = {};
    spending.forEach((s) => (spendingMap[s._id] = s.spent));

    // Attach actual spending and calculate percentage/alert
    const enriched = budgets.map((b) => {
      const spent = spendingMap[b.category] || 0;
      const percentage = (spent / b.limit) * 100;
      return {
        ...b.toObject(),
        spent,
        remaining: b.limit - spent,
        percentage: Math.round(percentage),
        alert: spent >= b.limit, // Over budget flag
        warning: percentage >= 80 && percentage < 100, // 80% threshold warning
      };
    });

    res.json({ success: true, data: enriched });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update a budget for a category/month/year
 * @route   POST /api/budgets
 * @access  Private
 */
const upsertBudget = async (req, res, next) => {
  try {
    const { category, limit, month, year } = req.body;

    // Upsert: update if exists, create if not
    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { limit },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(201).json({ success: true, data: budget });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a budget
 * @route   DELETE /api/budgets/:id
 * @access  Private
 */
const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.json({ success: true, message: 'Budget deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBudgets, upsertBudget, deleteBudget };
