import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import CampusMap from './components/CampusMap';
import RouteSearchPanel from './components/RouteSearchPanel';
import RouteDetailsCard from './components/RouteDetailsCard';
import CampusBuildingCardsDrawer from './components/CampusBuildingCardsDrawer';
import CampusDirectoryModal from './components/CampusDirectoryModal';
import AccessibilityInfoModal from './components/AccessibilityInfoModal';
import AboutModal from './components/AboutModal';
import { checkHealth, fetchCampusGraph, calculateRoute } from './services/api';

export default function App() {
  const [locations, setLocations] = useState([]);
  const [paths, setPaths] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [destLocation, setDestLocation] = useState(null);
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const [routeResult, setRouteResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState(null);

  // Active focus on building or step from card click
  const [focusedBuilding, setFocusedBuilding] = useState(null);

  // Modals
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Simulation State
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [simProgress, setSimProgress] = useState(0); // 0 to 100
  const [simPoint, setSimPoint] = useState(null); // [lat, lng]
  const [simStepIndex, setSimStepIndex] = useState(0);
  const simIntervalRef = useRef(null);

  // Load campus data & check health on initial mount
  const loadData = useCallback(async () => {
    try {
      const [health, graph] = await Promise.all([
        checkHealth(),
        fetchCampusGraph()
      ]);

      setBackendStatus(health);

      if (graph && graph.locations) {
        setLocations(graph.locations);
        setPaths(graph.paths || []);

        // Default: Main Gate -> Central Library
        const gate = graph.locations.find((l) => l.id === 'main-gate');
        const lib = graph.locations.find((l) => l.id === 'library');
        if (gate) setStartLocation(gate);
        if (lib) setDestLocation(lib);
      }
    } catch (err) {
      console.error('Failed to load initial campus data:', err);
      setError('Could not connect to Campus Navigator API. Please check server status.');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Recalculate route function
  const handleCalculateRoute = async () => {
    if (!startLocation || !destLocation) {
      setError('Please select both a starting location and a destination.');
      return;
    }

    if (startLocation.id === destLocation.id) {
      setError('Starting location and destination must be different.');
      return;
    }

    setIsLoading(true);
    setError(null);
    handleResetSimulation();

    try {
      const data = await calculateRoute({
        startId: startLocation.id,
        destinationId: destLocation.id,
        accessibleOnly
      });

      if (data.success) {
        setRouteResult(data);
      } else {
        setError(data.error || 'Failed to find route.');
        setRouteResult(null);
      }
    } catch (err) {
      console.error('Routing calculation error:', err);
      setError(err.message || 'An error occurred while calculating the route.');
      setRouteResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // If accessibleOnly changes and a route is already shown, recalculate immediately
  useEffect(() => {
    if (routeResult && startLocation && destLocation) {
      handleCalculateRoute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessibleOnly]);

  // Preset route trigger
  const handleSelectPreset = (startId, destId) => {
    const start = locations.find((l) => l.id === startId);
    const dest = locations.find((l) => l.id === destId);
    if (start && dest) {
      setStartLocation(start);
      setDestLocation(dest);
      setError(null);
      handleResetSimulation();

      setIsLoading(true);
      calculateRoute({
        startId,
        destinationId: destId,
        accessibleOnly
      })
        .then((data) => {
          if (data.success) {
            setRouteResult(data);
          } else {
            setError(data.error);
          }
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleClearRoute = () => {
    setRouteResult(null);
    setError(null);
    handleResetSimulation();
  };

  const handleSetStart = (loc) => {
    setStartLocation(loc);
    setRouteResult(null);
    setError(null);
    setFocusedBuilding(loc);
    handleResetSimulation();
  };

  const handleSetDest = (loc) => {
    setDestLocation(loc);
    setRouteResult(null);
    setError(null);
    setFocusedBuilding(loc);
    handleResetSimulation();
  };

  // Click on a building card: fly map to that building
  const handleFocusBuilding = (building) => {
    setFocusedBuilding(building);
  };

  // Click on a route step card: fly map to that step
  const handleFocusStep = (step, idx) => {
    if (step.to) {
      const loc = locations.find((l) => l.id === step.to);
      if (loc) {
        setFocusedBuilding(loc);
      }
    }
    setSimStepIndex(idx);
  };

  // --- Walking Simulation Engine ---
  const handleStartSimulation = () => {
    if (!routeResult?.fullPolylineCoordinates || routeResult.fullPolylineCoordinates.length < 2) return;
    setIsSimPlaying(true);
  };

  const handlePauseSimulation = () => {
    setIsSimPlaying(false);
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  };

  const handleResetSimulation = () => {
    setIsSimPlaying(false);
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setSimProgress(0);
    setSimPoint(null);
    setSimStepIndex(0);
  };

  useEffect(() => {
    if (!isSimPlaying) {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
        simIntervalRef.current = null;
      }
      return;
    }

    const polyline = routeResult?.fullPolylineCoordinates;
    if (!polyline || polyline.length < 2) return;

    // Simulation ticker
    simIntervalRef.current = setInterval(() => {
      setSimProgress((prev) => {
        const next = prev + 1.25; // advance 1.25% per tick (~8 seconds total traversal)
        if (next >= 100) {
          setIsSimPlaying(false);
          setSimPoint(polyline[polyline.length - 1]);
          setSimStepIndex((routeResult.steps?.length || 1) - 1);
          return 100;
        }

        // Interpolate position along polyline
        const totalSegments = polyline.length - 1;
        const exactIndex = (next / 100) * totalSegments;
        const segIndex = Math.min(Math.floor(exactIndex), totalSegments - 1);
        const segmentFraction = exactIndex - segIndex;

        const pA = polyline[segIndex];
        const pB = polyline[segIndex + 1];

        const lat = pA[0] + (pB[0] - pA[0]) * segmentFraction;
        const lng = pA[1] + (pB[1] - pA[1]) * segmentFraction;

        setSimPoint([lat, lng]);

        // Map progress to steps
        if (routeResult.steps && routeResult.steps.length > 0) {
          const stepIdx = Math.min(
            Math.floor((next / 100) * routeResult.steps.length),
            routeResult.steps.length - 1
          );
          setSimStepIndex(stepIdx);
        }

        return next;
      });
    }, 100);

    return () => {
      if (simIntervalRef.current) {
        clearInterval(simIntervalRef.current);
      }
    };
  }, [isSimPlaying, routeResult]);

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <Navbar
        backendStatus={backendStatus}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenAccessibility={() => setIsAccessibilityOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Viewport */}
      <main className="main-viewport" role="main">
        {/* Interactive Leaflet Map */}
        <CampusMap
          locations={locations}
          paths={paths}
          startLocation={startLocation}
          destLocation={destLocation}
          routeResult={routeResult}
          onSetStart={handleSetStart}
          onSetDest={handleSetDest}
          focusedBuilding={focusedBuilding}
          simulationPoint={simPoint}
        />

        {/* Floating Sidebar Panels (Left) */}
        <aside className="sidebar-panel" aria-label="Route Selection Panel">
          <div className="sidebar-scrollable">
            <RouteSearchPanel
              locations={locations}
              startLocation={startLocation}
              destLocation={destLocation}
              setStartLocation={handleSetStart}
              setDestLocation={handleSetDest}
              accessibleOnly={accessibleOnly}
              setAccessibleOnly={setAccessibleOnly}
              onCalculateRoute={handleCalculateRoute}
              isLoading={isLoading}
              error={error}
              onSelectPreset={handleSelectPreset}
            />

            {/* Route Details Card with Clickable Step Cards & Simulation */}
            {routeResult && (
              <RouteDetailsCard
                routeResult={routeResult}
                onClearRoute={handleClearRoute}
                onFocusStep={handleFocusStep}
                simulationState={{
                  isPlaying: isSimPlaying,
                  progress: simProgress,
                  currentStepIndex: simStepIndex
                }}
                onStartSimulation={handleStartSimulation}
                onPauseSimulation={handlePauseSimulation}
                onResetSimulation={handleResetSimulation}
              />
            )}
          </div>
        </aside>

        {/* Bottom Interactive Drawer: CLICKABLE CAMPUS BUILDING CARDS */}
        <CampusBuildingCardsDrawer
          locations={locations}
          startLocation={startLocation}
          destLocation={destLocation}
          onSetStart={handleSetStart}
          onSetDest={handleSetDest}
          onFocusBuilding={handleFocusBuilding}
          activeBuildingId={focusedBuilding?.id}
        />
      </main>

      {/* Modals */}
      <CampusDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        locations={locations}
        onSetStart={handleSetStart}
        onSetDest={handleSetDest}
      />

      <AccessibilityInfoModal
        isOpen={isAccessibilityOpen}
        onClose={() => setIsAccessibilityOpen(false)}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        backendStatus={backendStatus}
      />
    </div>
  );
}
