import React, { useState, useMemo } from 'react';
import { Search, X, MapPin, Check, GraduationCap, Building2, Utensils, Home, Trophy, HeartPulse, LogIn } from 'lucide-react';

const CATEGORY_META = {
  academic: { label: 'Academic', icon: GraduationCap, color: '#6366f1' },
  administrative: { label: 'Admin', icon: Building2, color: '#a855f7' },
  amenity: { label: 'Amenities', icon: Utensils, color: '#10b981' },
  residential: { label: 'Hostels', icon: Home, color: '#f59e0b' },
  sports: { label: 'Sports', icon: Trophy, color: '#0ea5e9' },
  health: { label: 'Health', icon: HeartPulse, color: '#f43f5e' },
  entry: { label: 'Gates', icon: LogIn, color: '#38bdf8' }
};

export default function LocationPickerModal({
  isOpen,
  title,
  mode, // 'start' or 'destination'
  currentSelectedId,
  otherSelectedId,
  locations = [],
  onSelect,
  onClose
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      if (loc.isJunction) return false;

      if (activeCategory !== 'all' && loc.category !== activeCategory) {
        return false;
      }

      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(query);
        const matchesShort = loc.shortName && loc.shortName.toLowerCase().includes(query);
        const matchesCode = loc.code && loc.code.toLowerCase().includes(query);
        const matchesDesc = loc.description && loc.description.toLowerCase().includes(query);
        const matchesTag = loc.tags && loc.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesName && !matchesShort && !matchesCode && !matchesDesc && !matchesTag) {
          return false;
        }
      }

      return true;
    });
  }, [locations, activeCategory, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: mode === 'start' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                color: mode === 'start' ? '#34d399' : '#fb7185',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'white', fontWeight: 600 }}>{title}</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Select a campus building, lab, hostel, or facility
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ padding: '16px 24px 10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Search Box */}
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
              autoFocus
              placeholder="Search by building name, code (e.g. LIB-01), or keyword..."
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

          {/* Category Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              className={`preset-chip ${activeCategory === 'all' ? 'active' : ''}`}
              style={{
                background: activeCategory === 'all' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: activeCategory === 'all' ? 'white' : 'var(--text-secondary)'
              }}
              onClick={() => setActiveCategory('all')}
            >
              All Locations
            </button>
            {Object.entries(CATEGORY_META).map(([catKey, catMeta]) => {
              const Icon = catMeta.icon;
              const isSelected = activeCategory === catKey;
              return (
                <button
                  key={catKey}
                  className={`preset-chip ${isSelected ? 'active' : ''}`}
                  style={{
                    background: isSelected ? catMeta.color : 'rgba(255,255,255,0.05)',
                    color: isSelected ? 'white' : 'var(--text-secondary)'
                  }}
                  onClick={() => setActiveCategory(catKey)}
                >
                  <Icon size={12} />
                  <span>{catMeta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Locations List */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredLocations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '0.95rem', marginBottom: '4px' }}>No campus locations match your search.</p>
              <p style={{ fontSize: '0.8rem' }}>Try searching for "library", "hostel", "lab", or "gate".</p>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isCurrent = loc.id === currentSelectedId;
              const isOther = loc.id === otherSelectedId;
              const meta = CATEGORY_META[loc.category] || { label: loc.category, icon: MapPin, color: '#6366f1' };
              const Icon = meta.icon;

              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    onSelect(loc);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isCurrent
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isCurrent ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.05)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: `${meta.color}25`,
                        color: meta.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, color: 'white', fontSize: '0.92rem' }}>
                          {loc.name}
                        </span>
                        {loc.code && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(255,255,255,0.06)',
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {loc.code}
                          </span>
                        )}
                        {isOther && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              background: 'rgba(244,63,94,0.15)',
                              color: '#fda4af'
                            }}
                          >
                            Current {mode === 'start' ? 'Destination' : 'Start'}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: '0.76rem',
                          color: 'var(--text-secondary)',
                          marginTop: '2px',
                          lineHeight: 1.3
                        }}
                      >
                        {loc.description}
                      </p>
                    </div>
                  </div>

                  {isCurrent && (
                    <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                      <Check size={18} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
