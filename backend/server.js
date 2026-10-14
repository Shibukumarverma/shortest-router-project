const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const locationRoutes = require('./routes/locationRoutes');
const routeRoutes = require('./routes/routeRoutes');
const { addAdminLocation } = require('./controllers/locationController');
const { protectAdmin, notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*', // Allow all during development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-key']
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Optional MongoDB Connection
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri || mongoUri.trim() === '') {
    console.log('ℹ️  No MONGO_URI specified. Running seamlessly with in-memory campus seed data.');
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('🍃 MongoDB connected successfully.');
  } catch (err) {
    console.warn('⚠️  MongoDB connection failed, falling back to local campus seed data:', err.message);
  }
};

connectDB();

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Campus Navigator API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    mongoConnected: mongoose.connection.readyState === 1,
    algorithm: 'Dijkstra',
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// API Routes
app.use('/api/locations', locationRoutes);
app.use('/api/routes', routeRoutes);

// Direct requirement: POST /api/admin/locations
app.post('/api/admin/locations', protectAdmin, addAdminLocation);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Campus Navigator API',
    endpoints: {
      health: 'GET /api/health',
      locations: 'GET /api/locations',
      graph: 'GET /api/locations/graph/all',
      routes: 'POST /api/routes',
      adminAddLocation: 'POST /api/admin/locations'
    }
  });
});

// 404 & Global Error Handling
app.use(notFound);
app.use(errorHandler);

// Start Server
const server = app.listen(PORT, () => {
  console.log(`🚀 Campus Navigator API server listening on http://localhost:${PORT}`);
  console.log(`📍 Test Health: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test Locations: http://localhost:${PORT}/api/locations`);
});

module.exports = app;
