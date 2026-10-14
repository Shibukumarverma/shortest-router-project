const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocationById,
  getCampusGraph,
  addAdminLocation
} = require('../controllers/locationController');
const { protectAdmin } = require('../middleware/errorMiddleware');

// Public endpoints
router.get('/', getLocations);
router.get('/graph/all', getCampusGraph);
router.get('/:id', getLocationById);

// Protected admin endpoint
router.post('/admin/create', protectAdmin, addAdminLocation);

module.exports = router;
