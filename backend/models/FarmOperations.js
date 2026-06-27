const mongoose = require('mongoose');

const henInventorySchema = new mongoose.Schema({
  totalHenCount: { type: Number, default: 0, required: true },
  history: [{
    date: { type: Date, default: Date.now },
    quantityChange: { type: Number, required: true },
    type: { type: String, enum: ['addition', 'removal'], required: true },
    reason: { type: String, enum: ['Death', 'Sell'], default: null }
  }]
});

const dailyProductionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  totalEggsCollected: { type: Number, required: true }
});

const expenseSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    enum: ['Water Bill', 'Light/Electricity Bill', 'Transport', 'Hen Food', 'Maintenance', 'Other'],
    required: true 
  },
  details: { type: String, required: true }
});

const revenueSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true },
  sourceDescription: { type: String, required: true }
});

const HenInventory = mongoose.model('HenInventory', henInventorySchema);
const DailyProduction = mongoose.model('DailyProduction', dailyProductionSchema);
const Expenses = mongoose.model('Expenses', expenseSchema);
const Revenue = mongoose.model('Revenue', revenueSchema);

module.exports = { HenInventory, DailyProduction, Expenses, Revenue };
