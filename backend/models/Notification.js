const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // The recipient of the notification
    },
    type: {
      type: String,
      required: true,
      enum: ['NEW_ORDER', 'ORDER_APPROVED', 'ORDER_MESSAGE', 'GENERAL'],
      default: 'GENERAL',
    },
    message: {
      type: String,
      required: true, // The actual notification text
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order', // Optional link back to the specific order
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
