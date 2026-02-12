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

export const SCREENS = {
  HOME: 'home',
  GAME_MENU: 'game-menu',
  PLAYING: 'playing',
};
