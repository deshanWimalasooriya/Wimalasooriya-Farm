const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ── Helper ───────────────────────────────────────────────────────────────────
const generateToken = (id, isAdmin, isManager) =>
  jwt.sign({ id, isAdmin, isManager }, process.env.JWT_SECRET, { expiresIn: '30d' });

const safeUser = (user) => ({
  _id:         user._id,
  name:        user.name,
  email:       user.email,
  isAdmin:     user.isAdmin,
  isManager:   user.isManager,
  avatarUrl:   user.avatarUrl,
  companyName: user.companyName,
  phone:       user.phone,
  addressBook: user.addressBook,
  createdAt:   user.createdAt,
});

// ── Auth ─────────────────────────────────────────────────────────────────────

// @route  POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Please add all fields' });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists' });

    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user           = await User.create({ name, email, password: hashedPassword });

    if (user) {
      res.status(201).json({
        ...safeUser(user),
        token: generateToken(user._id, user.isAdmin, user.isManager),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        ...safeUser(user),
        token: generateToken(user._id, user.isAdmin, user.isManager),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(safeUser(user));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Profile CRUD ─────────────────────────────────────────────────────────────

// @route  PUT /api/auth/profile  — update name / companyName / phone
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, companyName, phone } = req.body;
    user.name        = name        ?? user.name;
    user.companyName = companyName ?? user.companyName;
    user.phone       = phone       ?? user.phone;

    const updated = await user.save();
    res.json(safeUser(updated));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/auth/password  — change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });

    const salt       = await bcrypt.genSalt(10);
    user.password    = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/auth/avatar  — upload avatar via Cloudinary (multer middleware provides req.file)
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.avatarUrl = req.file.path; // Cloudinary secure URL
    const updated  = await user.save();

    res.json({ avatarUrl: updated.avatarUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ── Address Book CRUD ─────────────────────────────────────────────────────────

// @route  GET /api/auth/addresses
const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addressBook');
    res.json(user.addressBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/auth/addresses
const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { label, street, city, postalCode, phone, isDefault } = req.body;

    // If new address is default, unset others
    if (isDefault) user.addressBook.forEach(a => { a.isDefault = false; });

    user.addressBook.push({ label, street, city, postalCode, phone, isDefault });
    await user.save();
    res.status(201).json(user.addressBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/auth/addresses/:id
const updateAddress = async (req, res) => {
  try {
    const user    = await User.findById(req.user.id);
    const address = user.addressBook.id(req.params.id);
    if (!address) return res.status(404).json({ message: 'Address not found' });

    const { label, street, city, postalCode, phone, isDefault } = req.body;

    if (isDefault) user.addressBook.forEach(a => { a.isDefault = false; });

    address.label      = label      ?? address.label;
    address.street     = street     ?? address.street;
    address.city       = city       ?? address.city;
    address.postalCode = postalCode ?? address.postalCode;
    address.phone      = phone      ?? address.phone;
    address.isDefault  = isDefault  ?? address.isDefault;

    await user.save();
    res.json(user.addressBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/auth/addresses/:id
const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.addressBook = user.addressBook.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addressBook);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
};
