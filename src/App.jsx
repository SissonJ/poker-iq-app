import { useState, useCallback } from 'react';
import { puzzles } from './data/puzzles';
import PuzzleCard from './components/PuzzleCard';
import ResultsScreen from './components/ResultsScreen';
import HandChart from './components/HandChart';
import PreflopQuiz from './components/PreflopQuiz';
import AdSlot from './components/AdSlot';
import './styles.css';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [mode, setMode] = useState('puzzles'); // 'puzzles' | 'chart' | 'preflop-quiz'
  const [deck, setDeck] = useState(() => shuffle(puzzles));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [done, setDone] = useState(false);

  const handleNext = useCallback((wasCorrect) => {
    const newScore = {
      correct: score.correct + (wasCorrect ? 1 : 0),
      total: score.total + 1,
    };
    setScore(newScore);

    if (currentIndex + 1 >= deck.length) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [score, currentIndex, deck.length]);

  function restart() {
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setDone(false);
  }

  function reshuffleAndRestart() {
    setDeck(shuffle(puzzles));
    setCurrentIndex(0);
    setScore({ correct: 0, total: 0 });
    setDone(false);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo">
          <span className="logo-suits" aria-hidden="true">♠♥</span>
          <span className="logo-text">PokerIQ</span>
          <span className="logo-suits" aria-hidden="true">♦♣</span>
        </h1>
        <p className="logo-sub">Free Texas Hold'em Strategy Training</p>
        <nav className="mode-tabs" aria-label="App mode">
          <button
            className={`mode-tab ${mode === 'puzzles' ? 'active' : ''}`}
            onClick={() => setMode('puzzles')}
          >
            Strategy Puzzles
          </button>
          <button
            className={`mode-tab ${mode === 'chart' ? 'active' : ''}`}
            onClick={() => setMode('chart')}
          >
            Preflop Chart
          </button>
          <button
            className={`mode-tab ${mode === 'preflop-quiz' ? 'active' : ''}`}
            onClick={() => setMode('preflop-quiz')}
          >
            Preflop Quiz
          </button>
        </nav>
      </header>

      <div className="content-row">
        <aside className="ad-sidebar ad-sidebar-left">
          {/* ⚠ Replace slot value with your left ad unit ID from AdSense */}
          <AdSlot slot="XXXXXXXXXX" className="ad-sidebar-slot" />
        </aside>

        <main className="app-main">
          {mode === 'chart' ? (
            <HandChart />
          ) : mode === 'preflop-quiz' ? (
            <PreflopQuiz />
          ) : done ? (
            <ResultsScreen
              score={score}
              onRestart={restart}
              onShuffle={reshuffleAndRestart}
            />
          ) : (
            <PuzzleCard
              key={deck[currentIndex].id}
              puzzle={deck[currentIndex]}
              onNext={handleNext}
              puzzleNumber={currentIndex + 1}
              totalPuzzles={deck.length}
              score={score}
            />
          )}
        </main>

        <aside className="ad-sidebar ad-sidebar-right">
          {/* ⚠ Replace slot value with your right ad unit ID from AdSense */}
          <AdSlot slot="XXXXXXXXXX" className="ad-sidebar-slot" />
        </aside>
      </div>
      {/* Static content for search engine crawlers */}
      <section className="seo-footer" aria-hidden="true">
        <h2>Texas Hold'em Poker Training — 23 Interactive Strategy Puzzles</h2>
        <p>PokerIQ is a free poker training app that tests your Texas Hold'em decision-making across six skill areas. No signup required.</p>
        <ul>
          <li><strong>Preflop decisions</strong> — hand selection, 3-betting, blind defense, and position play</li>
          <li><strong>Flop strategy</strong> — continuation betting, check-raising, and board texture reading</li>
          <li><strong>Turn play</strong> — pot control, second barreling, and semi-bluffing</li>
          <li><strong>River decisions</strong> — thin value bets, bluffing, and calling down correctly</li>
          <li><strong>Pot odds math</strong> — flush draws, open-ended straight draws, and gutshots</li>
          <li><strong>Hand reading</strong> — identify your best 5-card hand from hole cards and community cards</li>
        </ul>
        <p>Puzzles are graded Beginner, Intermediate, and Advanced. Each answer includes a detailed explanation of the correct poker theory behind the decision.</p>
      </section>
    </div>
  );
}
