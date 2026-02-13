// Main Snake game component (Tel Slang - Counting Snake)
// Educational variant: eat numbers 1-N in ascending order
// Follows the same architecture as LetterJager: rAF game loop with refs for state

import { useState, useEffect, useCallback, useRef } from 'react';
import { SNAKE_CONFIG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { SnakeBoard } from './SnakeBoard';
import { SnakeHUD } from './SnakeHUD';
import { SnakeGameOver } from './SnakeGameOver';
import { TouchControls } from '../../common/TouchControls';
import { Confetti } from '../../common/Confetti';
import { FlashOverlay } from '../../common/FlashOverlay';
import { Button } from '../../common/Button';

const MOVE_DELTA = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const OPPOSITE_DIR = { up: 'down', down: 'up', left: 'right', right: 'left' };

// Place numbers at random empty cells on the grid
function placeNumbers(gridSize, occupiedSet, count) {
  const available = [];
  for (let r = 0; r < gridSize.rows; r++) {
    for (let c = 0; c < gridSize.cols; c++) {
      if (!occupiedSet.has(`${r},${c}`)) {
        available.push({ row: r, col: c });
      }
    }
  }
  // Shuffle available positions
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  return Array.from({ length: count }, (_, i) => ({
    id: `num-${i + 1}`,
    value: i + 1,
    row: available[i].row,
    col: available[i].col,
    eaten: false,
  }));
}

// Place obstacles away from snake spawn
// Never place on the spawn row (snake starts moving right along it)
function placeObstacles(gridSize, count, spawnSet) {
  if (count === 0) return [];
  const available = [];
  const centerRow = Math.floor(gridSize.rows / 2);
  for (let r = 0; r < gridSize.rows; r++) {
    // Exclude the entire spawn row so the snake never hits an obstacle immediately
    if (r === centerRow) continue;
    for (let c = 0; c < gridSize.cols; c++) {
      if (spawnSet.has(`${r},${c}`)) continue;
      available.push({ row: r, col: c });
    }
  }
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  return available.slice(0, count);
}

export function Snake({ difficulty, onExit, onChangeDifficulty }) {
  const [gameStatus, setGameStatus] = useState('ready');
  const [snake, setSnake] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [targetNumber, setTargetNumber] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(SNAKE_CONFIG.STARTING_LIVES);
  const [obstacles, setObstacles] = useState([]);
  const [hitCount, setHitCount] = useState(0);
  const [roundPaused, setRoundPaused] = useState(false);
  const [highScores, setHighScores] = useLocalStorage('gamehub-scores', {});
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  useEffect(() => { playSoundRef.current = playSound; }, [playSound]);

  // Refs for game loop
  const gameStatusRef = useRef(gameStatus);
  const snakeRef = useRef(snake);
  const numbersRef = useRef(numbers);
  const targetNumberRef = useRef(targetNumber);
  const currentRoundRef = useRef(currentRound);
  const scoreRef = useRef(score);
  const livesRef = useRef(lives);
  const obstaclesRef = useRef(obstacles);
  const roundPausedRef = useRef(roundPaused);
  const directionRef = useRef('right');
  const pendingDirection = useRef(null);
  const growthPending = useRef(0);

  // Keep refs in sync
  useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { numbersRef.current = numbers; }, [numbers]);
  useEffect(() => { targetNumberRef.current = targetNumber; }, [targetNumber]);
  useEffect(() => { currentRoundRef.current = currentRound; }, [currentRound]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { obstaclesRef.current = obstacles; }, [obstacles]);
  useEffect(() => { roundPausedRef.current = roundPaused; }, [roundPaused]);

  const gridSize = SNAKE_CONFIG.GRID_SIZE[difficulty];
  const maxNumber = SNAKE_CONFIG.NUMBER_RANGE[difficulty];
  const totalRounds = SNAKE_CONFIG.ROUNDS_TO_WIN[difficulty];

  // Initialize or restart the game
  const initGame = useCallback(() => {
    const centerRow = Math.floor(gridSize.rows / 2);
    const centerCol = Math.floor(gridSize.cols / 2);

    // Create initial snake in the center, facing right
    const initialSnake = [];
    for (let i = 0; i < SNAKE_CONFIG.INITIAL_LENGTH; i++) {
      initialSnake.push({ row: centerRow, col: centerCol - i });
    }

    const snakeSet = new Set(initialSnake.map((s) => `${s.row},${s.col}`));
    const obs = placeObstacles(gridSize, SNAKE_CONFIG.OBSTACLE_COUNT[difficulty], snakeSet);
    const obsSet = new Set(obs.map((o) => `${o.row},${o.col}`));
    const occupied = new Set([...snakeSet, ...obsSet]);
    const nums = placeNumbers(gridSize, occupied, maxNumber);

    setSnake(initialSnake);
    setObstacles(obs);
    setNumbers(nums);
    setTargetNumber(1);
    setCurrentRound(1);
    setScore(0);
    setLives(SNAKE_CONFIG.STARTING_LIVES);
    setHitCount(0);
    setRoundPaused(false);
    setIsNewHighScore(false);
    directionRef.current = 'right';
    pendingDirection.current = null;
    growthPending.current = 0;
    setGameStatus('playing');
  }, [difficulty, gridSize, maxNumber]);

  // Start a new round (keep snake, reset numbers)
  const startNewRound = useCallback(() => {
    const currentSnake = snakeRef.current;
    const currentObs = obstaclesRef.current;
    const occupied = new Set([
      ...currentSnake.map((s) => `${s.row},${s.col}`),
      ...currentObs.map((o) => `${o.row},${o.col}`),
    ]);
    const nums = placeNumbers(gridSize, occupied, maxNumber);

    setNumbers(nums);
    numbersRef.current = nums;
    setTargetNumber(1);
    targetNumberRef.current = 1;
    setCurrentRound((r) => r + 1);
    currentRoundRef.current = currentRoundRef.current + 1;
    setRoundPaused(false);
    roundPausedRef.current = false;
  }, [gridSize, maxNumber]);

  // Direction input handler (shared by keyboard, touch, and swipe)
  const handleDirection = useCallback((dir) => {
    if (gameStatusRef.current === 'playing') {
      pendingDirection.current = dir;
    }
  }, []);

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatusRef.current !== 'playing') return;
      const dirMap = {
        ArrowUp: 'up', ArrowDown: 'down',
        ArrowLeft: 'left', ArrowRight: 'right',
      };
      const dir = dirMap[e.key];
      if (dir) {
        e.preventDefault();
        pendingDirection.current = dir;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle death (lose a life or game over)
  const handleDeath = useCallback(() => {
    const newLives = livesRef.current - 1;
    setLives(newLives);
    livesRef.current = newLives;
    setHitCount((c) => c + 1);
    playSoundRef.current('hit');

    if (newLives <= 0) {
      setGameStatus('lost');
      gameStatusRef.current = 'lost';
    } else {
      // Respawn: reset snake to center, keep score and round
      const centerRow = Math.floor(gridSize.rows / 2);
      const centerCol = Math.floor(gridSize.cols / 2);
      const newSnake = [];
      for (let i = 0; i < SNAKE_CONFIG.INITIAL_LENGTH; i++) {
        newSnake.push({ row: centerRow, col: centerCol - i });
      }
      setSnake(newSnake);
      snakeRef.current = newSnake;
      directionRef.current = 'right';
      pendingDirection.current = null;
      growthPending.current = 0;
    }
  }, [gridSize]);

  // Game loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const speed = SNAKE_CONFIG.SPEED[difficulty];
    let lastMove = 0;
    let animFrameId;

    const tick = (timestamp) => {
      if (gameStatusRef.current !== 'playing') return;
      if (roundPausedRef.current) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      if (timestamp - lastMove < speed) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }
      lastMove = timestamp;

      const currentSnake = snakeRef.current;
      const head = currentSnake[0];

      // Get direction (prevent 180-degree reversal)
      let newDir = pendingDirection.current || directionRef.current;
      if (newDir === OPPOSITE_DIR[directionRef.current] && currentSnake.length > 1) {
        newDir = directionRef.current;
      }
      directionRef.current = newDir;

      const delta = MOVE_DELTA[newDir];
      let newRow = head.row + delta.row;
      let newCol = head.col + delta.col;

      // Wall handling
      if (SNAKE_CONFIG.WALL_WRAPS[difficulty]) {
        newRow = (newRow + gridSize.rows) % gridSize.rows;
        newCol = (newCol + gridSize.cols) % gridSize.cols;
      } else {
        if (newRow < 0 || newRow >= gridSize.rows || newCol < 0 || newCol >= gridSize.cols) {
          handleDeath();
          animFrameId = requestAnimationFrame(tick);
          return;
        }
      }

      // Obstacle collision
      if (obstaclesRef.current.some((o) => o.row === newRow && o.col === newCol)) {
        handleDeath();
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      // Self-collision (check against body excluding tail since it will move)
      if (SNAKE_CONFIG.SELF_COLLISION_KILLS[difficulty]) {
        const bodyToCheck = growthPending.current > 0
          ? currentSnake
          : currentSnake.slice(0, -1);
        if (bodyToCheck.some((s) => s.row === newRow && s.col === newCol)) {
          handleDeath();
          animFrameId = requestAnimationFrame(tick);
          return;
        }
      }

      const newHead = { row: newRow, col: newCol };

      // Check number collision
      const currentNumbers = numbersRef.current;
      const hitNumber = currentNumbers.find(
        (n) => !n.eaten && n.row === newRow && n.col === newCol
      );

      if (hitNumber) {
        if (hitNumber.value === targetNumberRef.current) {
          // Correct number!
          playSoundRef.current('collect');
          const updatedNumbers = currentNumbers.map((n) =>
            n.id === hitNumber.id ? { ...n, eaten: true } : n
          );
          setNumbers(updatedNumbers);
          numbersRef.current = updatedNumbers;

          const roundBonus = (currentRoundRef.current - 1) * 20;
          const newScore = scoreRef.current + SNAKE_CONFIG.NUMBER_SCORE + roundBonus;
          setScore(newScore);
          scoreRef.current = newScore;

          growthPending.current++;

          const nextTarget = targetNumberRef.current + 1;
          if (nextTarget > maxNumber) {
            // Round complete
            playSoundRef.current('complete');
            const completionScore = newScore + SNAKE_CONFIG.ROUND_COMPLETE_BONUS;
            setScore(completionScore);
            scoreRef.current = completionScore;

            if (currentRoundRef.current >= totalRounds) {
              // Game won!
              setGameStatus('won');
              gameStatusRef.current = 'won';
              animFrameId = requestAnimationFrame(tick);
              return;
            }

            // Pause and start next round
            setRoundPaused(true);
            roundPausedRef.current = true;
            setTimeout(() => startNewRound(), 1500);
          } else {
            setTargetNumber(nextTarget);
            targetNumberRef.current = nextTarget;
          }
        } else {
          // Wrong number!
          playSoundRef.current('wrong');
          setHitCount((c) => c + 1);
          const newScore = Math.max(0, scoreRef.current - SNAKE_CONFIG.WRONG_NUMBER_PENALTY);
          setScore(newScore);
          scoreRef.current = newScore;

          // Shrink snake by 1 (minimum length 1)
          if (currentSnake.length > 1) {
            const shrunkSnake = currentSnake.slice(0, -1);
            setSnake(shrunkSnake);
            snakeRef.current = shrunkSnake;
          }
        }
      }

      // Move snake: prepend new head
      let newSnake = [newHead, ...snakeRef.current];
      if (growthPending.current > 0) {
        growthPending.current--;
      } else {
        newSnake = newSnake.slice(0, -1);
      }

      setSnake(newSnake);
      snakeRef.current = newSnake;

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameStatus, difficulty, gridSize, maxNumber, totalRounds, handleDeath, startNewRound]);

  // Save high score on game end
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const currentBest = highScores?.['snake']?.[difficulty] || 0;
      if (score > currentBest) {
        setHighScores((prev) => ({
          ...prev,
          'snake': {
            ...(prev['snake'] || {}),
            [difficulty]: score,
          },
        }));
        setIsNewHighScore(true);
        playSound('highscore');
      }
    }
  }, [gameStatus, score, difficulty, highScores, setHighScores, playSound]);

  // Ready screen
  if (gameStatus === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="text-8xl mb-6">🐍</div>
        <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
          {DUTCH_TEXT.snake.name}
        </h2>
        <p className="font-body text-lg text-text-secondary text-center mb-2">
          {DUTCH_TEXT.snake.instructions.howToPlay}
        </p>
        <p className="font-body text-md text-text-secondary text-center mb-8">
          {DUTCH_TEXT.snake.instructions.useArrows}
        </p>
        <Button variant="success" onClick={initGame}>
          🎮 {DUTCH_TEXT.menu.startGame}
        </Button>
      </div>
    );
  }

  // Game over / win screen
  if (gameStatus === 'won' || gameStatus === 'lost') {
    return (
      <>
        {gameStatus === 'won' && <Confetti />}
        <SnakeGameOver
          status={gameStatus}
          score={score}
          currentRound={Math.min(currentRound, totalRounds)}
          totalRounds={totalRounds}
          isNewHighScore={isNewHighScore}
          onRestart={initGame}
          onExit={onExit}
          onChangeDifficulty={onChangeDifficulty}
        />
      </>
    );
  }

  // Playing
  return (
    <div className="flex flex-col items-center px-2 py-2 no-select" style={{ touchAction: 'none' }}>
      <FlashOverlay trigger={hitCount} />

      <SnakeHUD
        score={score}
        targetNumber={targetNumber}
        maxNumber={maxNumber}
        currentRound={currentRound}
        totalRounds={totalRounds}
      />

      {/* Round complete banner */}
      {roundPaused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30
          bg-primary-yellow text-text-primary font-display font-bold text-2xl
          px-8 py-4 rounded-2xl shadow-xl animate-round-banner">
          ⭐ {DUTCH_TEXT.snake.feedback.roundComplete} ⭐
        </div>
      )}

      <SnakeBoard
        gridSize={gridSize}
        snake={snake}
        numbers={numbers}
        targetNumber={targetNumber}
        obstacles={obstacles}
        onSwipeDirection={handleDirection}
      />

      <TouchControls onDirection={handleDirection} />

      <div className="mt-2">
        <Button variant="accent" size="md" onClick={onExit}>
          {DUTCH_TEXT.game.quit}
        </Button>
      </div>
    </div>
  );
}
