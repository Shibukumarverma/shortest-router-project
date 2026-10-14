const { locations: seedLocations, paths: seedPaths } = require('../data/campusData');
const Location = require('../models/Location');
const mongoose = require('mongoose');

// In-memory working copy if MongoDB is not connected
let memoryLocations = JSON.parse(JSON.stringify(seedLocations));
let memoryPaths = JSON.parse(JSON.stringify(seedPaths));

/**
 * Checks if MongoDB is currently connected
 */
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get all campus locations
 * @route GET /api/locations
 * @query includeJunctions (boolean, default false for UI search dropdowns)
 * @query category (optional filter)
 * @query search (optional name search)
 */
const getLocations = async (req, res, next) => {
  try {
    const { includeJunctions, category, search } = req.query;
    const shouldIncludeJunctions = includeJunctions === 'true';

    let list = [];

    if (isMongoConnected()) {
      const filter = {};
      if (!shouldIncludeJunctions) {
        filter.isJunction = { $ne: true };
      }
      if (category) {
        filter.category = category;
      }
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { shortName: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } }
        ];
      }
      list = await Location.find(filter).lean();
    } else {
      list = memoryLocations.filter((loc) => {
        if (!shouldIncludeJunctions && loc.isJunction) return false;
        if (category && loc.category !== category) return false;
        if (search) {
          const s = search.toLowerCase();
          const matchesName = loc.name.toLowerCase().includes(s);
          const matchesShort = loc.shortName && loc.shortName.toLowerCase().includes(s);
          const matchesTags = loc.tags && loc.tags.some((t) => t.toLowerCase().includes(s));
          if (!matchesName && !matchesShort && !matchesTags) return false;
        }
        return true;
      });
    }

    res.json({
      success: true,
      count: list.length,
      dataSource: isMongoConnected() ? 'MongoDB' : 'SeedData',
      locations: list
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get location by ID with connected paths
 * @route GET /api/locations/:id
 */
const getLocationById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let location = null;

    if (isMongoConnected()) {
      location = await Location.findOne({ id }).lean();
    } else {
      location = memoryLocations.find((loc) => loc.id === id);
    }

    if (!location) {
      return res.status(404).json({
        success: false,
        message: `Location with ID '${id}' not found.`
      });
    }

    // Find connected paths
    const connectedPaths = memoryPaths.filter((p) => p.from === id || p.to === id);

    res.json({
      success: true,
      location,
      connectedPathsCount: connectedPaths.length,
      connectedPaths
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get full graph data (all locations, junctions, and paths for map rendering)
 * @route GET /api/locations/graph/all
 */
const getCampusGraph = async (req, res, next) => {
  try {
    res.json({
      success: true,
      dataSource: isMongoConnected() ? 'MongoDB' : 'SeedData',
      locations: memoryLocations,
      paths: memoryPaths,
      stats: {
        totalLocations: memoryLocations.filter((l) => !l.isJunction).length,
        totalJunctions: memoryLocations.filter((l) => l.isJunction).length,
        totalPaths: memoryPaths.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add or update a campus location (Protected Admin endpoint)
 * @route POST /api/admin/locations
 */
const addAdminLocation = async (req, res, next) => {
  try {
    const { id, name, shortName, category, code, description, coordinates, accessible, openingHours, features } = req.body;

    if (!id || !name || !category || !coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: id, name, category, and coordinates [lat, lng] are required.'
      });
    }

    const newLocation = {
      id,
      name,
      shortName: shortName || name,
      category,
      code: code || '',
      description: description || '',
      coordinates,
      isJunction: category === 'junction',
      accessible: accessible !== undefined ? accessible : true,
      openingHours: openingHours || 'Standard Hours',
      features: features || [],
      tags: []
    };

    if (isMongoConnected()) {
      await Location.findOneAndUpdate({ id }, newLocation, { upsert: true, new: true });
    }

    // Update in-memory copy
    const existingIndex = memoryLocations.findIndex((l) => l.id === id);
    if (existingIndex >= 0) {
      memoryLocations[existingIndex] = newLocation;
    } else {
      memoryLocations.push(newLocation);
    }

    res.status(201).json({
      success: true,
      message: `Location '${name}' successfully registered.`,
      location: newLocation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLocations,
  getLocationById,
  getCampusGraph,
  addAdminLocation,
  // Export getters for routeController
  getActiveLocations: () => memoryLocations,
  getActivePaths: () => memoryPaths
};
