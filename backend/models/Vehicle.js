const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ['Delivery Van', 'Pickup Truck', 'Lorry', 'Motorbike', 'Tractor', 'Other'],
    required: true,
  },
  make: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
  assignedDriver: {
    type: String,
    required: false,
    trim: true,
  },
  insuranceExpiry: {
    type: Date,
    required: false,
  },
  lastServiceDate: {
    type: Date,
    required: false,
  },
  photoUrl: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ['Active', 'Under Maintenance', 'Retired'],
    default: 'Active',
  },
  notes: {
    type: String,
    required: false,
    trim: true,
  },
}, {
  timestamps: true,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
module.exports = Vehicle;
