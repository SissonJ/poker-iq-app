export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export const RANK_NAMES = {
  A: 'Ace', K: 'King', Q: 'Queen', J: 'Jack', T: 'Ten',
  '9': 'Nine', '8': 'Eight', '7': 'Seven', '6': 'Six',
  '5': 'Five', '4': 'Four', '3': 'Three', '2': 'Two',
};

// Returns the hand label for grid cell (row, col)
// Upper-right triangle = suited, lower-left = offsuit, diagonal = pair
export function getHandLabel(row, col) {
  if (row === col) return RANKS[row] + RANKS[row];
  if (row < col) return RANKS[row] + RANKS[col] + 's';
  return RANKS[col] + RANKS[row] + 'o';
}

export function formatHandName(hand) {
  if (hand.length === 2) {
    const name = RANK_NAMES[hand[0]];
    return `Pocket ${name}s (${hand})`;
  }
  const suited = hand.endsWith('s');
  const r1 = RANK_NAMES[hand[0]];
  const r2 = RANK_NAMES[hand[1]];
  return `${r1}-${r2} ${suited ? 'Suited' : 'Offsuit'} (${hand})`;
}

// Tiers represent the earliest position a hand should be open-raised from.
// Tier 1 = UTG (premium), Tier 5 = SB only (marginal).
// Shade the grid by tier so players see which hands are strongest at a glance.

const TIER_1 = new Set([
  // Pairs
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88',
  // Suited aces
  'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A5s',
  // Suited kings/broadway
  'KQs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs',
  // Offsuit broadway
  'AKo', 'AQo', 'AJo', 'ATo', 'KQo',
]);

const TIER_2 = new Set([
  // Pairs
  '77', '66',
  // Suited aces
  'A7s', 'A6s', 'A4s', 'A3s', 'A2s',
  // Suited connectors/kings
  'K9s', 'Q9s', 'J9s', 'T9s', '98s', '87s',
  // Offsuit broadway
  'KJo', 'QJo',
]);

const TIER_3 = new Set([
  // Pairs
  '55', '44',
  // Suited kings/connectors
  'K8s', 'K7s', 'K6s', 'Q8s', 'J8s', 'T8s', '97s', '76s', '65s', '54s',
  // Offsuit broadway
  'KTo', 'QTo', 'JTo', 'T9o',
]);

const TIER_4 = new Set([
  // Pairs
  '33', '22',
  // Suited kings/gappers
  'K5s', 'K4s', 'K3s', 'K2s',
  'Q7s', 'Q6s', 'Q5s',
  'J7s', 'J6s', 'T7s',
  '96s', '86s', '75s', '64s', '53s',
  // Offsuit connectors/kings
  'K9o', 'Q9o', 'J9o', 'T8o', '98o', '87o',
]);

const TIER_5 = new Set([
  // SB-only marginal hands
  'Q4s', 'Q3s', 'J5s', 'J4s', 'T6s', 'T5s', '95s', '85s', '74s', '63s', '43s',
  'K8o', 'K7o', 'Q8o', 'J8o', 'T7o', '97o', '76o', '65o',
]);

export function getHandTier(hand) {
  if (TIER_1.has(hand)) return 1;
  if (TIER_2.has(hand)) return 2;
  if (TIER_3.has(hand)) return 3;
  if (TIER_4.has(hand)) return 4;
  if (TIER_5.has(hand)) return 5;
  return 0;
}

export const TIER_META = {
  1: { label: 'Premium — raise from anywhere', color: '#1a7a4a' },
  2: { label: 'Strong — raise MP+', color: '#2a9d5c' },
  3: { label: 'Playable — raise CO+', color: '#27ae60' },
  4: { label: 'Speculative — raise BTN+', color: '#52c97b' },
  5: { label: 'Marginal — SB steal only', color: '#a8e6bc' },
};

export const POSITIONS = [
  {
    id: 'UTG', label: 'UTG', sublabel: 'Under the Gun', maxTier: 1, pct: '~15%',
    description: 'First to act in a 6-max game — 5 players still to act behind you. Play only premium holdings. You will frequently be out of position post-flop, so hand selection is critical.',
  },
  {
    id: 'MP', label: 'MP', sublabel: 'Middle Position', maxTier: 2, pct: '~20%',
    description: 'One seat off UTG. Widen slightly to include small pairs, more suited aces, and suited one-gappers. Still 3 players left to act, so avoid junk.',
  },
  {
    id: 'CO', label: 'CO', sublabel: 'Cutoff', maxTier: 3, pct: '~28%',
    description: 'One off the button. Excellent position — attack the BTN and blinds aggressively. Add suited kings, more connectors, and offsuit broadway hands.',
  },
  {
    id: 'BTN', label: 'BTN', sublabel: 'Button', maxTier: 4, pct: '~40%',
    description: 'Best seat at the table — last to act every post-flop street. Open very wide and steal the blinds relentlessly. Small pairs and suited connectors have great implied odds.',
  },
  {
    id: 'SB', label: 'SB', sublabel: 'Small Blind', maxTier: 5, pct: '~45%',
    description: 'Only one player left to beat (BB), so you can open very wide. But you are first to act on every post-flop street — be careful with marginal hands against an aggressive BB.',
  },
];
