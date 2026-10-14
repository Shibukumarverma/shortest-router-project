import React, { useState } from 'react';
import { ArrowUpDown, Navigation, Accessibility, Sparkles, AlertCircle, Compass } from 'lucide-react';
import LocationPickerModal from './LocationPickerModal';

export default function RouteSearchPanel({
  locations = [],
  startLocation,
  destLocation,
  setStartLocation,
  setDestLocation,
  accessibleOnly,
  setAccessibleOnly,
  onCalculateRoute,
  isLoading,
  error,
  onSelectPreset
}) {
  const [pickerModal, setPickerModal] = useState({
    isOpen: false,
    mode: 'start', // 'start' or 'destination'
    title: 'Select Starting Location'
  });

  const handleSwap = () => {
    const temp = startLocation;
    setStartLocation(destLocation);
    setDestLocation(temp);
  };

  const openPicker = (mode) => {
    setPickerModal({
      isOpen: true,
      mode,
      title: mode === 'start' ? 'Select Starting Location' : 'Select Destination Location'
    });
  };

  const handleSelectLocation = (loc) => {
    if (pickerModal.mode === 'start') {
      setStartLocation(loc);
    } else {
      setDestLocation(loc);
    }
  };

  return (
    <div className="search-card glass-panel">
      <div className="search-header">
        <h2 className="search-title">
          <Navigation size={18} className="text-indigo-400" />
          Campus Route Finder
        </h2>
        <span
          className="brand-badge"
          title="Optimal graph traversal using Dijkstra algorithm"
        >
          Dijkstra Engine
        </span>
      </div>

      {/* Starting point and Destination selectors */}
      <div className="location-inputs-wrapper">
        <div className="inputs-col">
          {/* Start Point Button */}
          <div
            className={`select-box ${startLocation ? 'has-value' : ''}`}
            onClick={() => openPicker('start')}
            role="button"
            tabIndex={0}
            aria-label="Choose starting location"
          >
            <div className="select-icon-dot start" />
            <div className="select-text-group">
              <span className="select-label">Starting Point</span>
              <span className="select-value">
                {startLocation ? startLocation.name : 'Choose starting building...'}
              </span>
            </div>
          </div>

          {/* Destination Button */}
          <div
            className={`select-box ${destLocation ? 'has-value' : ''}`}
            onClick={() => openPicker('destination')}
            role="button"
            tabIndex={0}
            aria-label="Choose destination location"
          >
            <div className="select-icon-dot dest" />
            <div className="select-text-group">
              <span className="select-label">Destination</span>
              <span className="select-value">
                {destLocation ? destLocation.name : 'Choose destination building...'}
              </span>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <div className="swap-btn-wrapper">
          <button
            type="button"
            className="swap-btn"
            onClick={handleSwap}
            title="Swap Starting Point and Destination"
            aria-label="Swap locations"
          >
            <ArrowUpDown size={17} />
          </button>
        </div>
      </div>

      {/* Wheelchair Accessibility Filter Toggle */}
      <div
        className="accessibility-toggle-box"
        onClick={() => setAccessibleOnly(!accessibleOnly)}
        title="Exclude outdoor stairs and steep stone steps; prioritize ramps & barrier-free walkways"
      >
        <div className="accessibility-info">
          <div className="wheelchair-icon-badge">
            <Accessibility size={18} />
          </div>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'white' }}>
              Wheelchair Accessible Route
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Avoids steep outdoor stairs & prioritizes paved ramps
            </div>
          </div>
        </div>

        <label className="switch" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={accessibleOnly}
            onChange={(e) => setAccessibleOnly(e.target.checked)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="btn-primary"
        style={{ width: '100%', padding: '13px 18px', fontSize: '0.95rem' }}
        onClick={onCalculateRoute}
        disabled={isLoading || !startLocation || !destLocation}
      >
        {isLoading ? (
          <>
            <span
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite'
              }}
            />
            <span>Calculating Shortest Route...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>Find Shortest Route</span>
          </>
        )}
      </button>

      {/* Error message alert */}
      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            fontSize: '0.8rem',
            color: '#fca5a5'
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Test Presets */}
      <div style={{ marginTop: '16px' }}>
        <div
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Compass size={12} />
          <span>Popular Campus Routes:</span>
        </div>
        <div className="preset-chips">
          <button
            type="button"
            className="preset-chip"
            onClick={() => onSelectPreset('main-gate', 'library')}
          >
            Gate → Library
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onSelectPreset('canteen', 'computer-lab')}
          >
            Canteen → CS Lab
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onSelectPreset('hostel-north', 'auditorium')}
          >
            North Hostel → Auditorium
          </button>
          <button
            type="button"
            className="preset-chip"
            onClick={() => onSelectPreset('sports-complex', 'medical-centre')}
          >
            Sports → Medical
          </button>
        </div>
      </div>

      {/* Picker Modal */}
      <LocationPickerModal
        isOpen={pickerModal.isOpen}
        title={pickerModal.title}
        mode={pickerModal.mode}
        currentSelectedId={pickerModal.mode === 'start' ? startLocation?.id : destLocation?.id}
        otherSelectedId={pickerModal.mode === 'start' ? destLocation?.id : startLocation?.id}
        locations={locations}
        onSelect={handleSelectLocation}
        onClose={() => setPickerModal({ ...pickerModal, isOpen: false })}
      />
    </div>
  );
}
