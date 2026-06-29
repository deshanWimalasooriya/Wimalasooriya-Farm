const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  label:      { type: String, default: 'Home' },
  street:     { type: String, required: true },
  city:       { type: String, required: true },
  postalCode: { type: String, required: true },
  phone:      { type: String },
  isDefault:  { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  isManager: {
    type: Boolean,
    required: true,
    default: false,
  },
  avatarUrl:   { type: String, default: '' },
  companyName: { type: String, default: '' },
  phone:       { type: String, default: '' },
  addressBook: [addressSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
