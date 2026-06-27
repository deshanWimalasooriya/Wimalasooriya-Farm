const express = require('express');
const router = express.Router();
const { getAnalytics, getAdvancedAnalytics, getAllOrders, updateProduct, getAllUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/analytics').get(protect, admin, getAnalytics);
router.route('/advanced-analytics').get(protect, admin, getAdvancedAnalytics);
router.route('/orders').get(protect, admin, getAllOrders);
router.route('/products/:id').put(protect, admin, updateProduct);
router.route('/users').get(protect, admin, getAllUsers);

module.exports = router;
