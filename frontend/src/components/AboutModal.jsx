import React from 'react';
import { X, Code2, Server, Cpu, Database, Map, CheckCircle2 } from 'lucide-react';

export default function AboutModal({ isOpen, onClose, backendStatus }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card glass-panel" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>
              About Campus Navigator
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Shortest Path Finder & Accessible Campus Route Planner
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Overview */}
          <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
            <strong>Campus Navigator</strong> is a full-stack web application engineered to calculate the optimal walking route between buildings on a college campus. It utilizes <strong>Dijkstra’s algorithm</strong> implemented natively in <strong>Node.js JavaScript</strong> over a weighted pedestrian graph.
          </p>

          {/* Architecture Highlights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a5b4fc', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Cpu size={16} />
                <span>Dijkstra Shortest Path</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Custom priority queue implementation with weighted distance edges, intermediate junction traversal, and dynamic wheelchair barrier filtering.
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6ee7b7', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Map size={16} />
                <span>Interactive Leaflet Map</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Interactive map rendering with building pins, category filtering, walking network overlays, and glowing animated path polylines.
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fcd34d', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Server size={16} />
                <span>REST API Architecture</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Node.js + Express backend with modular separation between routes, controllers, Dijkstra algorithms, data seeds, and Mongoose models.
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.08)', border: '1px solid rgba(14, 165, 233, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7dd3fc', fontWeight: 600, fontSize: '0.85rem', marginBottom: '6px' }}>
                <Database size={16} />
                <span>Database Integration</span>
              </div>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Out-of-the-box in-memory seed dataset with optional persistent MongoDB & Mongoose connectivity via <code>MONGO_URI</code>.
              </p>
            </div>
          </div>

          {/* Backend Health Status */}
          <div style={{ padding: '12px 14px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'white', marginBottom: '6px' }}>
              ⚡ Live Backend System Status:
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
              <div>Status: <span style={{ color: backendStatus?.status === 'ok' ? '#34d399' : '#f87171' }}>{backendStatus?.status || 'Unknown'}</span></div>
              <div>Algorithm: <span style={{ color: 'white' }}>{backendStatus?.algorithm || 'Dijkstra (JS)'}</span></div>
              <div>Database: <span style={{ color: 'white' }}>{backendStatus?.mongoConnected ? 'MongoDB Connected' : 'Seed Data Fallback'}</span></div>
              {backendStatus?.uptimeSeconds !== undefined && (
                <div>Uptime: <span style={{ color: 'white' }}>{backendStatus.uptimeSeconds}s</span></div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            * Note: The geographic layout and coordinates model a simulated campus (Westbridge Institute of Technology) for demonstration and testing of algorithmic route calculations.
          </div>
        </div>
      </div>
    </div>
  );
}
