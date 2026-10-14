const express = require('express');
const router = express.Router();
const { calculateRoute } = require('../controllers/routeController');

// POST /api/routes - calculate shortest path
router.post('/', calculateRoute);

module.exports = router;
