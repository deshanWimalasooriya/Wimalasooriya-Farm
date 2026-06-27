const Vehicle = require('../models/Vehicle');

// @desc    Get all vehicles
// @route   GET /api/admin/transport
// @access  Private/AdminOrManager
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching vehicles' });
  }
};

// @desc    Create a vehicle
// @route   POST /api/admin/transport
// @access  Private/AdminOrManager
const createVehicle = async (req, res) => {
  try {
    const { registrationNumber, type, make, model, year, assignedDriver, insuranceExpiry, lastServiceDate, photoUrl, status, notes } = req.body;

    const vehicleExists = await Vehicle.findOne({ registrationNumber: registrationNumber.toUpperCase() });
    if (vehicleExists) {
      return res.status(400).json({ message: 'Vehicle with this registration number already exists' });
    }

    // Generate vehicle ID (WF-VEH-XXX)
    const count = await Vehicle.countDocuments();
    const nextIdNumber = (count + 1).toString().padStart(3, '0');
    const vehicleId = `WF-VEH-${nextIdNumber}`;

    const vehicle = await Vehicle.create({
      vehicleId,
      registrationNumber: registrationNumber.toUpperCase(),
      type,
      make,
      model,
      year: Number(year),
      assignedDriver,
      insuranceExpiry: insuranceExpiry || null,
      lastServiceDate: lastServiceDate || null,
      photoUrl,
      status: status || 'Active',
      notes,
    });

    res.status(201).json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating vehicle' });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/admin/transport/:id
// @access  Private/AdminOrManager
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const { registrationNumber, type, make, model, year, assignedDriver, insuranceExpiry, lastServiceDate, photoUrl, status, notes } = req.body;

    vehicle.registrationNumber = registrationNumber ? registrationNumber.toUpperCase() : vehicle.registrationNumber;
    vehicle.type = type || vehicle.type;
    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year ? Number(year) : vehicle.year;
    vehicle.assignedDriver = assignedDriver !== undefined ? assignedDriver : vehicle.assignedDriver;
    vehicle.insuranceExpiry = insuranceExpiry !== undefined ? (insuranceExpiry || null) : vehicle.insuranceExpiry;
    vehicle.lastServiceDate = lastServiceDate !== undefined ? (lastServiceDate || null) : vehicle.lastServiceDate;
    vehicle.photoUrl = photoUrl !== undefined ? photoUrl : vehicle.photoUrl;
    vehicle.status = status || vehicle.status;
    vehicle.notes = notes !== undefined ? notes : vehicle.notes;

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating vehicle' });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/admin/transport/:id
// @access  Private/AdminOrManager
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    await Vehicle.deleteOne({ _id: vehicle._id });
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting vehicle' });
  }
};

module.exports = { getVehicles, createVehicle, updateVehicle, deleteVehicle };
