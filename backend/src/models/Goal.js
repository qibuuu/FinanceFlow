const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a goal title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: [1, 'Target amount must be greater than 0'],
    },
    savedAmount: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Goal', goalSchema);
