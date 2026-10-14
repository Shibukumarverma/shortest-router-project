import React, { useState, useMemo, useRef } from 'react';
import {
  GraduationCap,
  Building2,
  Utensils,
  Home,
  Trophy,
  HeartPulse,
  LogIn,
  MapPin,
  CornerDownRight,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const CATEGORY_META = {
  academic: { label: 'Academic', icon: GraduationCap, color: '#6366f1', gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)' },
  administrative: { label: 'Admin', icon: Building2, color: '#a855f7', gradient: 'linear-gradient(135deg, #7c3aed, #a855f7)' },
  amenity: { label: 'Dining & Events', icon: Utensils, color: '#10b981', gradient: 'linear-gradient(135deg, #059669, #10b981)' },
  residential: { label: 'Hostels', icon: Home, color: '#f59e0b', gradient: 'linear-gradient(135deg, #d97706, #f59e0b)' },
  sports: { label: 'Sports', icon: Trophy, color: '#0ea5e9', gradient: 'linear-gradient(135deg, #0284c7, #38bdf8)' },
  health: { label: 'Health', icon: HeartPulse, color: '#f43f5e', gradient: 'linear-gradient(135deg, #e11d48, #f43f5e)' },
  entry: { label: 'Gates', icon: LogIn, color: '#06b6d4', gradient: 'linear-gradient(135deg, #0891b2, #06b6d4)' }
};

export default function CampusBuildingCardsDrawer({
  locations = [],
  startLocation,
  destLocation,
  onSetStart,
  onSetDest,
  onFocusBuilding,
  activeBuildingId
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const scrollContainerRef = useRef(null);

  // Non-junction buildings
  const buildings = useMemo(() => {
    return locations.filter((loc) => !loc.isJunction);
  }, [locations]);

  // Filtered buildings
  const filteredBuildings = useMemo(() => {
    return buildings.filter((loc) => {
      if (activeCategory !== 'all' && loc.category !== activeCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = loc.name.toLowerCase().includes(q);
        const matchesShort = loc.shortName && loc.shortName.toLowerCase().includes(q);
        const matchesCode = loc.code && loc.code.toLowerCase().includes(q);
        const matchesDesc = loc.description && loc.description.toLowerCase().includes(q);
        if (!matchesName && !matchesShort && !matchesCode && !matchesDesc) return false;
      }
      return true;
    });
  }, [buildings, activeCategory, searchQuery]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`building-cards-drawer ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Drawer Toggle Header Bar */}
      <div className="drawer-header-bar" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="drawer-title-group">
          <div className="drawer-badge-icon">
            <Sparkles size={16} />
          </div>
          <span className="drawer-title">
            Interactive Campus Buildings
            <span className="drawer-count-chip">{buildings.length}</span>
          </span>
          <span className="drawer-subtitle">
            {isExpanded ? 'Click any card to fly to building on map' : 'Click to expand building cards'}
          </span>
        </div>

        <div className="drawer-controls-group" onClick={(e) => e.stopPropagation()}>
          {isExpanded && (
            <>
              {/* Category Filter Pills */}
              <div className="drawer-filter-pills">
                <button
                  type="button"
                  className={`drawer-filter-pill ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All ({buildings.length})
                </button>
                {Object.entries(CATEGORY_META).map(([catKey, catMeta]) => {
                  const Icon = catMeta.icon;
                  const count = buildings.filter((b) => b.category === catKey).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={catKey}
                      type="button"
                      className={`drawer-filter-pill ${activeCategory === catKey ? 'active' : ''}`}
                      style={{
                        borderColor: activeCategory === catKey ? catMeta.color : undefined,
                        background: activeCategory === catKey ? `${catMeta.color}28` : undefined
                      }}
                      onClick={() => setActiveCategory(catKey)}
                    >
                      <Icon size={12} style={{ color: catMeta.color }} />
                      <span>{catMeta.label} ({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Scroll buttons */}
              <div className="drawer-nav-btns">
                <button
                  type="button"
                  className="drawer-nav-btn"
                  onClick={() => scroll('left')}
                  title="Scroll Left"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="drawer-nav-btn"
                  onClick={() => scroll('right')}
                  title="Scroll Right"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}

          {/* Toggle Expand / Collapse */}
          <button
            type="button"
            className="drawer-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse building cards' : 'Expand building cards'}
            aria-label="Toggle drawer"
          >
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Content: Horizontal Cards Carousel */}
      {isExpanded && (
        <div className="drawer-cards-scroll-wrapper" ref={scrollContainerRef}>
          {filteredBuildings.map((building) => {
            const isStart = startLocation?.id === building.id;
            const isDest = destLocation?.id === building.id;
            const isFocused = activeBuildingId === building.id;
            const meta = CATEGORY_META[building.category] || {
              label: building.category,
              icon: Building2,
              color: '#6366f1',
              gradient: 'linear-gradient(135deg, #4f46e5, #6366f1)'
            };
            const Icon = meta.icon;

            let cardStateClass = '';
            if (isStart) cardStateClass = 'card-is-start';
            else if (isDest) cardStateClass = 'card-is-dest';
            else if (isFocused) cardStateClass = 'card-is-focused';

            return (
              <div
                key={building.id}
                className={`building-interactive-card ${cardStateClass}`}
                onClick={() => onFocusBuilding(building)}
                title={`Click to view ${building.name} on map`}
                role="button"
                tabIndex={0}
              >
                {/* Top Category Gradient Banner */}
                <div className="card-top-banner" style={{ background: meta.gradient }}>
                  <div className="card-top-content">
                    <span className="card-category-label">
                      <Icon size={12} />
                      {meta.label}
                    </span>
                    {building.code && (
                      <span className="card-code-pill">{building.code}</span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="card-body">
                  <div className="card-title-row">
                    <h4 className="card-title">{building.name}</h4>
                  </div>
                  <p className="card-desc">{building.description}</p>

                  {/* Feature Tags */}
                  {building.features && building.features.length > 0 && (
                    <div className="card-tags-row">
                      {building.features.slice(0, 3).map((feat, idx) => (
                        <span key={idx} className="card-tag-chip">
                          {feat.includes('Ramp') ? '♿ Ramp' : feat.includes('WiFi') ? '📶 WiFi' : feat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Active Selection Badge */}
                  {isStart && (
                    <div className="card-active-status start">
                      <CheckCircle2 size={13} />
                      <span>Selected as Start</span>
                    </div>
                  )}
                  {isDest && (
                    <div className="card-active-status dest">
                      <CheckCircle2 size={13} />
                      <span>Selected as Destination</span>
                    </div>
                  )}

                  {/* Action Buttons: Set as Start / Destination */}
                  <div className="card-actions-row" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className={`card-action-btn start-btn ${isStart ? 'active' : ''}`}
                      onClick={() => onSetStart(building)}
                      title="Set as Starting Point"
                    >
                      <MapPin size={13} />
                      <span>{isStart ? 'Start Point' : 'Start Here'}</span>
                    </button>

                    <button
                      type="button"
                      className={`card-action-btn dest-btn ${isDest ? 'active' : ''}`}
                      onClick={() => onSetDest(building)}
                      title="Set as Destination"
                    >
                      <CornerDownRight size={13} />
                      <span>{isDest ? 'Destination' : 'Go Here'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
