import { SUITS, SUIT_COLORS } from '../data/puzzles';

const RANK_DISPLAY = { T: '10', J: 'J', Q: 'Q', K: 'K', A: 'A' };

export default function Card({ card, faceDown = false, small = false }) {
  if (faceDown) {
    return (
      <div className={`card card-back ${small ? 'card-small' : ''}`}>
        <div className="card-back-pattern" />
      </div>
    );
  }

  const { rank, suit } = card;
  const color = SUIT_COLORS[suit];
  const display = RANK_DISPLAY[rank] || rank;
  const suitSymbol = SUITS[suit];

  return (
    <div className={`card ${small ? 'card-small' : ''}`} style={{ color }}>
      <div className="card-corner top-left">
        <div className="card-rank">{display}</div>
        <div className="card-suit-small">{suitSymbol}</div>
      </div>
      <div className="card-center-suit">{suitSymbol}</div>
      <div className="card-corner bottom-right">
        <div className="card-rank">{display}</div>
        <div className="card-suit-small">{suitSymbol}</div>
      </div>
    </div>
  );
}
