const ContactMessage = require('../models/ContactMessage');

// ── POST /api/contact  (Public) ───────────────────────────────────────────────
// Saves a new message submitted from the public Contact Us form.
const submitMessage = async (req, res) => {
  try {
    const { firstName, lastName, email, subject, message } = req.body;

    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newMessage = await ContactMessage.create({
      firstName,
      lastName,
      email,
      subject,
      message,
    });

    res.status(201).json({
      message: 'Your message has been received. We will get back to you shortly.',
      data: newMessage,
    });
  } catch (error) {
    console.error('submitMessage error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

// ── GET /api/contact  (Admin Protected) ───────────────────────────────────────
// Returns all contact messages, newest first.
const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('getMessages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};

// ── PUT /api/contact/:id/status  (Admin Protected) ────────────────────────────
// Updates the status of a specific contact message.
const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Unread', 'Read', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updated = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Message not found.' });
    }

    res.json(updated);
  } catch (error) {
    console.error('updateMessageStatus error:', error);
    res.status(500).json({ message: 'Failed to update message status.' });
  }
};

module.exports = { submitMessage, getMessages, updateMessageStatus };
