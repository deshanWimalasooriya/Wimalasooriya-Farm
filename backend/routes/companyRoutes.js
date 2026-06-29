const express = require('express');
const router = express.Router();
const { getCompanySettings, updateCompanySettings } = require('../controllers/companyController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public — footer and public pages can fetch this
router.route('/').get(getCompanySettings);

// Admin only — update settings
router.route('/').put(protect, admin, updateCompanySettings);

module.exports = router;
