const express = require('express');
const router = express.Router();
const { getFarmSummary, addHenLog, addProduction, addExpense, addRevenue } = require('../controllers/farmController');
const { protect, adminOrManager } = require('../middleware/authMiddleware');

router.route('/summary').get(protect, adminOrManager, getFarmSummary);
router.route('/hens').post(protect, adminOrManager, addHenLog);
router.route('/production').post(protect, adminOrManager, addProduction);
router.route('/expenses').post(protect, adminOrManager, addExpense);
router.route('/revenues').post(protect, adminOrManager, addRevenue);

module.exports = router;
