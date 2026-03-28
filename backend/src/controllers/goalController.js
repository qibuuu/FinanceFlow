const Goal = require('../models/Goal');

// @desc    Get all goals for user
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res, next) => {
  try {
    const { title, targetAmount, savedAmount, deadline, status } = req.body;

    const goal = await Goal.create({
      user: req.user._id,
      title,
      targetAmount,
      savedAmount: savedAmount || 0,
      deadline,
      status: status || 'active',
    });

    res.status(201).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

// @desc    Update goal (or add savings)
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Process 'addAmount' shortcut (adds to savedAmount)
    if (req.body.addAmount) {
      goal.savedAmount += Number(req.body.addAmount);
      
      // Auto complete if reached target
      if (goal.savedAmount >= goal.targetAmount) {
        goal.status = 'completed';
      }
      
      await goal.save();
      return res.status(200).json({ success: true, data: goal });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    if (goal.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await goal.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
