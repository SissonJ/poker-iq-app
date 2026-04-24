import Card from './Card';

const POSITION_LABELS = {
  UTG: 'UTG',
  MP: 'MP',
  CO: 'CO',
  BTN: 'BTN',
  SB: 'SB',
  BB: 'BB',
};

export default function PokerTable({ puzzle }) {
  const { holeCards, communityCards, position, potSize, toCall, heroStack } = puzzle;

  return (
    <div className="table-wrapper">
      <div className="felt-table">
        {/* Community cards area */}
        <div className="board-area">
          <div className="board-label">BOARD</div>
          <div className="board-cards">
            {communityCards.length === 0 ? (
              <div className="board-empty">Preflop — no community cards</div>
            ) : (
              communityCards.map((card, i) => <Card key={i} card={card} />)
            )}
          </div>
        </div>

        {/* Pot info */}
        {potSize > 0 && (
          <div className="pot-display">
            <span className="pot-label">POT</span>
            <span className="pot-amount">{potSize}bb</span>
          </div>
        )}
      </div>

      {/* Hero info bar */}
      <div className="hero-bar">
        <div className="hero-position">
          <span className="pos-badge">{POSITION_LABELS[position] || position}</span>
          <span className="pos-label">Your Position</span>
        </div>

        <div className="hero-hand">
          {holeCards.map((card, i) => <Card key={i} card={card} />)}
        </div>

        <div className="hero-stats">
          {heroStack > 0 && (
            <div className="stat">
              <span className="stat-label">Stack</span>
              <span className="stat-value">{heroStack}bb</span>
            </div>
          )}
          {toCall > 0 && (
            <div className="stat stat-call">
              <span className="stat-label">To Call</span>
              <span className="stat-value">{toCall}bb</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
