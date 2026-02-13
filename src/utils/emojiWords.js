// Emoji-to-word mapping for Letter Leren
// Supports Dutch and English word lists
// Each entry has an emoji and the corresponding word (uppercase)

const DUTCH_WORDS = [
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

const ENGLISH_WORDS = [
  // 3-letter words (12+)
  { emoji: '🐶', word: 'DOG' },
  { emoji: '🐱', word: 'CAT' },
  { emoji: '☀️', word: 'SUN' },
  { emoji: '🚌', word: 'BUS' },
  { emoji: '🛏️', word: 'BED' },
  { emoji: '🐷', word: 'PIG' },
  { emoji: '🏃', word: 'RUN' },
  { emoji: '🐜', word: 'ANT' },
  { emoji: '🍳', word: 'EGG' },
  { emoji: '🦊', word: 'FOX' },
  { emoji: '🥤', word: 'CUP' },
  { emoji: '🧢', word: 'HAT' },
  { emoji: '🗺️', word: 'MAP' },
  { emoji: '🥜', word: 'NUT' },
  // 4-letter words (13+)
  { emoji: '⭐', word: 'STAR' },
  { emoji: '🐟', word: 'FISH' },
  { emoji: '🌳', word: 'TREE' },
  { emoji: '🌹', word: 'ROSE' },
  { emoji: '📖', word: 'BOOK' },
  { emoji: '🐻', word: 'BEAR' },
  { emoji: '🐸', word: 'FROG' },
  { emoji: '🌙', word: 'MOON' },
  { emoji: '⚽', word: 'BALL' },
  { emoji: '🐦', word: 'BIRD' },
  { emoji: '🎂', word: 'CAKE' },
  { emoji: '🚪', word: 'DOOR' },
  { emoji: '🐴', word: 'PONY' },
  { emoji: '🏠', word: 'HOME' },
  { emoji: '🦁', word: 'LION' },
];

// Legacy export for backwards compatibility
export const EMOJI_WORDS = DUTCH_WORDS;

export const WORD_LISTS = {
  nl: DUTCH_WORDS,
  en: ENGLISH_WORDS,
};

function getWordList(language = 'nl') {
  return WORD_LISTS[language] || DUTCH_WORDS;
}

// Select N unique random entries from the pool
export function getRandomEmojiWords(count, language = 'nl') {
  const pool = getWordList(language);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Select N unique random entries filtered by word length
export function getRandomEmojiWordsByLength(count, wordLength, language = 'nl') {
  const pool = getWordList(language);
  const filtered = pool.filter((e) => e.word.length === wordLength);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Generate wrong options: same-length words from same language, different from correct
export function getWrongOptions(correctWord, count = 2, language = 'nl') {
  const pool = getWordList(language);
  const sameLength = pool
    .filter((e) => e.word.length === correctWord.length && e.word !== correctWord)
    .map((e) => e.word);
  const shuffled = sameLength.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Generate scrambled letter tiles:
// all letters of the word + random filler letters, shuffled
const FILLER_LETTERS = {
  nl: 'ABCDEFGHIJKLMNOPRSTUVWZ'.split(''),
  en: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
};

export function getScrambledLetters(word, totalCount = 10, language = 'nl') {
  const letters = FILLER_LETTERS[language] || FILLER_LETTERS.nl;
  const wordLetters = word.split('');
  const fillerCount = totalCount - wordLetters.length;
  const fillers = [];
  for (let i = 0; i < fillerCount; i++) {
    fillers.push(letters[Math.floor(Math.random() * letters.length)]);
  }
  const all = [...wordLetters, ...fillers];
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.map((letter, index) => ({ id: index, letter, used: false }));
}
