import React, { useState, useMemo } from 'react';
import { X, Search, MapPin, CornerDownRight, GraduationCap, Building2, Utensils, Home, Trophy, HeartPulse, LogIn, Clock, Check } from 'lucide-react';

const CATEGORY_META = {
  academic: { label: 'Academic Blocks', icon: GraduationCap, color: '#6366f1' },
  administrative: { label: 'Administrative', icon: Building2, color: '#a855f7' },
  amenity: { label: 'Dining & Events', icon: Utensils, color: '#10b981' },
  residential: { label: 'Hostel Residences', icon: Home, color: '#f59e0b' },
  sports: { label: 'Sports & Fitness', icon: Trophy, color: '#0ea5e9' },
  health: { label: 'Healthcare & Wellness', icon: HeartPulse, color: '#f43f5e' },
  entry: { label: 'Gates & Transit', icon: LogIn, color: '#38bdf8' }
};

export default function CampusDirectoryModal({
  isOpen,
  onClose,
  locations = [],
  onSetStart,
  onSetDest
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const buildings = useMemo(() => {
    return locations.filter((loc) => !loc.isJunction);
  }, [locations]);

  const filteredBuildings = useMemo(() => {
    return buildings.filter((loc) => {
      if (activeTab !== 'all' && loc.category !== activeTab) return false;
      if (searchTerm.trim() !== '') {
        const q = searchTerm.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesDesc = loc.description && loc.description.toLowerCase().includes(q);
        const matchesCode = loc.code && loc.code.toLowerCase().includes(q);
        const matchesFeatures = loc.features && loc.features.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesCode && !matchesFeatures) return false;
      }
      return true;
    });
  }, [buildings, activeTab, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card glass-panel"
        style={{ maxWidth: '780px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'white', fontWeight: 700 }}>
              Campus Directory & Building Guide
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Explore academic halls, research labs, dining amenities, and facilities
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
            aria-label="Close directory"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ padding: '16px 24px 10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            className="glass-input"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '12px'
            }}
          >
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by facility name, code, WiFi, ramp access, etc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                width: '100%',
                fontSize: '0.9rem'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              className={`preset-chip ${activeTab === 'all' ? 'active' : ''}`}
              style={{
                background: activeTab === 'all' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: activeTab === 'all' ? 'white' : 'var(--text-secondary)'
              }}
              onClick={() => setActiveTab('all')}
            >
              All Buildings ({buildings.length})
            </button>
            {Object.entries(CATEGORY_META).map(([catKey, catMeta]) => {
              const Icon = catMeta.icon;
              const count = buildings.filter((b) => b.category === catKey).length;
              return (
                <button
                  key={catKey}
                  className="preset-chip"
                  style={{
                    background: activeTab === catKey ? catMeta.color : 'rgba(255,255,255,0.05)',
                    color: activeTab === catKey ? 'white' : 'var(--text-secondary)'
                  }}
                  onClick={() => setActiveTab(catKey)}
                >
                  <Icon size={12} />
                  <span>{catMeta.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Buildings Grid */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredBuildings.map((building) => {
            const meta = CATEGORY_META[building.category] || { label: building.category, icon: Building2, color: '#6366f1' };
            const Icon = meta.icon;

            return (
              <div
                key={building.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: `${meta.color}25`,
                        color: meta.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'white' }}>
                          {building.name}
                        </h4>
                        {building.code && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(255,255,255,0.08)',
                              color: 'var(--text-secondary)',
                              fontWeight: 600
                            }}
                          >
                            {building.code}
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '0.68rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: `${meta.color}20`,
                            color: meta.color
                          }}
                        >
                          {meta.label}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        {building.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <button
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.74rem' }}
                      onClick={() => {
                        onSetStart(building);
                        onClose();
                      }}
                      title="Set as Starting Point"
                    >
                      <MapPin size={13} style={{ color: '#34d399' }} />
                      <span>Start</span>
                    </button>
                    <button
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.74rem' }}
                      onClick={() => {
                        onSetDest(building);
                        onClose();
                      }}
                      title="Set as Destination"
                    >
                      <CornerDownRight size={13} />
                      <span>Directions</span>
                    </button>
                  </div>
                </div>

                {/* Features & Hours Footer */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '6px',
                    borderTop: '1px solid rgba(255,255,255,0.04)',
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} />
                    <span>{building.openingHours || 'Standard Hours'}</span>
                  </div>

                  {building.features && building.features.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {building.features.map((feat, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
