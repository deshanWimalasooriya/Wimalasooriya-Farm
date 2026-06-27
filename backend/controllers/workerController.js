const Worker = require('../models/Worker');

// @desc    Get all workers
// @route   GET /api/admin/workers
// @access  Private/Admin
const getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find({}).sort({ createdAt: -1 });
    res.json(workers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching workers' });
  }
};

// @desc    Create a worker
// @route   POST /api/admin/workers
// @access  Private/Admin
const createWorker = async (req, res) => {
  try {
    const { name, age, position, nationalId, photoUrl, status } = req.body;

    const workerExists = await Worker.findOne({ nationalId });
    if (workerExists) {
      return res.status(400).json({ message: 'Worker with this National ID already exists' });
    }

    // Generate worker ID (WF-EMP-XXX)
    const count = await Worker.countDocuments();
    const nextIdNumber = (count + 1).toString().padStart(3, '0');
    const workerId = `WF-EMP-${nextIdNumber}`;

    const worker = await Worker.create({
      name,
      age,
      position,
      nationalId,
      photoUrl,
      workerId,
      status: status || 'Active',
    });

    res.status(201).json(worker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating worker' });
  }
};

// @desc    Update a worker
// @route   PUT /api/admin/workers/:id
// @access  Private/Admin
const updateWorker = async (req, res) => {
  try {
    const { name, age, position, nationalId, photoUrl, status } = req.body;

    const worker = await Worker.findById(req.params.id);

    if (worker) {
      worker.name = name || worker.name;
      worker.age = age || worker.age;
      worker.position = position || worker.position;
      worker.nationalId = nationalId || worker.nationalId;
      worker.photoUrl = photoUrl || worker.photoUrl;
      worker.status = status || worker.status;

      const updatedWorker = await worker.save();
      res.json(updatedWorker);
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating worker' });
  }
};

// @desc    Delete a worker
// @route   DELETE /api/admin/workers/:id
// @access  Private/Admin
const deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id);

    if (worker) {
      await Worker.deleteOne({ _id: worker._id });
      res.json({ message: 'Worker removed' });
    } else {
      res.status(404).json({ message: 'Worker not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting worker' });
  }
};

module.exports = {
  getWorkers,
  createWorker,
  updateWorker,
  deleteWorker,
};
