// Addition problem generator for Muntenkluis
// Generates pairs of addends (both >= 1) within difficulty range
// No zero addends — avoids confusing a young learner with "3+0"

import { DIFFICULTY, MUNTENKLUIS_CONFIG } from '../constants/gameConfig';

// Build all valid (a, b) pairs for a difficulty, then shuffle and pick N
export function generateProblems(difficulty, count = MUNTENKLUIS_CONFIG.SUMS_PER_ROUND) {
  const maxSum = MUNTENKLUIS_CONFIG.MAX_SUM[difficulty];
  const pool = [];

  for (let a = 1; a < maxSum; a++) {
    for (let b = 1; b <= maxSum - a; b++) {
      pool.push({ a, b, answer: a + b });
    }
  }

  // Fisher-Yates shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // If pool is smaller than count (shouldn't happen), allow wrapping
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[i % pool.length]);
  }
  return result;
}

// Generate plausible wrong answers for Easy mode multiple choice
// Distractors are close to the correct answer (±1, ±2)
export function getWrongAnswers(correctAnswer, count = 2, maxSum) {
  const candidates = new Set();

  // Try offsets: ±1, ±2, ±3 until we have enough
  for (const offset of [1, -1, 2, -2, 3, -3]) {
    const candidate = correctAnswer + offset;
    if (candidate >= 2 && candidate <= maxSum && candidate !== correctAnswer) {
      candidates.add(candidate);
    }
    if (candidates.size >= count) break;
  }

  return [...candidates].slice(0, count);
}
