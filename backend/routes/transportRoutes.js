const express = require('express');
const router = express.Router();
const { getVehicles, createVehicle, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, adminOrManager } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, adminOrManager, getVehicles)
  .post(protect, adminOrManager, createVehicle);

router.route('/:id')
  .put(protect, adminOrManager, updateVehicle)
  .delete(protect, adminOrManager, deleteVehicle);

module.exports = router;
