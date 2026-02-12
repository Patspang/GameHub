// Game registry - add new games here to have them appear on the home page
// Set available: true and provide a component to make a game playable

import { LetterJager } from '../components/games/LetterJager/LetterJager';

export const GAMES = {
  'letter-jager': {
    id: 'letter-jager',
    component: LetterJager,
    name: 'Letter Jager',
    icon: '🎯',
    description: 'Verzamel letters om woorden te maken',
    available: true,
    color: 'from-primary-blue to-primary-green',
  },
  'snake': {
    id: 'snake',
    component: null,
    name: 'Snake',
    icon: '🐍',
    description: 'Eet appels en groei',
    available: false,
    color: 'from-primary-green to-primary-yellow',
  },
  'tetris': {
    id: 'tetris',
    component: null,
    name: 'Tetris',
    icon: '🧱',
    description: 'Stapel blokken',
    available: false,
    color: 'from-primary-coral to-primary-yellow',
  },
};
