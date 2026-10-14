import React, { useState, useEffect, useRef } from 'react';
import {
  Route,
  Clock,
  Footprints,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  MapPin,
  ChevronRight,
  Sparkles,
  FastForward,
  Navigation
} from 'lucide-react';

export default function RouteDetailsCard({
  routeResult,
  onClearRoute,
  onFitBounds,
  onFocusStep,
  simulationState,
  onStartSimulation,
  onPauseSimulation,
  onResetSimulation
}) {
  if (!routeResult) return null;

  const {
    distanceMeters,
    estimatedMinutes,
    isAccessible,
    steps = [],
    route = []
  } = routeResult;

  const { isPlaying, progress, currentStepIndex } = simulationState || {
    isPlaying: false,
    progress: 0,
    currentStepIndex: 0
  };

  return (
    <div className="route-summary-card glass-panel">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.25)',
              color: '#a5b4fc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(99,102,241,0.3)'
            }}
          >
            <Route size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'white' }}>
              Calculated Walking Route
            </h3>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Optimal shortest path via Dijkstra
            </span>
          </div>
        </div>

        <button
          onClick={onClearRoute}
          className="btn-secondary"
          style={{ padding: '5px 10px', fontSize: '0.72rem', borderRadius: '8px' }}
          title="Reset current route"
        >
          <RotateCcw size={12} />
          <span>Clear</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-box">
          <div className="metric-value">
            <Footprints size={17} className="text-indigo-400" />
            <span>{distanceMeters}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>m</span>
          </div>
          <div className="metric-label">Total Distance</div>
        </div>

        <div className="metric-box">
          <div className="metric-value">
            <Clock size={17} className="text-cyan-400" />
            <span>{estimatedMinutes}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' }}>min</span>
          </div>
          <div className="metric-label">Estimated Walk</div>
        </div>

        <div className="metric-box">
          <div className="metric-value">
            <MapPin size={17} className="text-emerald-400" />
            <span>{route.length}</span>
          </div>
          <div className="metric-label">Waypoints</div>
        </div>
      </div>

      {/* Accessibility Status Alert */}
      <div
        style={{
          padding: '9px 12px',
          borderRadius: '10px',
          background: isAccessible
            ? 'rgba(16, 185, 129, 0.12)'
            : 'rgba(245, 158, 11, 0.12)',
          border: `1px solid ${isAccessible ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.77rem',
          color: isAccessible ? '#6ee7b7' : '#fcd34d'
        }}
      >
        {isAccessible ? (
          <>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Wheelchair Accessible:</strong> Barrier-free route with gentle paved ramps.
            </span>
          </>
        ) : (
          <>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Warning — Contains Stairs:</strong> Outdoor steps present. Enable "Wheelchair Accessible" for ramp detour.
            </span>
          </>
        )}
      </div>

      {/* Interactive Walk Simulation Controller */}
      <div className="walk-simulation-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} className="text-indigo-400" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>
              Simulate Walking Route
            </span>
          </div>

          <div style={{ fontSize: '0.74rem', color: '#a5b4fc', fontWeight: 600 }}>
            {Math.round(progress)}% Complete
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="sim-progress-track">
          <div
            className="sim-progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {!isPlaying ? (
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                onClick={onStartSimulation}
              >
                <Play size={13} fill="currentColor" />
                <span>{progress > 0 && progress < 100 ? 'Resume Walk' : 'Play Walk'}</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.78rem', borderColor: '#f59e0b', color: '#fcd34d' }}
                onClick={onPauseSimulation}
              >
                <Pause size={13} fill="currentColor" />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
              onClick={onResetSimulation}
              title="Reset simulation"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          {onFitBounds && (
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '6px 10px', fontSize: '0.72rem' }}
              onClick={onFitBounds}
            >
              <Navigation size={12} />
              <span>Zoom Route</span>
            </button>
          )}
        </div>
      </div>

      {/* Turn-by-Turn Guidance - EACH CARD IS CLICKABLE */}
      <div>
        <div
          style={{
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>Click Step to Inspect ({steps.length})</span>
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.7rem' }}>Interactive</span>
        </div>

        <div className="steps-container">
          {steps.map((step, idx) => {
            const hasStairs = step.hasStairs;
            const isRamp = step.surface === 'ramped';
            const isActiveStep = currentStepIndex === idx;

            let itemClass = 'step-item clickable-step';
            if (hasStairs) itemClass += ' stairs';
            if (isRamp) itemClass += ' ramp';
            if (isActiveStep) itemClass += ' active-sim-step';

            return (
              <div
                key={idx}
                className={itemClass}
                onClick={() => onFocusStep(step, idx)}
                title="Click to pan map to this waypoint"
                role="button"
                tabIndex={0}
              >
                <div className="step-number-badge">
                  {step.stepNumber || idx + 1}
                </div>
                <div className="step-content">
                  <div className="step-text">{step.instruction}</div>
                  {step.distance > 0 && (
                    <div className="step-sub">
                      Walk {step.distance} meters
                      {step.surface && ` • ${step.surface.toUpperCase()}`}
                      {step.hasStairs && ' • ⚠️ Stairs'}
                      {step.surface === 'ramped' && ' • ♿ Accessible Ramp'}
                    </div>
                  )}
                </div>
                <ChevronRight size={14} className="step-chevron" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
