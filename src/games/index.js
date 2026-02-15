// Game registry - add new games here to have them appear on the home page
// Set available: true and provide a component to make a game playable

import { LetterJager } from '../components/games/LetterJager/LetterJager';
import { Snake } from '../components/games/Snake/Snake';
import { Tetris } from '../components/games/Tetris/Tetris';
import { LetterLeren } from '../components/games/LetterLeren/LetterLeren';
import { Muntenkluis } from '../components/games/Muntenkluis/Muntenkluis';
import { Sudoku } from '../components/games/Sudoku/Sudoku';
import { CijferVissen } from '../components/games/CijferVissen/CijferVissen';
import { Tekenen } from '../components/games/Tekenen/Tekenen';
import { PinguinAvontuur } from '../components/games/PinguinAvontuur/PinguinAvontuur';
import { BosRitje } from '../components/games/BosRitje/BosRitje';
import { Memory } from '../components/games/Memory/Memory';

export const GAMES = {
  'letter-jager': {
    id: 'letter-jager',
    component: LetterJager,
    name: 'Letter Jager',
    icon: '🎯',
    description: 'Verzamel letters om woorden te maken',
    available: true,
    color: 'from-primary-blue to-primary-green',
    createdAt: '2026-02-01',
  },
  'snake': {
    id: 'snake',
    component: Snake,
    name: 'Tel Slang',
    icon: '🐍',
    description: 'Eet nummers in de juiste volgorde',
    available: true,
    color: 'from-primary-green to-primary-yellow',
    createdAt: '2026-02-01',
  },
  'tetris': {
    id: 'tetris',
    component: Tetris,
    name: 'Tetris',
    icon: '🧱',
    description: 'Stapel blokken',
    available: true,
    color: 'from-primary-coral to-primary-yellow',
    createdAt: '2026-02-01',
  },
  'letter-leren': {
    id: 'letter-leren',
    component: LetterLeren,
    name: 'Letter Leren',
    icon: '📚',
    description: 'Leer letters en woorden met plaatjes',
    available: true,
    color: 'from-primary-blue to-primary-coral',
    createdAt: '2026-02-01',
  },
  'muntenkluis': {
    id: 'muntenkluis',
    component: Muntenkluis,
    name: "Dagobert's Muntenkluis",
    icon: '🪙',
    description: 'Tel munten en oefen met optellen',
    available: true,
    color: 'from-primary-yellow to-primary-coral',
    createdAt: '2026-02-01',
  },
  'sudoku': {
    id: 'sudoku',
    component: Sudoku,
    name: 'Sudoku',
    icon: '🧩',
    description: 'Vul puzzels met cijfers',
    available: true,
    color: 'from-primary-green to-primary-blue',
    createdAt: '2026-02-01',
  },
  'cijfer-vissen': {
    id: 'cijfer-vissen',
    component: CijferVissen,
    name: 'Cijfer Vissen',
    icon: '🎣',
    description: 'Vang de vis met het juiste antwoord!',
    available: true,
    color: 'from-primary-blue to-primary-green',
    createdAt: '2026-02-01',
  },
  'tekenen': {
    id: 'tekenen',
    component: Tekenen,
    name: 'Tekenen & Kleuren',
    icon: '🎨',
    description: 'Teken en kleur je eigen plaatjes!',
    available: true,
    color: 'from-primary-coral to-primary-yellow',
    skipDifficulty: true,
    createdAt: '2026-02-01',
  },
  'pinguin-avontuur': {
    id: 'pinguin-avontuur',
    component: PinguinAvontuur,
    name: 'Pinguïn Avontuur',
    icon: '🐧',
    description: 'Help de pinguïn naar de zee!',
    available: true,
    color: 'from-primary-blue to-primary-green',
    createdAt: '2026-02-01',
  },
  'bos-ritje': {
    id: 'bos-ritje',
    component: BosRitje,
    name: 'Bos Ritje',
    icon: '🚗',
    description: 'Plan de route door het bos!',
    available: true,
    color: 'from-primary-green to-primary-yellow',
    skipDifficulty: true,
    createdAt: '2026-02-01',
  },
  'memory': {
    id: 'memory',
    component: Memory,
    name: 'Memory',
    icon: '🧠',
    description: 'Vind alle paren!',
    available: true,
    color: 'from-primary-coral to-primary-blue',
    createdAt: '2026-02-13',
  },
};
