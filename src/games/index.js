// Game registry - add new games here to have them appear on the home page
// Set available: true and provide a component to make a game playable

import { LetterJager } from '../components/games/LetterJager/LetterJager';
import { Snake } from '../components/games/Snake/Snake';

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
    component: Snake,
    name: 'Tel Slang',
    icon: '🐍',
    description: 'Eet nummers in de juiste volgorde',
    available: true,
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
