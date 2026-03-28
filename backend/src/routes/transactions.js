const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
  exportCSV,
} = require('../controllers/transactionController');

// All routes are protected
router.use(protect);

// Special routes (must come before /:id)
router.get('/summary', getSummary);
router.get('/export', exportCSV);

// CRUD routes
router.route('/').get(getTransactions).post(createTransaction);
router.route('/:id').get(getTransaction).put(updateTransaction).delete(deleteTransaction);

module.exports = router;
