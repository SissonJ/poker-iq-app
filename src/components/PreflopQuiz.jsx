import { useState, useCallback } from 'react';
import {
  RANKS, getHandLabel, getHandTier, formatHandName,
  TIER_META, POSITIONS,
} from '../data/handRanges';
import Card from './Card';

// Convert a hand label to two displayable card objects
function handToCards(label) {
  if (label.length === 2) {
    return [
      { rank: label[0], suit: 'spades' },
      { rank: label[0], suit: 'hearts' },
    ];
  }
  const suited = label.endsWith('s');
  const r1 = label[0];
  const r2 = label[1];
  return suited
    ? [{ rank: r1, suit: 'spades' }, { rank: r2, suit: 'spades' }]
    : [{ rank: r1, suit: 'spades' }, { rank: r2, suit: 'hearts' }];
}

// Build the full list of 169 hand labels once
const ALL_HANDS = [];
for (let r = 0; r < RANKS.length; r++) {
  for (let c = 0; c < RANKS.length; c++) {
    ALL_HANDS.push(getHandLabel(r, c));
  }
}

// Deduplicate (getHandLabel produces duplicates for pairs — each pair appears once on diagonal)
const UNIQUE_HANDS = [...new Set(ALL_HANDS)];

function generateQuestion(posFilter) {
  const pos = posFilter === 'ALL'
    ? POSITIONS[Math.floor(Math.random() * POSITIONS.length)]
    : POSITIONS.find(p => p.id === posFilter);

  // Weight toward borderline hands (tier === maxTier or tier === maxTier + 1)
  // 50% chance we draw from borderline pool, 50% from full pool
  const borderline = UNIQUE_HANDS.filter(h => {
    const t = getHandTier(h);
    return t === pos.maxTier || t === pos.maxTier + 1;
  });

  const pool = Math.random() < 0.5 && borderline.length > 0 ? borderline : UNIQUE_HANDS;
  const hand = pool[Math.floor(Math.random() * pool.length)];
  const tier = getHandTier(hand);
  const shouldRaise = tier > 0 && tier <= pos.maxTier;

  return { hand, pos, tier, shouldRaise };
}

function buildExplanation(hand, pos, tier, shouldRaise) {
  const handName = formatHandName(hand);
  const earliestPos = POSITIONS.find(p => p.maxTier >= tier);

  if (tier === 0) {
    return `${handName} is not in any standard open-raise range. This hand has poor equity, no postflop playability, and will put you in difficult spots. Fold from all positions.`;
  }

  if (shouldRaise) {
    if (tier === 1) {
      return `${handName} is a premium holding — open-raise from every position including UTG. It dominates most calling ranges and plays well in big pots.`;
    }
    return `${handName} is in range from ${pos.label} (${TIER_META[tier].label}). It has enough equity and playability to open-raise here profitably. ${tier >= 4 ? 'Your positional advantage compensates for its speculative nature.' : ''}`;
  } else {
    if (!earliestPos) {
      return `${handName} is not a standard open from any position. Fold and wait for better spots.`;
    }
    return `${handName} is too weak to open from ${pos.label}. It's playable from ${earliestPos.label}+ (${TIER_META[tier].label}), but from here you'll be out of position too often with insufficient equity to compensate.`;
  }
}

const FILTER_OPTIONS = [{ id: 'ALL', label: 'All Positions' }, ...POSITIONS];

export default function PreflopQuiz() {
  const [posFilter, setPosFilter] = useState('ALL');
  const [question, setQuestion] = useState(() => generateQuestion('ALL'));
  const [answered, setAnswered] = useState(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const { hand, pos, tier, shouldRaise } = question;
  const cards = handToCards(hand);

  function handleAnswer(choice) {
    if (answered) return;
    setAnswered(choice);
    const correct = (choice === 'raise') === shouldRaise;
    const newStreak = correct ? streak + 1 : 0;
    setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    setStreak(newStreak);
    setBestStreak(b => Math.max(b, newStreak));
  }

  const handleNext = useCallback(() => {
    setQuestion(generateQuestion(posFilter));
    setAnswered(null);
  }, [posFilter]);

  function handleFilterChange(filterId) {
    setPosFilter(filterId);
    setQuestion(generateQuestion(filterId));
    setAnswered(null);
  }

  const isCorrect = answered !== null && (answered === 'raise') === shouldRaise;
  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null;

  return (
    <div className="pq-wrap">
      {/* Score bar */}
      <div className="pq-scorebar">
        <div className="pq-score-item">
          <span className="pq-score-num" style={{ color: 'var(--gold)' }}>
            {score.correct}/{score.total}
          </span>
          <span className="pq-score-lbl">Correct</span>
        </div>
        {pct !== null && (
          <div className="pq-score-item">
            <span className="pq-score-num" style={{ color: pct >= 70 ? 'var(--green-light)' : '#e74c3c' }}>
              {pct}%
            </span>
            <span className="pq-score-lbl">Accuracy</span>
          </div>
        )}
        <div className="pq-score-item">
          <span className="pq-score-num" style={{ color: streak >= 5 ? '#f39c12' : 'var(--text)' }}>
            {streak}🔥
          </span>
          <span className="pq-score-lbl">Streak</span>
        </div>
        <div className="pq-score-item">
          <span className="pq-score-num">{bestStreak}</span>
          <span className="pq-score-lbl">Best</span>
        </div>
      </div>

      {/* Position filter */}
      <div className="pq-filter">
        <span className="pq-filter-label">Practice position:</span>
        <div className="pq-filter-tabs">
          {FILTER_OPTIONS.map(f => (
            <button
              key={f.id}
              className={`pq-filter-tab ${posFilter === f.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question card */}
      <div className="pq-question">
        <div className="pq-pos-line">
          <span className="pq-pos-badge">{pos.label}</span>
          <span className="pq-pos-name">{pos.sublabel} · {pos.pct} open range</span>
        </div>

        <p className="pq-prompt">Should you open-raise this hand?</p>

        <div className="pq-cards">
          {cards.map((card, i) => <Card key={i} card={card} />)}
        </div>

        <p className="pq-hand-label">{formatHandName(hand)}</p>
      </div>

      {/* Action buttons */}
      <div className="pq-actions">
        <button
          className={`pq-btn pq-raise ${answered ? (shouldRaise ? 'pq-correct-btn' : 'pq-wrong-btn') : ''}`}
          onClick={() => handleAnswer('raise')}
          disabled={!!answered}
        >
          <span className="pq-btn-icon">▲</span>
          Open Raise
        </button>
        <button
          className={`pq-btn pq-fold ${answered ? (!shouldRaise ? 'pq-correct-btn' : 'pq-wrong-btn') : ''}`}
          onClick={() => handleAnswer('fold')}
          disabled={!!answered}
        >
          <span className="pq-btn-icon">✕</span>
          Fold
        </button>
      </div>

      {/* Result panel */}
      {answered && (
        <div className={`pq-result ${isCorrect ? 'pq-result-correct' : 'pq-result-wrong'}`}>
          <div className="pq-result-header">
            {isCorrect ? '✓ Correct!' : '✗ Wrong'}
            {tier > 0 && (
              <span className="pq-tier-badge" style={{ background: TIER_META[Math.min(tier, 5)].color }}>
                {TIER_META[Math.min(tier, 5)].label.split('—')[0].trim()}
              </span>
            )}
          </div>
          <p className="pq-result-explanation">
            {buildExplanation(hand, pos, tier, shouldRaise)}
          </p>
          <button className="next-btn" onClick={handleNext}>
            Next Hand →
          </button>
        </div>
      )}
    </div>
  );
}
