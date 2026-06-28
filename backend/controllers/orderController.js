const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create new order (retail)
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  const { orderItems, totalPrice, orderType } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    try {
      const order = new Order({
        orderItems,
        user: req.user._id,
        totalPrice,
        orderType,
        status: orderType === 'Bulk' ? 'Quote_Requested' : 'Pending'
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new bulk order (guest or user)
// @route   POST /api/orders/bulk
// @access  Public
const createBulkOrder = async (req, res) => {
  const { companyName, email, phone, quantity, userNotes } = req.body;

  try {
    const order = new Order({
      orderType: 'Bulk',
      status: 'Pending',
      companyName,
      email,
      phone,
      quantity,
      userNotes,
      user: req.user ? req.user._id : undefined, // Optional if guest
      orderItems: [], // Can be empty for generic bulk request
      totalPrice: 0
    });

    const createdOrder = await order.save();

    // Create notifications for admins and managers
    const admins = await User.find({ $or: [{ isAdmin: true }, { isManager: true }] });
    const notifications = admins.map(admin => ({
      user: admin._id,
      type: 'NEW_ORDER',
      message: `New bulk order request from ${companyName} for ${quantity} items.`,
      orderId: createdOrder._id
    }));
    if(notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all bulk orders
// @route   GET /api/orders/bulk
// @access  Private/Admin
const getAllBulkOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderType: 'Bulk' })
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update bulk order status (Approve/Reject)
// @route   PUT /api/orders/bulk/:id/status
// @access  Private/Admin
const updateBulkOrderStatus = async (req, res) => {
  const { status, adminMessage } = req.body;
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      if (adminMessage) {
        order.adminMessage = adminMessage;
      }
      const updatedOrder = await order.save();

      // Send notification to user if order is linked to a user account
      if (order.user) {
        const type = status === 'Approved' ? 'ORDER_APPROVED' : 'ORDER_MESSAGE';
        const message = status === 'Approved' 
          ? `Your bulk order #${order._id.toString().substring(0, 6)} has been approved!`
          : `Update on your bulk order: ${adminMessage}`;

        await Notification.create({
          user: order.user,
          type,
          message,
          orderId: order._id
        });
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addOrderItems, getMyOrders, createBulkOrder, getAllBulkOrders, updateBulkOrderStatus };
