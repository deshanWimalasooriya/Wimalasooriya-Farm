const express = require('express');
const router = express.Router();
const { getChatHistory, saveMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:userId').get(protect, getChatHistory);
router.route('/').post(protect, saveMessage);

module.exports = router;
