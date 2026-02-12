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

export const SCREENS = {
  HOME: 'home',
  GAME_MENU: 'game-menu',
  PLAYING: 'playing',
};
