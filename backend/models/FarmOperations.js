const mongoose = require('mongoose');

const henLogSchema = new mongoose.Schema({
  type: { type: String, enum: ['Add', 'Remove'], required: true },
  quantity: { type: Number, required: true },
  reason: { type: String, enum: ['Death', 'Sell', null], default: null },
  date: { type: Date, default: Date.now }
});

const dailyProductionSchema = new mongoose.Schema({
  eggsCollected: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Water Bill', 'Light/Electricity Bill', 'Transport', 'Hen Food', 'Maintenance', 'Other'],
    required: true 
  },
  reason: { type: String },
  date: { type: Date, default: Date.now }
});

const revenueSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  source: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const HenLog = mongoose.model('HenLog', henLogSchema);
const DailyProduction = mongoose.model('DailyProduction', dailyProductionSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = { HenLog, DailyProduction, Expense, Revenue };
