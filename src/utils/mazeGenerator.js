// Maze layouts for each difficulty level
// 0 = path, 1 = wall
// Player starts at position marked in SPAWN_POINTS

// Simple open layout with few walls - easy for young children
const EASY_MAZES = [
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,0,0,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,0,1,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,0,0,0,0,0,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,1,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
];

// Traditional pac-man style with more corridors
const NORMAL_MAZES = [
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,0,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,1,0,1,0,0,0,0,1],
    [1,0,1,0,1,1,0,0,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,0,1,0,0,0,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,0,1,1,0,1,0,1,0,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,1,1,0,1,0,1,0,1,1,0,1,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,0,0,1,0,1,0,0,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
];

// Complex maze with many corridors and dead ends
const HARD_MAZES = [
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,0,1,1,0,1,1,0,1,0,1,0,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,0,0,1,0,0,0,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1],
    [1,0,0,0,1,1,1,0,1,0,1,1,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,1],
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,1,1,1,0,1,0,1,1,1,0,0,0,1],
    [1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,1,1],
    [1,0,0,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
    [1,0,1,1,1,0,0,0,1,0,0,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  ],
];

const MAZE_SETS = {
  makkelijk: EASY_MAZES,
  normaal: NORMAL_MAZES,
  moeilijk: HARD_MAZES,
};

// Get a random maze for the given difficulty
export function getMaze(difficulty) {
  const mazes = MAZE_SETS[difficulty];
  const maze = mazes[Math.floor(Math.random() * mazes.length)];
  // Return a deep copy so mutations don't affect the originals
  return maze.map(row => [...row]);
}

// Get all open (path) positions in a maze
export function getOpenPositions(maze) {
  const positions = [];
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 0) {
        positions.push({ row, col });
      }
    }
  }
  return positions;
}

// Player always spawns at center-ish open position
export function getPlayerSpawn(maze) {
  const rows = maze.length;
  const cols = maze[0].length;
  const centerRow = Math.floor(rows / 2);
  const centerCol = Math.floor(cols / 2);

  // Find nearest open cell to center
  if (maze[centerRow][centerCol] === 0) {
    return { row: centerRow, col: centerCol };
  }

  // Spiral outward from center to find open cell
  for (let radius = 1; radius < Math.max(rows, cols); radius++) {
    for (let dr = -radius; dr <= radius; dr++) {
      for (let dc = -radius; dc <= radius; dc++) {
        const r = centerRow + dr;
        const c = centerCol + dc;
        if (r >= 0 && r < rows && c >= 0 && c < cols && maze[r][c] === 0) {
          return { row: r, col: c };
        }
      }
    }
  }

  return { row: 1, col: 1 };
}

// Place letters at random open positions, avoiding player spawn area
export function placeLetters(maze, letters, playerSpawn) {
  const open = getOpenPositions(maze).filter(
    (pos) => Math.abs(pos.row - playerSpawn.row) + Math.abs(pos.col - playerSpawn.col) > 2
  );

  // Shuffle and pick positions for each letter
  const shuffled = open.sort(() => Math.random() - 0.5);
  return letters.map((letter, i) => ({
    id: `letter-${i}`,
    letter,
    row: shuffled[i % shuffled.length].row,
    col: shuffled[i % shuffled.length].col,
    collected: false,
  }));
}

// Place creatures at corners / edges of maze
export function placeCreatures(maze, count, playerSpawn) {
  const open = getOpenPositions(maze).filter(
    (pos) => Math.abs(pos.row - playerSpawn.row) + Math.abs(pos.col - playerSpawn.col) > 3
  );

  const CREATURE_COLORS = ['creature-1', 'creature-2', 'creature-3', 'creature-4'];
  const DIRECTIONS = ['up', 'down', 'left', 'right'];

  // Place creatures spread out across the maze
  const sorted = open.sort((a, b) => {
    const distA = Math.abs(a.row - playerSpawn.row) + Math.abs(a.col - playerSpawn.col);
    const distB = Math.abs(b.row - playerSpawn.row) + Math.abs(b.col - playerSpawn.col);
    return distB - distA;
  });

  return Array.from({ length: count }, (_, i) => ({
    id: `creature-${i}`,
    row: sorted[i % sorted.length].row,
    col: sorted[i % sorted.length].col,
    color: CREATURE_COLORS[i % CREATURE_COLORS.length],
    direction: DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
  }));
}
