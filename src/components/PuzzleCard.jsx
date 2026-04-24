import { useState } from 'react';
import PokerTable from './PokerTable';

const CATEGORY_LABELS = {
  preflop: 'Preflop',
  flop: 'Flop',
  turn: 'Turn',
  river: 'River',
  'pot-odds': 'Pot Odds',
  'hand-reading': 'Hand Reading',
};

const DIFFICULTY_COLORS = {
  beginner: '#27ae60',
  intermediate: '#f39c12',
  advanced: '#e74c3c',
};

export default function PuzzleCard({ puzzle, onNext, puzzleNumber, totalPuzzles, score }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === puzzle.correctAnswer;

  function handleSelect(value) {
    if (revealed) return;
    setSelected(value);
    setRevealed(true);
  }

  function handleNext() {
    setSelected(null);
    setRevealed(false);
    onNext(isCorrect);
  }

  return (
    <div className="puzzle-card">
      {/* Header */}
      <div className="puzzle-header">
        <div className="puzzle-meta">
          <span
            className="category-badge"
            style={{ background: '#2d6a4f' }}
          >
            {CATEGORY_LABELS[puzzle.category]}
          </span>
          <span
            className="difficulty-badge"
            style={{ background: DIFFICULTY_COLORS[puzzle.difficulty] }}
          >
            {puzzle.difficulty}
          </span>
        </div>
        <div className="puzzle-progress">
          <span className="score-display">
            Score: {score.correct}/{score.total}
          </span>
          <span className="progress-display">
            {puzzleNumber}/{totalPuzzles}
          </span>
        </div>
      </div>

      <h2 className="puzzle-title">{puzzle.title}</h2>

      {/* Scenario text */}
      <p className="puzzle-scenario">{puzzle.scenario}</p>

      {/* Poker table visual */}
      <PokerTable puzzle={puzzle} />

      {/* Question */}
      <p className="puzzle-question">{puzzle.question}</p>

      {/* Options */}
      <div className="options-grid">
        {puzzle.options.map((opt) => {
          let btnClass = 'option-btn';
          if (revealed) {
            if (opt.value === puzzle.correctAnswer) btnClass += ' correct';
            else if (opt.value === selected) btnClass += ' wrong';
            else btnClass += ' dimmed';
          }
          return (
            <button
              key={opt.value}
              className={btnClass}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Result panel */}
      {revealed && (
        <div className={`result-panel ${isCorrect ? 'result-correct' : 'result-wrong'}`}>
          <div className="result-header">
            {isCorrect ? '✓ Correct!' : '✗ Not quite'}
          </div>
          <p className="result-explanation">{puzzle.explanation}</p>
          <button className="next-btn" onClick={handleNext}>
            {puzzleNumber < totalPuzzles ? 'Next Puzzle →' : 'See Results →'}
          </button>
        </div>
      )}
    </div>
  );
}
