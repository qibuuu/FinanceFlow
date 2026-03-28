const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getBudgets, upsertBudget, deleteBudget } = require('../controllers/budgetController');

router.use(protect);

router.route('/').get(getBudgets).post(upsertBudget);
router.route('/:id').delete(deleteBudget);

module.exports = router;
