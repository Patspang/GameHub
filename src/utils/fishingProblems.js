// Math problem generator for Cijfer Vissen
// Three modes: plus (addition ≤10), min (subtraction within 10), keer (multiplication 1-6)
// Each problem: { num1, num2, operator, correctAnswer, wrongAnswers: [w1, w2] }

import { DIFFICULTY } from '../constants/gameConfig';

// Fisher-Yates shuffle
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build problem pool for each mode
function buildPlusPool() {
  const pool = [];
  for (let a = 1; a <= 9; a++) {
    for (let b = 1; b <= 10 - a; b++) {
      pool.push({ num1: a, num2: b, operator: '+', correctAnswer: a + b });
    }
  }
  return pool;
}

function buildMinPool() {
  const pool = [];
  for (let a = 2; a <= 10; a++) {
    for (let b = 1; b < a; b++) {
      pool.push({ num1: a, num2: b, operator: '−', correctAnswer: a - b });
    }
  }
  return pool;
}

function buildKeerPool() {
  const pool = [];
  for (let a = 1; a <= 6; a++) {
    for (let b = 1; b <= 6; b++) {
      pool.push({ num1: a, num2: b, operator: '×', correctAnswer: a * b });
    }
  }
  return pool;
}

// Map difficulty to math mode
const MODE_MAP = {
  [DIFFICULTY.EASY]: 'plus',
  [DIFFICULTY.NORMAL]: 'min',
  [DIFFICULTY.HARD]: 'keer',
};

const POOL_BUILDERS = {
  plus: buildPlusPool,
  min: buildMinPool,
  keer: buildKeerPool,
};

// Generate plausible wrong answers
function generateWrongAnswers(correctAnswer, mode) {
  const wrong = new Set();

  if (mode === 'keer') {
    // For multiplication: try nearby table results, then offsets
    const offsets = [-6, -4, -3, -2, 2, 3, 4, 6, -1, 1];
    for (const offset of offsets) {
      const w = correctAnswer + offset;
      if (w > 0 && w !== correctAnswer) {
        wrong.add(w);
      }
      if (wrong.size >= 2) break;
    }
  } else {
    // For plus/min: ±1 and ±2
    const offsets = shuffle([-2, -1, 1, 2]);
    for (const offset of offsets) {
      const w = correctAnswer + offset;
      if (w > 0 && w !== correctAnswer) {
        wrong.add(w);
      }
      if (wrong.size >= 2) break;
    }
  }

  // Fallback: keep trying random offsets
  let attempt = 3;
  while (wrong.size < 2 && attempt <= 10) {
    const w = correctAnswer + attempt;
    if (w > 0 && w !== correctAnswer) wrong.add(w);
    attempt++;
  }

  return [...wrong].slice(0, 2);
}

// Generate N problems for a session
export function generateRoundProblems(difficulty, count = 5) {
  const mode = MODE_MAP[difficulty];
  const pool = shuffle(POOL_BUILDERS[mode]());

  const problems = [];
  for (let i = 0; i < count; i++) {
    const p = pool[i % pool.length];
    const wrongAnswers = generateWrongAnswers(p.correctAnswer, mode);
    problems.push({ ...p, wrongAnswers });
  }
  return problems;
}

// Get the math mode label for display
export function getModeLabel(difficulty) {
  return MODE_MAP[difficulty].toUpperCase();
}
