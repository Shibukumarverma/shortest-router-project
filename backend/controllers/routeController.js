const { findShortestPath } = require('../algorithms/dijkstra');
const { getActiveLocations, getActivePaths } = require('./locationController');

/**
 * Calculate the shortest path between two locations
 * @route POST /api/routes
 * @body { startId: string, destinationId: string, accessibleOnly?: boolean }
 */
const calculateRoute = async (req, res, next) => {
  try {
    const { startId, destinationId, accessibleOnly } = req.body;

    if (!startId || !destinationId) {
      return res.status(400).json({
        success: false,
        error: 'Both "startId" and "destinationId" fields are required in the request body.',
        message: 'Please select both a starting location and a destination.'
      });
    }

    const locations = getActiveLocations();
    const paths = getActivePaths();

    const result = findShortestPath({
      locations,
      paths,
      startId,
      destinationId,
      options: {
        accessibleOnly: Boolean(accessibleOnly)
      }
    });

    if (!result.success) {
      return res.status(404).json({
        success: false,
        error: result.error,
        code: result.code || 'ROUTING_ERROR'
      });
    }

    // Match required response format and include extra rich properties for visualization
    res.json({
      success: true,
      route: result.route,
      distanceMeters: result.distanceMeters,
      estimatedMinutes: result.estimatedMinutes,
      algorithm: result.algorithm,
      isAccessible: result.isAccessible,
      accessibleOnly: result.accessibleOnly,
      steps: result.steps,
      pathNodes: result.pathNodes,
      fullPolylineCoordinates: result.fullPolylineCoordinates
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateRoute
};
