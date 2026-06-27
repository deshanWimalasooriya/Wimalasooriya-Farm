const { HenInventory, DailyProduction, Expenses, Revenue } = require('../models/FarmOperations');

// @desc    Get Farm Dashboard Summary
// @route   GET /api/farm/summary
// @access  Private/Manager
const getFarmSummary = async (req, res) => {
  try {
    let inventory = await HenInventory.findOne();
    if (!inventory) {
      inventory = await HenInventory.create({ totalHenCount: 0, history: [] });
    }

    const latestProduction = await DailyProduction.find().sort({ date: -1 }).limit(5);
    const latestExpenses = await Expenses.find().sort({ date: -1 }).limit(5);
    const latestRevenues = await Revenue.find().sort({ date: -1 }).limit(5);

    const latestHenLogs = [...inventory.history]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({ totalHens: inventory.totalHenCount, latestProduction, latestExpenses, latestRevenues, latestHenLogs });
  } catch (error) {
    console.error('Error in getFarmSummary:', error);
    res.status(500).json({ message: 'Error fetching farm summary', error: error.message });
  }
};

// @desc    Add Hen Log
// @route   POST /api/farm/hens
// @access  Private/Manager
const addHenLog = async (req, res) => {
  try {
    const { type, quantityChange, reason } = req.body;
    let inventory = await HenInventory.findOne();
    if (!inventory) inventory = await HenInventory.create({ totalHenCount: 0, history: [] });

    if (type === 'removal') {
      if (quantityChange > inventory.totalHenCount)
        return res.status(400).json({ message: 'Cannot remove more hens than currently exist.' });
      inventory.totalHenCount -= quantityChange;
    } else if (type === 'addition') {
      inventory.totalHenCount += quantityChange;
    }

    inventory.history.push({ quantityChange, type, reason: type === 'removal' ? reason : null, date: new Date() });
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: 'Error adding hen log' });
  }
};

// @desc    Add Daily Production
// @route   POST /api/farm/production
// @access  Private/Manager
const addProduction = async (req, res) => {
  try {
    const { totalEggsCollected, date } = req.body;
    const prod = await DailyProduction.create({ totalEggsCollected, date: date || new Date() });
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
    const { amount, category, details, date } = req.body;
    const expense = await Expenses.create({ amount, category, details, date: date || new Date() });
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
    const { amount, sourceDescription, date } = req.body;
    const revenue = await Revenue.create({ amount, sourceDescription, date: date || new Date() });
    res.status(201).json(revenue);
  } catch (error) {
    res.status(500).json({ message: 'Error adding revenue' });
  }
};

// @desc    Get Farm Analytics (grouped by period)
// @route   GET /api/farm/analytics?period=daily|weekly|monthly|yearly
// @access  Private/Manager
const getFarmAnalytics = async (req, res) => {
  try {
    const { period = 'daily' } = req.query;
    const Worker = require('../models/Worker');

    const now = new Date();
    let startDate = new Date();
    if (period === 'daily')   startDate.setDate(now.getDate() - 30);
    if (period === 'weekly')  startDate.setDate(now.getDate() - 84);
    if (period === 'monthly') startDate.setMonth(now.getMonth() - 12);
    if (period === 'yearly')  startDate.setFullYear(now.getFullYear() - 5);

    const dateQuery = { $gte: startDate };

    const [production, expenses, revenues, inventory] = await Promise.all([
      DailyProduction.find({ date: dateQuery }).sort({ date: 1 }),
      Expenses.find({ date: dateQuery }).sort({ date: 1 }),
      Revenue.find({ date: dateQuery }).sort({ date: 1 }),
      HenInventory.findOne(),
    ]);

    const getKey = (dateObj) => {
      const d = new Date(dateObj);
      if (period === 'daily')   return d.toISOString().slice(0, 10);
      if (period === 'weekly') {
        const startOfYear = new Date(d.getFullYear(), 0, 1);
        const week = Math.ceil(((d - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7);
        return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
      }
      if (period === 'monthly') return d.toISOString().slice(0, 7);
      return String(d.getFullYear());
    };

    const groups = {};
    const ensure = (key) => {
      if (!groups[key]) groups[key] = { period: key, eggs: 0, revenue: 0, expenses: 0, profit: 0, henChanges: 0 };
    };

    production.forEach(p => { const k = getKey(p.date); ensure(k); groups[k].eggs += p.totalEggsCollected; });
    revenues.forEach(r   => { const k = getKey(r.date); ensure(k); groups[k].revenue += r.amount; });
    expenses.forEach(e   => { const k = getKey(e.date); ensure(k); groups[k].expenses += e.amount; });
    Object.values(groups).forEach(g => { g.profit = g.revenue - g.expenses; });

    (inventory?.history || [])
      .filter(h => new Date(h.date) >= startDate)
      .forEach(h => {
        const k = getKey(h.date); ensure(k);
        groups[k].henChanges += h.type === 'addition' ? h.quantityChange : -h.quantityChange;
      });

    const chartData = Object.values(groups).sort((a, b) => a.period.localeCompare(b.period));

    const expenseByCategory = {};
    expenses.forEach(e => { expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount; });
    const expenseBreakdown = Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));

    const totalEggs = production.reduce((s, p) => s + p.totalEggsCollected, 0);
    const totalRev  = revenues.reduce((s, r) => s + r.amount, 0);
    const totalExp  = expenses.reduce((s, e) => s + e.amount, 0);
    const [totalWorkers, activeWorkers] = await Promise.all([
      Worker.countDocuments({}),
      Worker.countDocuments({ status: 'Active' }),
    ]);

    res.json({
      period, chartData, expenseBreakdown,
      kpis: {
        totalEggs, totalRevenue: totalRev, totalExpenses: totalExp,
        netProfit: totalRev - totalExp,
        currentHens: inventory?.totalHenCount || 0,
        totalWorkers, activeWorkers,
        avgEggs: chartData.length ? Math.round(totalEggs / chartData.length) : 0,
      },
    });
  } catch (error) {
    console.error('Farm analytics error:', error);
    res.status(500).json({ message: 'Error computing farm analytics' });
  }
};

module.exports = { getFarmSummary, addHenLog, addProduction, addExpense, addRevenue, getFarmAnalytics };
