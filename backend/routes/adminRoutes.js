const express = require('express');
const router = express.Router();
const { getAnalytics, getAllOrders, updateProduct, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/analytics').get(protect, admin, getAnalytics);
router.route('/orders').get(protect, admin, getAllOrders);
router.route('/products/:id').put(protect, admin, updateProduct);
router.route('/users').get(protect, admin, getAllUsers);

module.exports = router;
