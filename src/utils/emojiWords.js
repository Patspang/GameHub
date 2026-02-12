// Emoji-to-word mapping for Letter Leren
// All words are max 4 letters, Dutch, uppercase
// Each entry has an emoji and the corresponding Dutch word

export const EMOJI_WORDS = [
  { emoji: '🐶', word: 'HOND' },
  { emoji: '🐱', word: 'KAT' },
  { emoji: '☀️', word: 'ZON' },
  { emoji: '🌙', word: 'MAAN' },
  { emoji: '⭐', word: 'STER' },
  { emoji: '🐟', word: 'VIS' },
  { emoji: '🏠', word: 'HUIS' },
  { emoji: '🚗', word: 'AUTO' },
  { emoji: '🌳', word: 'BOOM' },
  { emoji: '🌹', word: 'ROOS' },
  { emoji: '🐮', word: 'KOE' },
  { emoji: '📖', word: 'BOEK' },
  { emoji: '🛏️', word: 'BED' },
  { emoji: '🚌', word: 'BUS' },
  { emoji: '⚽', word: 'BAL' },
  { emoji: '🍐', word: 'PEER' },
  { emoji: '🐻', word: 'BEER' },
  { emoji: '🐸', word: 'PAD' },
  { emoji: '🍳', word: 'PAN' },
  { emoji: '🍯', word: 'POT' },
  { emoji: '🔔', word: 'BEL' },
  { emoji: '🚢', word: 'BOOT' },
  { emoji: '🦆', word: 'EEND' },
  { emoji: '🦷', word: 'TAND' },
  { emoji: '🧦', word: 'SOK' },
];

// Select N unique random entries from the pool
export function getRandomEmojiWords(count) {
  const shuffled = [...EMOJI_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Generate wrong options for Easy mode: same-length words, different from correct
export function getWrongOptions(correctWord, count = 2) {
  const sameLength = EMOJI_WORDS
    .filter((e) => e.word.length === correctWord.length && e.word !== correctWord)
    .map((e) => e.word);
  const shuffled = sameLength.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Generate scrambled letter tiles for Normal mode:
// all letters of the word + random filler letters, shuffled
const DUTCH_LETTERS = 'ABCDEFGHIJKLMNOPRSTUVWZ'.split('');

export function getScrambledLetters(word, totalCount = 10) {
  const wordLetters = word.split('');
  const fillerCount = totalCount - wordLetters.length;
  const fillers = [];
  for (let i = 0; i < fillerCount; i++) {
    fillers.push(DUTCH_LETTERS[Math.floor(Math.random() * DUTCH_LETTERS.length)]);
  }
  const all = [...wordLetters, ...fillers];
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.map((letter, index) => ({ id: index, letter, used: false }));
}
