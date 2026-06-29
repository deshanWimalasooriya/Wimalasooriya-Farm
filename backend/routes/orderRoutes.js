const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, createBulkOrder, getAllBulkOrders, updateBulkOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// Standard order routes
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);

// Bulk order routes
// Note: We'll use a custom middleware combination or just unprotected for createBulkOrder if guests are allowed
// For this plan, we can leave create bulk order public, but optionally use a soft protect if we want user id
// Since we don't have a soft-protect, we can just allow public POST and let req.user be undefined if guest,
// BUT if we want to extract req.user, we need the protect middleware. 
// A better way is to create a custom protect logic or just let the route be open, and inside we can check headers.
// We'll write a simple middleware here or just skip passing req.user for guests.
// Wait, the standard `protect` middleware blocks if no token. Let's just make it public.
router.route('/bulk').post(createBulkOrder);
router.route('/bulk').get(protect, admin, getAllBulkOrders); // Note: Assuming 'admin' middleware exists
router.route('/bulk/:id/status').put(protect, admin, updateBulkOrderStatus);

module.exports = router;
