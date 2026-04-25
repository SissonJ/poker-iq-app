import { useState } from 'react';
import {
  RANKS, getHandLabel, getHandTier, formatHandName,
  TIER_META, POSITIONS,
} from '../data/handRanges';

export default function HandChart() {
  const [selectedPos, setSelectedPos] = useState('BTN');
  const [hoveredHand, setHoveredHand] = useState(null);

  const pos = POSITIONS.find(p => p.id === selectedPos);

  function cellStyle(tier) {
    if (tier === 0 || tier > pos.maxTier) return {};
    return { background: TIER_META[tier].color };
  }

  function cellClass(row, col, tier) {
    const inRange = tier > 0 && tier <= pos.maxTier;
    const isPair = row === col;
    return `hc-cell ${inRange ? 'hc-in-range' : 'hc-fold'} ${isPair ? 'hc-pair' : ''}`;
  }

  const hovered = hoveredHand;
  const hoveredInRange = hovered && hovered.tier > 0 && hovered.tier <= pos.maxTier;

  return (
    <div className="hand-chart">
      <div className="hc-header">
        <h2 className="hc-title">Preflop Starting Hand Chart</h2>
        <p className="hc-subtitle">Open-raise ranges by position · 6-max cash game</p>
      </div>

      {/* Position tabs */}
      <div className="hc-pos-tabs">
        {POSITIONS.map(p => (
          <button
            key={p.id}
            className={`hc-pos-tab ${selectedPos === p.id ? 'active' : ''}`}
            onClick={() => setSelectedPos(p.id)}
          >
            <span className="hc-tab-name">{p.label}</span>
            <span className="hc-tab-pct">{p.pct}</span>
          </button>
        ))}
      </div>

      {/* Hover info bar */}
      <div className="hc-info-bar">
        {hovered ? (
          <>
            <span className="hc-info-hand">{formatHandName(hovered.label)}</span>
            <span
              className="hc-info-action"
              style={{ color: hoveredInRange ? TIER_META[hovered.tier].color : '#8b949e' }}
            >
              {hoveredInRange
                ? TIER_META[hovered.tier].label
                : 'Fold — not in range'}
            </span>
          </>
        ) : (
          <span className="hc-info-placeholder">Hover any hand to see its action</span>
        )}
      </div>

      {/* 13×13 grid */}
      <div className="hc-grid-wrapper">
        {/* Column rank headers */}
        <div className="hc-col-headers">
          <div className="hc-corner" />
          {RANKS.map(r => <div key={r} className="hc-col-header">{r}</div>)}
        </div>

        <div className="hc-rows">
          {RANKS.map((rowRank, row) => (
            <div key={rowRank} className="hc-row">
              <div className="hc-row-header">{rowRank}</div>
              {RANKS.map((colRank, col) => {
                const label = getHandLabel(row, col);
                const tier = getHandTier(label);
                return (
                  <div
                    key={label}
                    className={cellClass(row, col, tier)}
                    style={cellStyle(tier)}
                    onMouseEnter={() => setHoveredHand({ label, tier })}
                    onMouseLeave={() => setHoveredHand(null)}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="hc-legend">
        {Object.entries(TIER_META).map(([tier, { label, color }]) => (
          <div key={tier} className="hc-legend-item">
            <div className="hc-swatch" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
        <div className="hc-legend-item">
          <div className="hc-swatch hc-swatch-fold" />
          <span>Fold — not in range</span>
        </div>
      </div>

      {/* Position description */}
      <div className="hc-pos-desc">
        <div className="hc-pos-desc-label">{pos.label} — {pos.sublabel}</div>
        <p>{pos.description}</p>
      </div>
    </div>
  );
}
