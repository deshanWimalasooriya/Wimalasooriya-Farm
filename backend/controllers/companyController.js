const CompanySettings = require('../models/CompanySettings');

// @desc  GET company settings (public)
// @route GET /api/company
const getCompanySettings = async (req, res) => {
  try {
    let settings = await CompanySettings.findOne();
    if (!settings) {
      // Auto-create defaults on first request
      settings = await CompanySettings.create({});
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch company settings' });
  }
};

// @desc  UPDATE company settings (admin only)
// @route PUT /api/company
const updateCompanySettings = async (req, res) => {
  try {
    const { name, logoUrl, email, phone, address, businessRegNumber, startDate } = req.body;

    let settings = await CompanySettings.findOne();
    if (!settings) {
      settings = new CompanySettings({});
    }

    if (name !== undefined)              settings.name = name;
    if (logoUrl !== undefined)           settings.logoUrl = logoUrl;
    if (email !== undefined)             settings.email = email;
    if (phone !== undefined)             settings.phone = phone;
    if (address !== undefined)           settings.address = address;
    if (businessRegNumber !== undefined) settings.businessRegNumber = businessRegNumber;
    if (startDate !== undefined)         settings.startDate = startDate;

    await settings.save();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update company settings' });
  }
};

module.exports = { getCompanySettings, updateCompanySettings };
