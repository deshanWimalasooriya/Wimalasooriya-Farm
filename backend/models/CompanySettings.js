const mongoose = require('mongoose');

const companySettingsSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Wimalasooriya Farms' },
    logoUrl: { type: String, default: '/logo.png' },
    email: { type: String, default: 'hello@wimalasooriyafarm.com' },
    phone: { type: String, default: '+1 (555) 123-4567' },
    address: { type: String, default: '123 Snowy Mountain Road, Frost Valley, FV 10020' },
    businessRegNumber: { type: String, default: '' },
    startDate: { type: String, default: '' },
  },
  { timestamps: true }
);

// Singleton — only one document ever exists
const CompanySettings = mongoose.model('CompanySettings', companySettingsSchema);

module.exports = CompanySettings;
