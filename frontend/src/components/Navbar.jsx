import React from 'react';
import { Navigation, Compass, BookOpen, Accessibility, Info, Wifi } from 'lucide-react';

export default function Navbar({
  backendStatus,
  onOpenDirectory,
  onOpenAccessibility,
  onOpenAbout
}) {
  const isOnline = backendStatus?.status === 'ok';

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="brand-wrapper" onClick={onOpenAbout} title="Campus Navigator Project Info">
        <div className="brand-logo-icon">
          <Navigation size={22} className="transform -rotate-45" />
        </div>
        <div>
          <span className="brand-title">
            Campus Navigator
            <span className="brand-badge">Dijkstra v1.0</span>
          </span>
        </div>
      </div>

      <div className="nav-center-pill">
        <Compass size={14} className="text-indigo-400" />
        <span>Westbridge Institute of Technology (Simulated Campus)</span>
      </div>

      <div className="nav-actions">
        <button
          className="btn-secondary"
          onClick={onOpenDirectory}
          style={{ padding: '7px 12px', fontSize: '0.8rem' }}
          title="Browse Campus Buildings & Facilities"
        >
          <BookOpen size={15} />
          <span>Directory</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onOpenAccessibility}
          style={{ padding: '7px 12px', fontSize: '0.8rem' }}
          title="Campus Accessibility & Wheelchair Information"
        >
          <Accessibility size={15} />
          <span>Accessibility</span>
        </button>

        <button
          className="btn-secondary"
          onClick={onOpenAbout}
          style={{ padding: '7px 12px', fontSize: '0.8rem' }}
          title="About Project Architecture & Dijkstra Algorithm"
        >
          <Info size={15} />
          <span>About</span>
        </button>

        <div
          className="glass-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            fontSize: '0.76rem',
            cursor: 'default'
          }}
          title={isOnline ? 'Express API connected & operational' : 'Backend connection checking...'}
        >
          <span className={`status-dot ${isOnline ? '' : 'offline'}`} />
          <span style={{ color: isOnline ? '#a7f3d0' : '#fca5a5' }}>
            {isOnline ? 'API Active' : 'Connecting...'}
          </span>
        </div>
      </div>
    </nav>
  );
}
