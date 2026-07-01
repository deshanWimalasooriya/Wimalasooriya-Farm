const express = require('express');
const router = express.Router();
const {
  submitMessage,
  getMessages,
  updateMessageStatus,
} = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route — anyone can submit a contact form message
router.post('/', submitMessage);

// Admin-protected routes
router.get('/', protect, admin, getMessages);
router.put('/:id/status', protect, admin, updateMessageStatus);

module.exports = router;
