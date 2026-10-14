import React from 'react';
import { X, Accessibility, CheckCircle2, AlertTriangle, ShieldCheck, Footprints, ArrowRight } from 'lucide-react';

export default function AccessibilityInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card glass-panel" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Accessibility size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'white', fontWeight: 700 }}>
                Campus Accessibility & Wheelchair Routing
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                How Dijkstra's algorithm guarantees step-free, barrier-free routes
              </p>
            </div>
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
          {/* Section 1 */}
          <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#6ee7b7', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} />
              Algorithmic Edge Exclusion
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
              When <strong>"Wheelchair Accessible Route"</strong> is enabled, the routing engine filters out any path segment tagged with <code>hasStairs: true</code> or <code>accessible: false</code> before initializing Dijkstra's priority queue.
            </p>
          </div>

          {/* Demonstration examples */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 600, color: 'white', marginBottom: '8px' }}>
              Example Campus Topography Handling:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'white' }}>
                    1. Central Plaza ➔ Central Library
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#fcd34d' }}>
                    Stairs vs. Ramp
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong>Standard:</strong> 185m via the steep 32-step granite library terrace.<br />
                  <strong>Wheelchair Mode:</strong> 245m gently graded accessible ramp wrapping along the reflecting pool with continuous handrails.
                </p>
              </div>

              <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.84rem', color: 'white' }}>
                    2. Library Lawns ➔ Grand Auditorium
                  </span>
                  <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                    Amphitheater Bypass
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  <strong>Standard:</strong> 140m shortcut over open-air amphitheater concrete bleachers.<br />
                  <strong>Wheelchair Mode:</strong> 215m North ADA certified grade ramp directly to auditorium main floor foyer.
                </p>
              </div>
            </div>
          </div>

          {/* Campus Assistance Contact */}
          <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              ♿ Student Disability & Accessibility Services (SDAS)
            </h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Campus Security Golf-Cart Transit hotline: Ext 4022 • Medical Emergency Bay: Building HC-01 (24/7).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
