const { HenLog, DailyProduction, Expense, Revenue } = require('../models/FarmOperations');

// @desc    Get Farm Dashboard Summary
// @route   GET /api/farm/summary
// @access  Private/Manager
const getFarmSummary = async (req, res) => {
  try {
    const henLogs = await HenLog.find().sort({ createdAt: -1 });
    let totalHens = 0;
    henLogs.forEach(log => {
      if (log.type === 'Add') totalHens += log.quantity;
      if (log.type === 'Remove') totalHens -= log.quantity;
    });

    const latestProduction = await DailyProduction.find().sort({ date: -1 }).limit(5);
    const latestExpenses = await Expense.find().sort({ date: -1 }).limit(5);
    const latestRevenues = await Revenue.find().sort({ date: -1 }).limit(5);
    const latestHenLogs = await HenLog.find().sort({ date: -1 }).limit(5);

    res.json({
      totalHens,
      latestProduction,
      latestExpenses,
      latestRevenues,
      latestHenLogs
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching farm summary' });
  }
};

// @desc    Add Hen Log
// @route   POST /api/farm/hens
// @access  Private/Manager
const addHenLog = async (req, res) => {
  try {
    const { type, quantity, reason } = req.body;
    
    // Check if removing more than we have
    if (type === 'Remove') {
      const allLogs = await HenLog.find();
      let totalHens = 0;
      allLogs.forEach(log => {
        if (log.type === 'Add') totalHens += log.quantity;
        if (log.type === 'Remove') totalHens -= log.quantity;
      });
      if (quantity > totalHens) {
        return res.status(400).json({ message: 'Cannot remove more hens than currently exist.' });
      }
    }

    const log = await HenLog.create({ type, quantity, reason });
    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: 'Error adding hen log' });
  }
};

// @desc    Add Daily Production
// @route   POST /api/farm/production
// @access  Private/Manager
const addProduction = async (req, res) => {
  try {
    const { eggsCollected, date } = req.body;
    const prod = await DailyProduction.create({ eggsCollected, date });
    res.status(201).json(prod);
  } catch (error) {
    res.status(500).json({ message: 'Error adding production' });
  }
};

// @desc    Add Expense
// @route   POST /api/farm/expenses
// @access  Private/Manager
const addExpense = async (req, res) => {
  try {
    const { amount, category, reason, date } = req.body;
    const expense = await Expense.create({ amount, category, reason, date });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense' });
  }
};

// @desc    Add Revenue
// @route   POST /api/farm/revenues
// @access  Private/Manager
const addRevenue = async (req, res) => {
  try {
    const { amount, source, date } = req.body;
    const revenue = await Revenue.create({ amount, source, date });
    res.status(201).json(revenue);
  } catch (error) {
    res.status(500).json({ message: 'Error adding revenue' });
  }
};

module.exports = {
  getFarmSummary,
  addHenLog,
  addProduction,
  addExpense,
  addRevenue
};
