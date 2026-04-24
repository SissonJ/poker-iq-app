const GRADE = (pct) => {
  if (pct >= 90) return { letter: 'A', label: 'Shark', color: '#27ae60' };
  if (pct >= 70) return { letter: 'B', label: 'Solid Regular', color: '#2980b9' };
  if (pct >= 50) return { letter: 'C', label: 'Recreational', color: '#f39c12' };
  return { letter: 'D', label: 'Fish', color: '#e74c3c' };
};

export default function ResultsScreen({ score, onRestart, onShuffle }) {
  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const grade = GRADE(pct);

  return (
    <div className="results-screen">
      <h1 className="results-title">Session Complete</h1>

      <div className="grade-circle" style={{ borderColor: grade.color, color: grade.color }}>
        <div className="grade-letter">{grade.letter}</div>
        <div className="grade-label">{grade.label}</div>
      </div>

      <div className="score-breakdown">
        <div className="score-big">{score.correct} / {score.total}</div>
        <div className="score-pct" style={{ color: grade.color }}>{pct}% correct</div>
      </div>

      <div className="results-feedback">
        {pct >= 90 && "Outstanding! You're making near-optimal decisions across all streets."}
        {pct >= 70 && pct < 90 && "Good work — solid fundamentals. Review the hands you missed and focus on pot odds and position."}
        {pct >= 50 && pct < 70 && "Decent start. Brush up on preflop hand selection, pot odds math, and when to c-bet."}
        {pct < 50 && "Keep grinding! Study basic hand rankings, starting hand charts, and the rule of 4 for draws."}
      </div>

      <div className="results-actions">
        <button className="restart-btn" onClick={onShuffle}>
          New Shuffle
        </button>
        <button className="restart-btn restart-same" onClick={onRestart}>
          Retry Same Order
        </button>
      </div>
    </div>
  );
}
