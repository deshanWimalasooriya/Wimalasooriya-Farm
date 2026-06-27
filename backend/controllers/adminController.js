const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

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

module.exports = {
  getAnalytics,
  getAllOrders,
  updateProduct,
  getAllUsers
};
