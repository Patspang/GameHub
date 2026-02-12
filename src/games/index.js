// Game registry - add new games here to have them appear on the home page
// Set available: true and provide a component to make a game playable

import { LetterJager } from '../components/games/LetterJager/LetterJager';
import { Snake } from '../components/games/Snake/Snake';
import { Tetris } from '../components/games/Tetris/Tetris';
import { LetterLeren } from '../components/games/LetterLeren/LetterLeren';
import { Muntenkluis } from '../components/games/Muntenkluis/Muntenkluis';

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
    component: Tetris,
    name: 'Tetris',
    icon: '🧱',
    description: 'Stapel blokken',
    available: true,
    color: 'from-primary-coral to-primary-yellow',
  },
  'letter-leren': {
    id: 'letter-leren',
    component: LetterLeren,
    name: 'Letter Leren',
    icon: '📚',
    description: 'Leer letters en woorden met plaatjes',
    available: true,
    color: 'from-primary-blue to-primary-coral',
  },
  'muntenkluis': {
    id: 'muntenkluis',
    component: Muntenkluis,
    name: "Dagobert's Muntenkluis",
    icon: '🪙',
    description: 'Tel munten en oefen met optellen',
    available: true,
    color: 'from-primary-yellow to-primary-coral',
  },
};
