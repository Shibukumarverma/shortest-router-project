/**
 * Dijkstra's Shortest Path Algorithm
 *
 * Implements weighted shortest path search on campus pedestrian graph.
 * Supports path filtering (such as wheelchair-accessible routes avoiding stairs).
 */

class PriorityQueue {
  constructor() {
    this.values = [];
  }

  enqueue(node, priority) {
    this.values.push({ node, priority });
    this.sort();
  }

  dequeue() {
    return this.values.shift();
  }

  sort() {
    this.values.sort((a, b) => a.priority - b.priority);
  }

  isEmpty() {
    return this.values.length === 0;
  }
}

/**
 * Builds an adjacency list graph from locations and paths.
 *
 * @param {Array} locations - List of campus location objects
 * @param {Array} paths - List of path/edge objects
 * @param {Object} [filterOptions={}] - Filtering criteria (e.g. accessibleOnly)
 * @returns {Map} Adjacency list: nodeId -> Array of { node, distance, edge }
 */
function buildGraph(locations, paths, filterOptions = {}) {
  const graph = new Map();

  // Initialize all known nodes in the graph
  locations.forEach((loc) => {
    graph.set(loc.id, []);
  });

  paths.forEach((path) => {
    // Accessibility filtering
    if (filterOptions.accessibleOnly) {
      if (!path.accessible || path.hasStairs) {
        return; // skip edge
      }
    }

    const { from, to, distance } = path;

    // Both endpoints must exist
    if (!graph.has(from)) graph.set(from, []);
    if (!graph.has(to)) graph.set(to, []);

    // Pedestrian walkways are bidirectional
    graph.get(from).push({
      node: to,
      distance: Number(distance),
      edge: path
    });

    graph.get(to).push({
      node: from,
      distance: Number(distance),
      edge: path
    });
  });

  return graph;
}

/**
 * Finds the shortest path between startId and destinationId using Dijkstra's algorithm.
 *
 * @param {Object} params
 * @param {Array} params.locations - Campus locations
 * @param {Array} params.paths - Campus paths/edges
 * @param {string} params.startId - Starting location ID
 * @param {string} params.destinationId - Destination location ID
 * @param {Object} [params.options={}] - Options (e.g. { accessibleOnly: true })
 * @returns {Object} Route calculation result or error object
 */
function findShortestPath({ locations, paths, startId, destinationId, options = {} }) {
  if (!startId || !destinationId) {
    return {
      success: false,
      error: 'Both starting location and destination are required.'
    };
  }

  // Location lookup maps
  const locationMap = new Map(locations.map((loc) => [loc.id, loc]));

  if (!locationMap.has(startId)) {
    return {
      success: false,
      error: `Start location '${startId}' was not found in campus data.`
    };
  }

  if (!locationMap.has(destinationId)) {
    return {
      success: false,
      error: `Destination location '${destinationId}' was not found in campus data.`
    };
  }

  // Same start and destination
  if (startId === destinationId) {
    const startLoc = locationMap.get(startId);
    return {
      success: true,
      route: [startId],
      pathNodes: [startLoc],
      distanceMeters: 0,
      estimatedMinutes: 0,
      isAccessible: true,
      accessibleOnly: Boolean(options.accessibleOnly),
      edges: [],
      steps: [
        {
          instruction: `You are already at ${startLoc.name}.`,
          distance: 0,
          from: startId,
          to: startId,
          type: 'arrive'
        }
      ],
      algorithm: 'Dijkstra'
    };
  }

  const graph = buildGraph(locations, paths, options);

  const distances = {};
  const previous = {};
  const pq = new PriorityQueue();

  // Initialize distances
  graph.forEach((_, nodeId) => {
    distances[nodeId] = Infinity;
    previous[nodeId] = null;
  });

  distances[startId] = 0;
  pq.enqueue(startId, 0);

  const visited = new Set();

  while (!pq.isEmpty()) {
    const current = pq.dequeue();
    const currentNode = current.node;

    if (visited.has(currentNode)) continue;
    visited.add(currentNode);

    // Reached destination
    if (currentNode === destinationId) {
      break;
    }

    const neighbors = graph.get(currentNode) || [];

    for (const neighbor of neighbors) {
      if (visited.has(neighbor.node)) continue;

      const alt = distances[currentNode] + neighbor.distance;

      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = {
          node: currentNode,
          edge: neighbor.edge
        };
        pq.enqueue(neighbor.node, alt);
      }
    }
  }

  // Check if destination was reached
  if (distances[destinationId] === Infinity || previous[destinationId] === null) {
    const errorMsg = options.accessibleOnly
      ? 'No wheelchair-accessible path exists between these locations. The available routes require stairs.'
      : 'No connected walking path found between the selected locations.';
    return {
      success: false,
      error: errorMsg,
      code: 'NO_PATH_FOUND'
    };
  }

  // Reconstruct path
  const route = [];
  const edges = [];
  let curr = destinationId;

  while (curr !== null) {
    route.unshift(curr);
    const prevInfo = previous[curr];
    if (prevInfo) {
      edges.unshift(prevInfo.edge);
      curr = prevInfo.node;
    } else {
      curr = null;
    }
  }

  const totalDistance = distances[destinationId];

  // Walking speed calculation:
  // Standard walking speed: ~80 meters per minute (approx 4.8 km/h or 1.33 m/s)
  // Wheelchair/accessible speed: ~65 meters per minute (approx 3.9 km/h or 1.08 m/s)
  const walkingSpeedMetersPerMinute = options.accessibleOnly ? 65 : 80;
  const estimatedMinutes = Math.max(1, Math.round((totalDistance / walkingSpeedMetersPerMinute) * 10) / 10);

  // Check if the entire route is accessible
  const isAccessible = edges.every((e) => e.accessible && !e.hasStairs);

  // Generate turn-by-turn guidance steps
  const steps = [];
  const startLoc = locationMap.get(startId);
  steps.push({
    stepNumber: 1,
    instruction: `Start at ${startLoc.name} (${startLoc.code || 'Campus Point'})`,
    distance: 0,
    from: startId,
    to: startId,
    type: 'depart'
  });

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i];
    const fromId = route[i];
    const toId = route[i + 1];
    const targetLoc = locationMap.get(toId);

    let instructionDetail = '';
    if (edge.hasStairs) {
      instructionDetail = `Ascend/descend stairs via ${edge.name} towards ${targetLoc.name}.`;
    } else if (edge.surface === 'ramped') {
      instructionDetail = `Follow accessible ramp path along ${edge.name} to ${targetLoc.name}.`;
    } else {
      instructionDetail = `Walk along ${edge.name} towards ${targetLoc.name}.`;
    }

    steps.push({
      stepNumber: i + 2,
      instruction: instructionDetail,
      distance: edge.distance,
      from: fromId,
      to: toId,
      surface: edge.surface,
      accessible: edge.accessible,
      hasStairs: edge.hasStairs,
      type: 'walk'
    });
  }

  const destLoc = locationMap.get(destinationId);
  steps.push({
    stepNumber: steps.length + 1,
    instruction: `Arrive at your destination: ${destLoc.name}.`,
    distance: 0,
    from: destinationId,
    to: destinationId,
    type: 'arrive'
  });

  // Construct detailed path nodes
  const pathNodes = route.map((id) => locationMap.get(id));

  // Construct combined coordinates for map polyline
  const fullPolylineCoordinates = [];
  for (let i = 0; i < route.length - 1; i++) {
    const fromId = route[i];
    const toId = route[i + 1];
    const edge = edges[i];

    if (edge.pathCoordinates && edge.pathCoordinates.length > 0) {
      // Determine coordinate order matching from -> to
      let segmentCoords = edge.pathCoordinates;
      const firstCoord = segmentCoords[0];
      const fromLoc = locationMap.get(fromId);

      // Check if polyline was stored in reverse order
      const distToFirst = Math.hypot(firstCoord[0] - fromLoc.coordinates[0], firstCoord[1] - fromLoc.coordinates[1]);
      const lastCoord = segmentCoords[segmentCoords.length - 1];
      const distToLast = Math.hypot(lastCoord[0] - fromLoc.coordinates[0], lastCoord[1] - fromLoc.coordinates[1]);

      if (distToLast < distToFirst) {
        segmentCoords = [...segmentCoords].reverse();
      }

      // Append coordinates avoiding duplicates
      for (const pt of segmentCoords) {
        if (
          fullPolylineCoordinates.length === 0 ||
          fullPolylineCoordinates[fullPolylineCoordinates.length - 1][0] !== pt[0] ||
          fullPolylineCoordinates[fullPolylineCoordinates.length - 1][1] !== pt[1]
        ) {
          fullPolylineCoordinates.push(pt);
        }
      }
    } else {
      // Fallback: connect node centers
      const fromLoc = locationMap.get(fromId);
      const toLoc = locationMap.get(toId);
      if (fullPolylineCoordinates.length === 0) fullPolylineCoordinates.push(fromLoc.coordinates);
      fullPolylineCoordinates.push(toLoc.coordinates);
    }
  }

  return {
    success: true,
    route,
    pathNodes,
    distanceMeters: totalDistance,
    estimatedMinutes,
    isAccessible,
    accessibleOnly: Boolean(options.accessibleOnly),
    edges,
    steps,
    fullPolylineCoordinates,
    algorithm: 'Dijkstra'
  };
}

module.exports = {
  buildGraph,
  findShortestPath
};
