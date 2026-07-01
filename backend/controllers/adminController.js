const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { HenInventory, DailyProduction, Expenses, Revenue } = require('../models/FarmOperations');

// @desc    Get aggregate analytics for dashboard
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const activeOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Quote_Requested').length;
    const totalUsers = await User.countDocuments({});

    // Group orders by date for chart
    const ordersByDate = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, revenue: 0, orders: 0 };
      }
      acc[date].revenue += order.totalPrice;
      acc[date].orders += 1;
      return acc;
    }, {});

    const chartData = Object.values(ordersByDate).sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json({
      totalRevenue,
      activeOrders,
      totalUsers,
      totalOrders: orders.length,
      chartData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Advanced Analytics
// @route   GET /api/admin/advanced-analytics
// @access  Private/Admin
const getAdvancedAnalytics = async (req, res) => {
  try {
    const { filter } = req.query; // '7days', 'thisMonth', 'thisYear'
    let startDate = new Date();
    
    if (filter === '7days') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (filter === 'thisMonth') {
      startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    } else if (filter === 'thisYear') {
      startDate = new Date(startDate.getFullYear(), 0, 1);
    } else {
      // default 30 days
      startDate.setDate(startDate.getDate() - 30);
    }

    const dateQuery = { $gte: startDate };
    const orderDateQuery = { createdAt: { $gte: startDate } };
    
    const orders = await Order.find(orderDateQuery);
    const offlineRevenues = await Revenue.find({ date: dateQuery });
    const expenses = await Expenses.find({ date: dateQuery });
    const production = await DailyProduction.find({ date: dateQuery }).sort({ date: 1 });
    
    const inventory = await HenInventory.findOne();
    const currentHenCount = inventory ? inventory.totalHenCount : 0;
    
    const totalShopSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOfflineSales = offlineRevenues.reduce((acc, rev) => acc + rev.amount, 0);
    const totalRevenue = totalShopSales + totalOfflineSales;
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const netProfit = totalRevenue - totalExpenses;
    const totalEggs = production.reduce((acc, prod) => acc + prod.totalEggsCollected, 0);
    
    const timeGroupMap = {};
    const addToGroup = (dateObj, key, amount) => {
      let dateKey = filter === 'thisYear' 
        ? dateObj.toISOString().substring(0, 7) 
        : dateObj.toISOString().substring(0, 10);
      
      if (!timeGroupMap[dateKey]) {
        timeGroupMap[dateKey] = { date: dateKey, shopSales: 0, offlineSales: 0, expenses: 0, eggs: 0 };
      }
      timeGroupMap[dateKey][key] += amount;
    };
    
    orders.forEach(o => addToGroup(o.createdAt, 'shopSales', o.totalPrice));
    offlineRevenues.forEach(r => addToGroup(r.date, 'offlineSales', r.amount));
    expenses.forEach(e => addToGroup(e.date, 'expenses', e.amount));
    production.forEach(p => addToGroup(p.date, 'eggs', p.totalEggsCollected));
    
    const revenueExpensesChart = Object.values(timeGroupMap).sort((a,b) => a.date.localeCompare(b.date));
    
    const productionChart = revenueExpensesChart.map(item => ({
       date: item.date,
       eggs: item.eggs,
       liveHens: currentHenCount
    }));
    
    const daysCount = Object.keys(timeGroupMap).length || 1;
    const avgDailyEggs = totalEggs / daysCount;
    const layingRate = currentHenCount > 0 ? ((avgDailyEggs / currentHenCount) * 100).toFixed(1) : 0;
    
    const expenseGroups = {};
    expenses.forEach(e => {
      const cat = e.category || 'Other';
      expenseGroups[cat] = (expenseGroups[cat] || 0) + e.amount;
    });
    const expenseChart = Object.keys(expenseGroups).map(key => ({
      name: key,
      value: expenseGroups[key]
    }));
    
    res.json({
      kpis: { totalRevenue, totalExpenses, netProfit, totalEggs, currentHenCount, layingRate },
      revenueExpensesChart,
      productionChart,
      expenseChart
    });
  } catch (error) {
    console.error('Advanced Analytics Error:', error);
    res.status(500).json({ message: 'Server error computing analytics' });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a product (price/discount)
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { price, discountPercentage } = req.body;
    
    const product = await Product.findById(req.params.id);
    if (product) {
      product.price = price !== undefined ? price : product.price;
      product.discountPercentage = discountPercentage !== undefined ? discountPercentage : product.discountPercentage;
      
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all users for CMS
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// @desc    Update user details & roles
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      
      // We explicitly check for undefined so we can set it to false if needed
      if (req.body.isAdmin !== undefined) {
        user.isAdmin = req.body.isAdmin;
      }
      if (req.body.isManager !== undefined) {
        user.isManager = req.body.isManager;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isManager: updatedUser.isManager
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error updating user' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: 'Cannot delete an admin user' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

module.exports = {
  getAnalytics,
  getAdvancedAnalytics,
  getAllOrders,
  updateProduct,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
