const { findShortestPath } = require('../algorithms/dijkstra');
const { locations, paths } = require('../data/campusData');

function runTests() {
  console.log('🧪 Running Dijkstra Algorithm Tests...\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
    }
  }

  // Test 1: Shortest path from main-gate to admin-block
  const res1 = findShortestPath({
    locations,
    paths,
    startId: 'main-gate',
    destinationId: 'admin-block'
  });
  assert(res1.success === true, 'Finds route from Main Gate to Admin Block');
  assert(res1.distanceMeters === 245, `Distance is 245m (115m + 130m). Got: ${res1.distanceMeters}`);
  assert(res1.route.join(' -> ') === 'main-gate -> junction-gate -> admin-block', 'Optimal sequence verified');

  // Test 2: Standard shortest route chooses stairs when accessibleOnly = false
  const resStairs = findShortestPath({
    locations,
    paths,
    startId: 'junction-central',
    destinationId: 'library',
    options: { accessibleOnly: false }
  });
  assert(resStairs.success === true, 'Finds route to library');
  assert(resStairs.distanceMeters === 185, `Chooses 185m stairs shortcut. Got: ${resStairs.distanceMeters}`);
  assert(resStairs.isAccessible === false, 'Detects route has stairs');

  // Test 3: Accessible route chooses ramp detour when accessibleOnly = true
  const resRamp = findShortestPath({
    locations,
    paths,
    startId: 'junction-central',
    destinationId: 'library',
    options: { accessibleOnly: true }
  });
  assert(resRamp.success === true, 'Finds wheelchair-accessible route to library');
  assert(resRamp.distanceMeters === 245, `Chooses 245m accessible ramp detour. Got: ${resRamp.distanceMeters}`);
  assert(resRamp.isAccessible === true, 'Route is fully accessible');

  // Test 4: Same start and destination
  const resSame = findShortestPath({
    locations,
    paths,
    startId: 'canteen',
    destinationId: 'canteen'
  });
  assert(resSame.success === true && resSame.distanceMeters === 0, 'Zero distance for identical start & destination');

  // Test 5: Invalid location IDs
  const resInvalid = findShortestPath({
    locations,
    paths,
    startId: 'non-existent',
    destinationId: 'library'
  });
  assert(resInvalid.success === false, 'Handles non-existent location ID gracefully');

  // Test 6: Route from Main Gate to Computer Lab
  const resComplex = findShortestPath({
    locations,
    paths,
    startId: 'main-gate',
    destinationId: 'computer-lab'
  });
  assert(resComplex.success === true, 'Finds multi-hop path across campus');
  assert(resComplex.steps.length > 3, 'Generates step-by-step guidance');

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
