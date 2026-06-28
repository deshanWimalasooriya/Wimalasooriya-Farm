const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Optional for guest bulk orders
      ref: 'User',
    },
    orderItems: [
      {
        name: { type: String, required: false }, // Optional for bulk
        qty: { type: Number, required: true },
        image: { type: String, required: false }, // Optional for bulk
        price: { type: Number, required: false }, // Optional for bulk
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: false, // Optional for bulk
          ref: 'Product',
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      default: 'Pending', // Pending, Approved, Rejected, Processing, Shipped, Delivered, Quote_Requested
    },
    orderType: {
      type: String,
      required: true,
      default: 'Retail', // Retail, Bulk
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    quantity: {
      type: Number,
    },
    adminMessage: {
      type: String, // Reason for rejection or custom message from admin
    },
    userNotes: {
      type: String, // Special instructions or notes from the user
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
