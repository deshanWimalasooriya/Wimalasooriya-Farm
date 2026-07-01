const express = require('express');
const router = express.Router();
const { getAnalytics, getAdvancedAnalytics, getAllOrders, updateProduct, getAllUsers, getUserById, updateUser, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/analytics').get(protect, admin, getAnalytics);
router.route('/advanced-analytics').get(protect, admin, getAdvancedAnalytics);
router.route('/orders').get(protect, admin, getAllOrders);
router.route('/products/:id').put(protect, admin, updateProduct);
router.route('/users').get(protect, admin, getAllUsers);
router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
