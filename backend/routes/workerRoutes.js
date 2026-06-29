const express = require('express');
const router = express.Router();
const { getWorkers, createWorker, updateWorker, deleteWorker } = require('../controllers/workerController');
const { protect, adminOrManager } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, adminOrManager, getWorkers)
  .post(protect, adminOrManager, createWorker);

router.route('/:id')
  .put(protect, adminOrManager, updateWorker)
  .delete(protect, adminOrManager, deleteWorker);

module.exports = router;
