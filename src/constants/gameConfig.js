// Game configuration constants

export const DIFFICULTY = {
  EASY: 'makkelijk',
  NORMAL: 'normaal',
  HARD: 'moeilijk',
};

export const GAME_CONFIG = {
  // Tile size in pixels for maze grid
  TILE_SIZE: 32,

  // Player settings
  PLAYER_SPEED: {
    [DIFFICULTY.EASY]: 2,
    [DIFFICULTY.NORMAL]: 3,
    [DIFFICULTY.HARD]: 3,
  },

  // Creature settings per difficulty
  CREATURE_COUNT: {
    [DIFFICULTY.EASY]: 2,
    [DIFFICULTY.NORMAL]: 3,
    [DIFFICULTY.HARD]: 4,
  },

  CREATURE_SPEED: {
    [DIFFICULTY.EASY]: 1,
    [DIFFICULTY.NORMAL]: 1.5,
    [DIFFICULTY.HARD]: 2,
  },

  // Lives
  STARTING_LIVES: 3,

  // Scoring
  LETTER_SCORE: 100,
  WORD_COMPLETE_BONUS: 500,

  // Invincibility after creature hit (milliseconds)
  INVINCIBILITY_DURATION: 2000,

  // Target FPS
  TARGET_FPS: 60,
};

// Snake-specific configuration
export const SNAKE_CONFIG = {
  GRID_SIZE: {
    [DIFFICULTY.EASY]: { rows: 10, cols: 10 },
    [DIFFICULTY.NORMAL]: { rows: 14, cols: 14 },
    [DIFFICULTY.HARD]: { rows: 18, cols: 18 },
  },
  SPEED: {
    [DIFFICULTY.EASY]: 350,
    [DIFFICULTY.NORMAL]: 250,
    [DIFFICULTY.HARD]: 180,
  },
  NUMBER_RANGE: {
    [DIFFICULTY.EASY]: 5,
    [DIFFICULTY.NORMAL]: 8,
    [DIFFICULTY.HARD]: 10,
  },
  ROUNDS_TO_WIN: {
    [DIFFICULTY.EASY]: 2,
    [DIFFICULTY.NORMAL]: 3,
    [DIFFICULTY.HARD]: 4,
  },
  WALL_WRAPS: {
    [DIFFICULTY.EASY]: true,
    [DIFFICULTY.NORMAL]: false,
    [DIFFICULTY.HARD]: false,
  },
  SELF_COLLISION_KILLS: {
    [DIFFICULTY.EASY]: false,
    [DIFFICULTY.NORMAL]: true,
    [DIFFICULTY.HARD]: true,
  },
  OBSTACLE_COUNT: {
    [DIFFICULTY.EASY]: 0,
    [DIFFICULTY.NORMAL]: 0,
    [DIFFICULTY.HARD]: 8,
  },
  INITIAL_LENGTH: 3,
  NUMBER_SCORE: 100,
  ROUND_COMPLETE_BONUS: 500,
  WRONG_NUMBER_PENALTY: 50,
  STARTING_LIVES: 3,
};

// Tetris-specific configuration
export const TETRIS_CONFIG = {
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: {
    [DIFFICULTY.EASY]: 16,
    [DIFFICULTY.NORMAL]: 18,
    [DIFFICULTY.HARD]: 20,
  },
  BASE_SPEED: {
    [DIFFICULTY.EASY]: 800,
    [DIFFICULTY.NORMAL]: 600,
    [DIFFICULTY.HARD]: 400,
  },
  START_LEVEL: {
    [DIFFICULTY.EASY]: 1,
    [DIFFICULTY.NORMAL]: 1,
    [DIFFICULTY.HARD]: 3,
  },
  SPEED_DECAY: 0.9,
  MIN_SPEED: 100,
  LINES_PER_LEVEL: 10,
  USE_ALL_PIECES: {
    [DIFFICULTY.EASY]: false,
    [DIFFICULTY.NORMAL]: true,
    [DIFFICULTY.HARD]: true,
  },
  LINE_SCORES: [0, 100, 300, 500, 800],
  DAS_INITIAL: 170,
  DAS_REPEAT: 50,
};

// Letter Leren configuration
export const LETTER_LEREN_CONFIG = {
  WORDS_PER_ROUND: 5,
  TILE_COUNT: 10,
  CELEBRATION_DELAY: 2000,
  SCORING: {
    EASY_WORD: 100,
    NORMAL_WORD: 150,
    HARD_LETTER: 50,
    HARD_WORD_BONUS: 300,
  },
};

// Muntenkluis (addition math game) configuration
export const MUNTENKLUIS_CONFIG = {
  SUMS_PER_ROUND: 10,
  CELEBRATION_DELAY: 1500,
  MAX_SUM: {
    [DIFFICULTY.EASY]: 5,
    [DIFFICULTY.NORMAL]: 10,
    [DIFFICULTY.HARD]: 20,
  },
  SCORING: {
    [DIFFICULTY.EASY]: 100,
    [DIFFICULTY.NORMAL]: 150,
    [DIFFICULTY.HARD]: 200,
  },
};

// Sudoku configuration
export const SUDOKU_CONFIG = {
  PUZZLES_PER_SESSION: {
    [DIFFICULTY.EASY]: 3,
    [DIFFICULTY.NORMAL]: 2,
    [DIFFICULTY.HARD]: 1,
  },
  GRID_PARAMS: {
    [DIFFICULTY.EASY]: { gridSize: 4, boxRows: 2, boxCols: 2 },
    [DIFFICULTY.NORMAL]: { gridSize: 6, boxRows: 2, boxCols: 3 },
    [DIFFICULTY.HARD]: { gridSize: 9, boxRows: 3, boxCols: 3 },
  },
  CELLS_TO_REMOVE: {
    [DIFFICULTY.EASY]: 7,
    [DIFFICULTY.NORMAL]: 16,
    [DIFFICULTY.HARD]: 48,
  },
  CELEBRATION_DELAY: 1500,
  SCORING: {
    CELL_CORRECT: {
      [DIFFICULTY.EASY]: 50,
      [DIFFICULTY.NORMAL]: 30,
      [DIFFICULTY.HARD]: 20,
    },
    PUZZLE_COMPLETE_BONUS: {
      [DIFFICULTY.EASY]: 200,
      [DIFFICULTY.NORMAL]: 300,
      [DIFFICULTY.HARD]: 500,
    },
  },
};

export const SCREENS = {
  HOME: 'home',
  GAME_MENU: 'game-menu',
  PLAYING: 'playing',
};
