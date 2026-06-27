const express = require('express');
const router  = express.Router();
const {
  registerUser, loginUser, getProfile,
  updateProfile, changePassword, uploadAvatar,
  getAddresses, addAddress, updateAddress, deleteAddress,
} = require('../controllers/authController');
const { protect }  = require('../middleware/authMiddleware');
const upload       = require('../middleware/uploadMiddleware');

// ── Public ────────────────────────────────────────────────────────────────────
router.post('/register', registerUser);
router.post('/login',    loginUser);

// ── Protected ─────────────────────────────────────────────────────────────────
router.get('/profile',  protect, getProfile);
router.put('/profile',  protect, updateProfile);
router.put('/password', protect, changePassword);

// Avatar — multer processes the multipart upload, then handler saves Cloudinary URL
router.post('/avatar', protect, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      return res.status(500).json({
        message: 'Multer error',
        errorName: err.name,
        errorMessage: err.message,
        errorRaw: String(err)
      });
    }
    next();
  });
}, uploadAvatar);

// Address book CRUD
router.route('/addresses')
  .get(protect, getAddresses)
  .post(protect, addAddress);

router.route('/addresses/:id')
  .put(protect, updateAddress)
  .delete(protect, deleteAddress);

module.exports = router;
