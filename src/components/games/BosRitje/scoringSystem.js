// Star calculation and Dutch feedback messages for Bos Ritje

import { BOS_RITJE_CONFIG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';

const { SCORING } = BOS_RITJE_CONFIG;

export function calculateStars(usedSteps, optimalSteps) {
  if (usedSteps <= optimalSteps + SCORING.STAR_3_THRESHOLD) return 3;
  if (usedSteps <= optimalSteps + SCORING.STAR_2_THRESHOLD) return 2;
  return 1;
}

export function getStarMessage(stars) {
  const messages = DUTCH_TEXT.bosRitje.feedback.success;
  let pool;
  if (stars === 3) pool = messages.perfect;
  else if (stars === 2) pool = messages.good;
  else pool = messages.completed;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getStepsMessage(usedSteps, optimalSteps) {
  return DUTCH_TEXT.bosRitje.feedback.success.steps
    .replace('{steps}', usedSteps)
    .replace('{optimal}', optimalSteps);
}
