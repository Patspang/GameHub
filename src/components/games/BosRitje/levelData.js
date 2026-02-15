// Progressive levels for Bos Ritje — single sequence, no difficulty selection
// Grid cell types: 'grass', 'path', 'tree', 'rock', 'water', 'start', 'goal'
// The car can only drive on 'path', 'start', and 'goal' tiles
// startDirection: 'north' | 'east' | 'south' | 'west'
//
// Grid coordinates: columns A-I (left to right), rows 1-9 (top to bottom)
// In code: startX = column index (0-based), startY = row index (0-based)
// Car starts center-bottom on each grid size:
//   5×5 → C5 (col 2, row 4)
//   7×7 → D7 (col 3, row 6)
//   9×9 → E9 (col 4, row 8)
//
// maxCommands = optimalSteps (exact fit, shown as empty slots)
// All path/start/goal tiles MUST form a single connected path

const LEVELS = [
  // --- Levels 1-5: 5×5 grids, gentle introduction ---

  // Level 1: Straight north — just 4x forward
  // Route: FFFF (4 steps)
  {
    id: 1,
    name: 'Rechtdoor',
    gridSize: { rows: 5, cols: 5 },
    startX: 2, startY: 4,
    startDirection: 'north',
    goalX: 2, goalY: 0,
    maxCommands: 4,
    optimalSteps: 4,
    grid: [
      ['grass', 'grass', 'goal',  'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'start', 'grass', 'grass'],
    ],
  },

  // Level 2: One right turn
  // Route: FFRFF (5 steps)
  {
    id: 2,
    name: 'Eerste Bocht',
    gridSize: { rows: 5, cols: 5 },
    startX: 2, startY: 4,
    startDirection: 'north',
    goalX: 4, goalY: 2,
    maxCommands: 5,
    optimalSteps: 5,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'path',  'goal'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'start', 'grass', 'grass'],
    ],
  },

  // Level 3: One left turn
  // Route: FFLFF (5 steps)
  {
    id: 3,
    name: 'Naar Links',
    gridSize: { rows: 5, cols: 5 },
    startX: 2, startY: 4,
    startDirection: 'north',
    goalX: 0, goalY: 2,
    maxCommands: 5,
    optimalSteps: 5,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass'],
      ['goal',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'start', 'grass', 'grass'],
    ],
  },

  // Level 4: L-shape north then left
  // Route: FFFLFF (6 steps)
  {
    id: 4,
    name: 'De Bocht',
    gridSize: { rows: 5, cols: 5 },
    startX: 2, startY: 4,
    startDirection: 'north',
    goalX: 0, goalY: 1,
    maxCommands: 6,
    optimalSteps: 6,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass'],
      ['goal',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'start', 'grass', 'grass'],
    ],
  },

  // Level 5: North then left turn — goal at left border
  // Route: FFFLF (5 steps)
  {
    id: 5,
    name: 'Slangenbocht',
    gridSize: { rows: 5, cols: 5 },
    startX: 2, startY: 4,
    startDirection: 'north',
    goalX: 0, goalY: 1,
    maxCommands: 6,
    optimalSteps: 6,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass'],
      ['goal',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'path',  'path',  'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'start', 'grass', 'grass'],
    ],
  },

  // --- Levels 6-10: 7×7 grids, increasingly more turns ---

  // Level 6: S-shape — 2 turns, goal at right border
  {
    id: 6,
    name: 'De S-Bocht',
    gridSize: { rows: 7, cols: 7 },
    startX: 3, startY: 6,
    startDirection: 'north',
    goalX: 6, goalY: 2,
    maxCommands: 10,
    optimalSteps: 10,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'goal'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'grass'],
      ['grass', 'grass', 'grass', 'path',  'path',  'path',  'grass'],
      ['grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 7: Z-shape around a rock — 2 turns, goal at left border
  {
    id: 7,
    name: 'Om de Rots',
    gridSize: { rows: 7, cols: 7 },
    startX: 3, startY: 6,
    startDirection: 'north',
    goalX: 0, goalY: 2,
    maxCommands: 10,
    optimalSteps: 10,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['goal',  'path',  'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'path',  'path',  'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'rock',  'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 8: Staircase — 3 turns
  // FF R FF L FF R F (10 steps: 7 fwd + 3 turns)
  // Start D7(3,6) north → D5(3,4), R→east E5-F5(5,4), L→north F4-F3(5,2), R→east G3(6,2) = goal
  {
    id: 8,
    name: 'De Trap',
    gridSize: { rows: 7, cols: 7 },
    startX: 3, startY: 6,
    startDirection: 'north',
    goalX: 6, goalY: 2,
    maxCommands: 10,
    optimalSteps: 10,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'goal'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'grass'],
      ['grass', 'grass', 'grass', 'path',  'path',  'path',  'grass'],
      ['grass', 'grass', 'grass', 'path',  'tree',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 9: U-turn around water — 3 turns, goal at left border
  {
    id: 9,
    name: 'Over het Water',
    gridSize: { rows: 7, cols: 7 },
    startX: 3, startY: 6,
    startDirection: 'north',
    goalX: 0, goalY: 1,
    maxCommands: 11,
    optimalSteps: 11,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['goal',  'path',  'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'water', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 10: Zigzag — 4 turns
  // FF R F L FF L F R FF (11 steps: 7 fwd + 4 turns)
  // Start D7(3,6) north → D5(3,4), R→east, E5(4,4), L→north, E4-E3(4,2),
  // L→west, D3-C3(2,2), R→north, C2-C1(2,0) = goal
  {
    id: 10,
    name: 'De Omweg',
    gridSize: { rows: 7, cols: 7 },
    startX: 3, startY: 6,
    startDirection: 'north',
    goalX: 2, goalY: 0,
    maxCommands: 13,
    optimalSteps: 13,
    grid: [
      ['grass', 'grass', 'goal',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'tree',  'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass'],
    ],
  },

  // --- Levels 11-15: 9×9 grids, complex routes ---

  // Level 11: S-curve on big grid — 3 turns, goal at top border
  {
    id: 11,
    name: 'Het Grote Bos',
    gridSize: { rows: 9, cols: 9 },
    startX: 4, startY: 8,
    startDirection: 'north',
    goalX: 2, goalY: 0,
    maxCommands: 12,
    optimalSteps: 12,
    grid: [
      ['grass', 'grass', 'goal',  'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'path',  'path',  'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'rock',  'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 12: Staircase — 4 turns, goal at top border
  {
    id: 12,
    name: 'Rots Slalom',
    gridSize: { rows: 9, cols: 9 },
    startX: 4, startY: 8,
    startDirection: 'north',
    goalX: 4, goalY: 0,
    maxCommands: 16,
    optimalSteps: 16,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'goal',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'rock',  'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 13: Navigate around water — 4 turns
  {
    id: 13,
    name: 'Rivier Kruising',
    gridSize: { rows: 9, cols: 9 },
    startX: 4, startY: 8,
    startDirection: 'north',
    goalX: 4, goalY: 0,
    maxCommands: 16,
    optimalSteps: 16,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'goal',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'water', 'grass', 'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'path',  'path',  'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 14: Winding path — 5 turns, goal at right border
  {
    id: 14,
    name: 'Bos Doolhof',
    gridSize: { rows: 9, cols: 9 },
    startX: 4, startY: 8,
    startDirection: 'north',
    goalX: 8, goalY: 2,
    maxCommands: 15,
    optimalSteps: 15,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path',  'path',  'goal'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'tree',  'path',  'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'path',  'path',  'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass', 'grass'],
    ],
  },

  // Level 15: Master route — 6 turns, winding through obstacles
  // Start E9(4,8) north. FF → (4,6). L→west. FF → (2,6). R→north. FFF → (2,3).
  // R→east. FFF → (5,3). L→north. FF → (5,1). L→west. F → (4,1). = goal
  // FF L FF R FFF R FFF L FF L F = 16 steps: 10 fwd + 6 turns... recount
  // FF=2, L=1, FF=2, R=1, FFF=3, R=1, FFF=3, L=1, FF=2, L=1, F=1 = 18. Too many.
  // Simpler: FF R F L FFF R F L FF R F = 14 steps with 5 turns... need 6
  // Let me try:
  // F R F L FF R FF L F R F L F = 14 steps: 8 fwd + 6 turns
  // Start (4,8) north. F → (4,7). R→east. F → (5,7). L→north. FF → (5,5).
  // R→east. FF → (7,5). L→north. F → (7,4). R→east. F → (8,4). L→north. F → (8,3). = goal
  {
    id: 15,
    name: 'Meester Route',
    gridSize: { rows: 9, cols: 9 },
    startX: 4, startY: 8,
    startDirection: 'north',
    goalX: 8, goalY: 3,
    maxCommands: 15,
    optimalSteps: 15,
    grid: [
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'goal'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'grass', 'path',  'path'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'path',  'path',  'grass'],
      ['grass', 'grass', 'grass', 'grass', 'grass', 'path',  'water', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'path',  'path',  'grass', 'grass', 'grass'],
      ['grass', 'grass', 'grass', 'grass', 'start', 'grass', 'grass', 'grass', 'grass'],
    ],
  },
];

export function getLevel(index) {
  if (index < 0 || index >= LEVELS.length) return null;
  return LEVELS[index];
}

export function getTotalLevels() {
  return LEVELS.length;
}

export function getAllLevels() {
  return LEVELS;
}
