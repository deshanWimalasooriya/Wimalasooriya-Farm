const Message = require('../models/Message');

// @desc    Get chat history for a user
// @route   GET /api/chat/:userId
// @access  Private
const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.params.userId },
        { receiver: req.params.userId }
      ]
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching chat history' });
  }
};

// @desc    Save a new message
// @route   POST /api/chat
// @access  Private
const saveMessage = async (req, res) => {
  try {
    const { sender, receiver, content, isAdminMessage } = req.body;
    
    const newMessage = await Message.create({
      sender,
      receiver,
      content,
      isAdminMessage
    });
    
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error saving message' });
  }
};

module.exports = {
  getChatHistory,
  saveMessage
};
