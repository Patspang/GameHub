// Memory game utilities — emoji deck creation, shuffling, score calculation

import { MEMORY_CONFIG } from '../../../constants/gameConfig';

// 28 kid-friendly emojis — distinct shapes, universally rendered
export const EMOJI_SET = [
  '🐶', '🐱', '🐰', '🐻', '🦁', '🐼', '🐨', '🦊',
  '🐸', '🐵', '🦋', '🐢', '🐠', '🐬', '🦄', '🐝',
  '🐞', '🐙', '🌻', '🌈', '🍎', '🍌', '🍉', '🍕',
  '🚀', '🎈', '⚽', '🎸',
];

// Pick `pairCount` random emojis, duplicate each, Fisher-Yates shuffle
export function createDeck(pairCount) {
  const shuffled = [...EMOJI_SET].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, pairCount);
  const deck = [...selected, ...selected].map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Score = base per pair + efficiency bonus
// Perfect game (every flip is a match) gets full bonus
export function calculateScore(moves, pairs, difficulty) {
  const perPair = MEMORY_CONFIG.SCORING.PER_PAIR[difficulty];
  const baseScore = pairs * perPair;
  const perfectBonus = MEMORY_CONFIG.SCORING.PERFECT_BONUS[difficulty];
  const efficiency = Math.min(1, pairs / Math.max(1, moves));
  const bonus = Math.round(perfectBonus * efficiency);
  return baseScore + bonus;
}
