const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  position: {
    type: String,
    enum: ['Feeder', 'Collector', 'Driver', 'Supervisor', 'Other'],
    required: true,
  },
  nationalId: {
    type: String,
    required: true,
    unique: true,
  },
  photoUrl: {
    type: String,
    // Using Base64 strings for now as requested
    required: false,
  },
  workerId: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Active', 'Disabled', 'Removed'],
    default: 'Active',
  },
}, {
  timestamps: true,
});

const Worker = mongoose.model('Worker', workerSchema);

module.exports = Worker;
