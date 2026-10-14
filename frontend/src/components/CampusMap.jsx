import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Compass,
  Layers,
  Eye,
  EyeOff,
  GraduationCap,
  Building2,
  Utensils,
  Home,
  Trophy,
  HeartPulse,
  LogIn,
  MapPin,
  CornerDownRight,
  Footprints
} from 'lucide-react';

// Default campus center
const CAMPUS_CENTER = [28.5445, 77.1920];

// Custom icon creator helper using SVG markup for DivIcon
function createCustomMarkerIcon({ category, isStart, isDest, name, code, isFocused }) {
  let iconBg = '#6366f1';
  let svgInner = '';

  if (category === 'academic') {
    iconBg = '#4f46e5';
    svgInner = `<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>`;
  } else if (category === 'administrative') {
    iconBg = '#7c3aed';
    svgInner = `<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/>`;
  } else if (category === 'amenity') {
    iconBg = '#10b981';
    svgInner = `<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2M6 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`;
  } else if (category === 'residential') {
    iconBg = '#f59e0b';
    svgInner = `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`;
  } else if (category === 'sports') {
    iconBg = '#0ea5e9';
    svgInner = `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`;
  } else if (category === 'health') {
    iconBg = '#f43f5e';
    svgInner = `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>`;
  } else if (category === 'entry') {
    iconBg = '#0284c7';
    svgInner = `<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>`;
  } else {
    iconBg = '#64748b';
    svgInner = `<circle cx="12" cy="12" r="6"/>`;
  }

  let pinClasses = `marker-pin ${category}`;
  if (isStart) pinClasses += ' is-start';
  if (isDest) pinClasses += ' is-dest';
  if (isFocused) pinClasses += ' is-focused';

  const badgeHtml = isStart
    ? `<span class="marker-badge-pill start">START</span>`
    : isDest
    ? `<span class="marker-badge-pill dest">DEST</span>`
    : isFocused
    ? `<span class="marker-badge-pill focus">VIEW</span>`
    : '';

  const html = `
    <div class="custom-campus-marker ${isFocused ? 'pulse-focus' : ''}">
      <div class="${pinClasses}">
        ${badgeHtml}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${svgInner}
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22]
  });
}

// Custom walker avatar icon for animated route simulation
function createWalkerAvatarIcon() {
  const html = `
    <div class="animated-walker-beacon">
      <div class="walker-halo-ring"></div>
      <div class="walker-avatar-inner">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="2.5"/>
          <path d="M10 22v-6l-2-2 3-5 3 2v5"/>
          <path d="M15 13l3 3v6"/>
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '',
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });
}

// Controller to auto-fly to active route bounds, center, or focused building
function MapController({
  routePolyline,
  startLocation,
  destLocation,
  resetTrigger,
  focusedCoords,
  simulationPoint
}) {
  const map = useMap();

  // Pan to focused coords if user clicked a card
  useEffect(() => {
    if (focusedCoords && focusedCoords.length === 2) {
      map.flyTo(focusedCoords, 18, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [focusedCoords, map]);

  // Track simulation point if walking
  useEffect(() => {
    if (simulationPoint && simulationPoint.length === 2) {
      map.panTo(simulationPoint, { animate: true, duration: 0.3 });
    }
  }, [simulationPoint, map]);

  // Fit bounds when route changes
  useEffect(() => {
    if (routePolyline && routePolyline.length > 0) {
      const bounds = L.latLngBounds(routePolyline);
      map.fitBounds(bounds, { padding: [100, 100], maxZoom: 18, animate: true, duration: 1.2 });
    } else if (startLocation && destLocation) {
      const bounds = L.latLngBounds([startLocation.coordinates, destLocation.coordinates]);
      map.fitBounds(bounds, { padding: [110, 110], maxZoom: 17, animate: true });
    } else if (startLocation) {
      map.flyTo(startLocation.coordinates, 17, { duration: 1 });
    }
  }, [routePolyline, startLocation, destLocation, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(CAMPUS_CENTER, 16, { duration: 1 });
    }
  }, [resetTrigger, map]);

  return null;
}

export default function CampusMap({
  locations = [],
  paths = [],
  startLocation,
  destLocation,
  routeResult,
  onSetStart,
  onSetDest,
  focusedBuilding,
  simulationPoint
}) {
  const [showAllPaths, setShowAllPaths] = useState(true);
  const [mapLayer, setMapLayer] = useState('streets'); // 'streets', 'osm', 'satellite'
  const [resetTrigger, setResetTrigger] = useState(0);

  // Active route coordinates
  const routePolyline = useMemo(() => {
    if (routeResult?.fullPolylineCoordinates && routeResult.fullPolylineCoordinates.length > 0) {
      return routeResult.fullPolylineCoordinates;
    }
    return null;
  }, [routeResult]);

  // Non-junction locations for building markers
  const buildingLocations = useMemo(() => {
    return locations.filter((loc) => !loc.isJunction);
  }, [locations]);

  // Walker icon instance
  const walkerIcon = useMemo(() => createWalkerAvatarIcon(), []);

  return (
    <div className="map-canvas-wrapper">
      <MapContainer
        center={CAMPUS_CENTER}
        zoom={16}
        scrollWheelZoom={true}
        zoomControl={false}
        attributionControl={false}
      >
        {/* Crisp, watermark-free map tiles */}
        {mapLayer === 'streets' && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}
        {mapLayer === 'osm' && (
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}
        {mapLayer === 'satellite' && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        )}

        {/* Map View Controller */}
        <MapController
          routePolyline={routePolyline}
          startLocation={startLocation}
          destLocation={destLocation}
          resetTrigger={resetTrigger}
          focusedCoords={focusedBuilding?.coordinates}
          simulationPoint={simulationPoint}
        />

        {/* All Walkways Layer (Background Grid) */}
        {showAllPaths &&
          paths.map((p) => {
            const coords = p.pathCoordinates;
            if (!coords || coords.length < 2) return null;
            const hasStairs = p.hasStairs;
            return (
              <Polyline
                key={p.id}
                positions={coords}
                pathOptions={{
                  color: hasStairs ? '#f59e0b' : '#6366f1',
                  weight: hasStairs ? 3.5 : 2.8,
                  opacity: 0.5,
                  dashArray: hasStairs ? '5, 6' : '3, 4'
                }}
              />
            );
          })}

        {/* Active Dijkstra Calculated Route (Multi-layer glow + animated dash) */}
        {routePolyline && (
          <>
            {/* Outer Glow Line */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: routeResult?.isAccessible ? '#10b981' : '#6366f1',
                weight: 12,
                opacity: 0.4,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Foreground Solid Path */}
            <Polyline
              positions={routePolyline}
              pathOptions={{
                color: routeResult?.isAccessible ? '#059669' : '#4f46e5',
                weight: 6,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
            {/* Animated Directional Dash */}
            <Polyline
              positions={routePolyline}
              className="route-animated-dash"
              pathOptions={{
                color: '#ffffff',
                weight: 2.5,
                opacity: 0.95,
                dashArray: '8, 14'
              }}
            />
          </>
        )}

        {/* Live Animated Walker Avatar if Walking Simulation is Active */}
        {simulationPoint && (
          <Marker position={simulationPoint} icon={walkerIcon} zIndexOffset={2000}>
            <Tooltip permanent direction="top" offset={[0, -20]}>
              <div className="walker-tooltip-bubble">
                <Footprints size={12} />
                <span>Walking...</span>
              </div>
            </Tooltip>
          </Marker>
        )}

        {/* Building & Point Markers */}
        {buildingLocations.map((loc) => {
          const isStart = startLocation?.id === loc.id;
          const isDest = destLocation?.id === loc.id;
          const isFocused = focusedBuilding?.id === loc.id;

          const markerIcon = createCustomMarkerIcon({
            category: loc.category,
            isStart,
            isDest,
            name: loc.name,
            code: loc.code,
            isFocused
          });

          return (
            <Marker
              key={loc.id}
              position={loc.coordinates}
              icon={markerIcon}
              zIndexOffset={isStart || isDest ? 1200 : isFocused ? 1100 : 200}
            >
              {/* Tooltip on hover */}
              <Tooltip direction="top" offset={[0, -18]} opacity={0.95}>
                <div style={{ fontWeight: 600, fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>{loc.name}</span>
                  {loc.code && <span style={{ color: '#6366f1' }}>({loc.code})</span>}
                </div>
              </Tooltip>

              {/* Popup on click */}
              <Popup>
                <div className="campus-popup-card">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: 'rgba(99,102,241,0.25)',
                        color: '#a5b4fc'
                      }}
                    >
                      {loc.category}
                    </span>
                    {loc.code && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {loc.code}
                      </span>
                    )}
                  </div>

                  <div className="popup-title">{loc.name}</div>
                  <div className="popup-desc">{loc.description}</div>

                  {loc.openingHours && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                      🕒 {loc.openingHours}
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="popup-actions">
                    <button
                      className="popup-action-btn start-btn"
                      onClick={() => onSetStart(loc)}
                    >
                      <MapPin size={12} />
                      <span>Start Here</span>
                    </button>
                    <button
                      className="popup-action-btn dest-btn"
                      onClick={() => onSetDest(loc)}
                    >
                      <CornerDownRight size={12} />
                      <span>Go Here</span>
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Map Controls */}
      <div className="map-floating-controls">
        <button
          className="map-control-btn"
          onClick={() => setResetTrigger((prev) => prev + 1)}
          title="Recenter Campus View"
          aria-label="Recenter map"
        >
          <Compass size={18} />
        </button>

        <button
          className="map-control-btn"
          onClick={() => setShowAllPaths(!showAllPaths)}
          title={showAllPaths ? 'Hide Walkways Network' : 'Show Walkways Network'}
          aria-label="Toggle walkway network"
          style={{ color: showAllPaths ? 'var(--accent-primary)' : 'var(--text-muted)' }}
        >
          {showAllPaths ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>

        {/* Map Layer Switcher: Streets / OSM / Satellite */}
        <button
          className="map-control-btn"
          onClick={() => {
            const next = mapLayer === 'streets' ? 'satellite' : mapLayer === 'satellite' ? 'osm' : 'streets';
            setMapLayer(next);
          }}
          title={`Layer: ${mapLayer.toUpperCase()} (Click to toggle)`}
          aria-label="Toggle map layer"
        >
          <Layers size={18} />
        </button>
      </div>

      {/* Campus environment notice watermark */}
      <div className="campus-watermark-pill">
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }}
        />
        <span>Interactive Campus Map • {mapLayer.toUpperCase()} View</span>
      </div>
    </div>
  );
}
