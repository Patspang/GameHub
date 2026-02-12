// Main Letter Jager game component
// Manages game state, game loop, input handling, and win/lose conditions
// Phase 4: includes sound effects, confetti, hit flash, and high score detection

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord, splitWordIntoLetters } from '../../../utils/wordLists';
import { getMaze, getPlayerSpawn, placeLetters, placeCreatures } from '../../../utils/mazeGenerator';
import { GAME_CONFIG, DIFFICULTY } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { Maze } from './Maze';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { TouchControls } from './TouchControls';
import { Confetti } from './Confetti';
import { FlashOverlay } from './FlashOverlay';
import { Button } from '../../common/Button';

// Movement deltas for each direction
const MOVE_DELTA = {
  up: { row: -1, col: 0 },
  down: { row: 1, col: 0 },
  left: { row: 0, col: -1 },
  right: { row: 0, col: 1 },
};

const OPPOSITE_DIR = { up: 'down', down: 'up', left: 'right', right: 'left' };

export function LetterJager({ difficulty, onExit }) {
  // Game state
  const [gameStatus, setGameStatus] = useState('ready'); // ready | playing | won | lost
  const [maze, setMaze] = useState(null);
  const [player, setPlayer] = useState(null);
  const [letters, setLetters] = useState([]);
  const [creatures, setCreatures] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(GAME_CONFIG.STARTING_LIVES);
  const [currentWord, setCurrentWord] = useState('');
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [isInvincible, setIsInvincible] = useState(false);
  const [highScores, setHighScores] = useLocalStorage('letter-jager-scores', {});
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [hitCount, setHitCount] = useState(0); // increments on each hit to trigger flash

  // Sound effects
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  useEffect(() => { playSoundRef.current = playSound; }, [playSound]);

  // Refs for game loop access to latest state
  const gameStatusRef = useRef(gameStatus);
  const playerRef = useRef(player);
  const creaturesRef = useRef(creatures);
  const lettersRef = useRef(letters);
  const livesRef = useRef(lives);
  const isInvincibleRef = useRef(isInvincible);
  const collectedRef = useRef(collectedLetters);
  const scoreRef = useRef(score);
  const pendingDirection = useRef(null);

  // Keep refs in sync
  useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);
  useEffect(() => { playerRef.current = player; }, [player]);
  useEffect(() => { creaturesRef.current = creatures; }, [creatures]);
  useEffect(() => { lettersRef.current = letters; }, [letters]);
  useEffect(() => { livesRef.current = lives; }, [lives]);
  useEffect(() => { isInvincibleRef.current = isInvincible; }, [isInvincible]);
  useEffect(() => { collectedRef.current = collectedLetters; }, [collectedLetters]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  // Initialize game
  const initGame = useCallback(() => {
    const word = getRandomWord(difficulty);
    const mazeLayout = getMaze(difficulty);
    const spawn = getPlayerSpawn(mazeLayout);
    const wordLetters = splitWordIntoLetters(word);
    const placedLetters = placeLetters(mazeLayout, wordLetters, spawn);
    const creatureCount = GAME_CONFIG.CREATURE_COUNT[difficulty];
    const placedCreatures = placeCreatures(mazeLayout, creatureCount, spawn);

    setCurrentWord(word);
    setMaze(mazeLayout);
    setPlayer({ row: spawn.row, col: spawn.col, direction: 'right' });
    setLetters(placedLetters);
    setCreatures(placedCreatures);
    setScore(0);
    setLives(GAME_CONFIG.STARTING_LIVES);
    setCollectedLetters([]);
    setIsInvincible(false);
    setIsNewHighScore(false);
    setHitCount(0);
    setGameStatus('playing');
  }, [difficulty]);

  // Touch D-pad handler
  const handleDirection = useCallback((dir) => {
    if (gameStatusRef.current === 'playing') {
      pendingDirection.current = dir;
    }
  }, []);

  // Keyboard input (still works on desktop)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatusRef.current !== 'playing') return;

      const dirMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
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

  // Check if a position is walkable
  const canMoveTo = useCallback((mazeLayout, row, col) => {
    if (row < 0 || row >= mazeLayout.length) return false;
    if (col < 0 || col >= mazeLayout[0].length) return false;
    return mazeLayout[row][col] === 0;
  }, []);

  // Move creatures with simple AI
  const moveCreature = useCallback((creature, mazeLayout) => {
    const { row, col, direction } = creature;
    const delta = MOVE_DELTA[direction];
    const newRow = row + delta.row;
    const newCol = col + delta.col;

    // Try to continue in current direction
    if (canMoveTo(mazeLayout, newRow, newCol)) {
      // Random chance to turn at intersections
      const possibleDirs = Object.keys(MOVE_DELTA).filter(
        (d) => d !== OPPOSITE_DIR[direction] && canMoveTo(mazeLayout, row + MOVE_DELTA[d].row, col + MOVE_DELTA[d].col)
      );
      if (possibleDirs.length > 1 && Math.random() < 0.3) {
        const randomDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
        return {
          ...creature,
          row: row + MOVE_DELTA[randomDir].row,
          col: col + MOVE_DELTA[randomDir].col,
          direction: randomDir,
        };
      }
      return { ...creature, row: newRow, col: newCol };
    }

    // Can't continue - pick a new direction (not the opposite)
    const alternatives = Object.keys(MOVE_DELTA).filter(
      (d) => d !== OPPOSITE_DIR[direction] && canMoveTo(mazeLayout, row + MOVE_DELTA[d].row, col + MOVE_DELTA[d].col)
    );

    if (alternatives.length > 0) {
      const newDir = alternatives[Math.floor(Math.random() * alternatives.length)];
      return {
        ...creature,
        row: row + MOVE_DELTA[newDir].row,
        col: col + MOVE_DELTA[newDir].col,
        direction: newDir,
      };
    }

    // Dead end - reverse
    const opposite = OPPOSITE_DIR[direction];
    if (canMoveTo(mazeLayout, row + MOVE_DELTA[opposite].row, col + MOVE_DELTA[opposite].col)) {
      return {
        ...creature,
        row: row + MOVE_DELTA[opposite].row,
        col: col + MOVE_DELTA[opposite].col,
        direction: opposite,
      };
    }

    return creature; // Stuck (shouldn't happen in well-designed mazes)
  }, [canMoveTo]);

  // Game loop
  useEffect(() => {
    if (gameStatus !== 'playing' || !maze) return;

    // Creature speed: move every N ms based on difficulty
    const creatureInterval = {
      [DIFFICULTY.EASY]: 400,
      [DIFFICULTY.NORMAL]: 280,
      [DIFFICULTY.HARD]: 180,
    };

    // Player can move faster
    const playerInterval = 150;

    let lastCreatureMove = 0;
    let lastPlayerMove = 0;
    let animFrameId;

    const tick = (timestamp) => {
      if (gameStatusRef.current !== 'playing') return;

      // Move player
      if (pendingDirection.current && timestamp - lastPlayerMove >= playerInterval) {
        const p = playerRef.current;
        const dir = pendingDirection.current;
        const delta = MOVE_DELTA[dir];
        const newRow = p.row + delta.row;
        const newCol = p.col + delta.col;

        if (canMoveTo(maze, newRow, newCol)) {
          const newPlayer = { row: newRow, col: newCol, direction: dir };
          setPlayer(newPlayer);
          playerRef.current = newPlayer;

          // Check letter collection
          const nextIdx = collectedRef.current.length;
          const currentLetters = lettersRef.current;
          if (nextIdx < currentLetters.length) {
            const targetLetter = currentLetters[nextIdx];
            if (!targetLetter.collected && targetLetter.row === newRow && targetLetter.col === newCol) {
              // Collect the letter
              const updatedLetters = currentLetters.map((l, i) =>
                i === nextIdx ? { ...l, collected: true } : l
              );
              setLetters(updatedLetters);
              lettersRef.current = updatedLetters;

              const newCollected = [...collectedRef.current, targetLetter.letter];
              setCollectedLetters(newCollected);
              collectedRef.current = newCollected;

              const newScore = scoreRef.current + GAME_CONFIG.LETTER_SCORE;
              setScore(newScore);
              scoreRef.current = newScore;

              // Check win condition
              if (newCollected.length === currentLetters.length) {
                const finalScore = newScore + GAME_CONFIG.WORD_COMPLETE_BONUS;
                setScore(finalScore);
                scoreRef.current = finalScore;
                playSoundRef.current('complete');
                setGameStatus('won');
                gameStatusRef.current = 'won';
                return;
              }

              // Play collect sound
              playSoundRef.current('collect');
            }
          }
        } else {
          // Update direction even if we can't move (for visual feedback)
          setPlayer(prev => ({ ...prev, direction: dir }));
        }
        lastPlayerMove = timestamp;
      }

      // Move creatures
      if (timestamp - lastCreatureMove >= creatureInterval[difficulty]) {
        const movedCreatures = creaturesRef.current.map((c) => moveCreature(c, maze));
        setCreatures(movedCreatures);
        creaturesRef.current = movedCreatures;

        // Check creature collision with player
        if (!isInvincibleRef.current) {
          const p = playerRef.current;
          const hit = movedCreatures.some((c) => c.row === p.row && c.col === p.col);
          if (hit) {
            const newLives = livesRef.current - 1;
            setLives(newLives);
            livesRef.current = newLives;
            setHitCount((c) => c + 1); // trigger flash overlay
            playSoundRef.current('hit');

            if (newLives <= 0) {
              setGameStatus('lost');
              gameStatusRef.current = 'lost';
              return;
            }

            // Invincibility period
            setIsInvincible(true);
            isInvincibleRef.current = true;
            setTimeout(() => {
              setIsInvincible(false);
              isInvincibleRef.current = false;
            }, GAME_CONFIG.INVINCIBILITY_DURATION);
          }
        }

        lastCreatureMove = timestamp;
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameStatus, maze, difficulty, canMoveTo, moveCreature]);

  // Save high score on game end
  useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      const currentBest = highScores?.['letter-jager']?.[difficulty] || 0;
      if (score > currentBest) {
        setHighScores((prev) => ({
          ...prev,
          'letter-jager': {
            ...(prev['letter-jager'] || {}),
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
        <div className="text-8xl mb-6">🎯</div>
        <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
          Letter Jager
        </h2>
        <p className="font-body text-lg text-text-secondary text-center mb-2">
          {DUTCH_TEXT.instructions.collectLetters}
        </p>
        <p className="font-body text-md text-text-secondary text-center mb-8">
          {DUTCH_TEXT.instructions.useArrows}
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
        <GameOverScreen
          status={gameStatus}
          score={score}
          word={currentWord}
          isNewHighScore={isNewHighScore}
          onRestart={initGame}
          onExit={onExit}
        />
      </>
    );
  }

  // Playing
  if (!maze || !player) return null;

  return (
    <div className="flex flex-col items-center px-2 py-2 no-select" style={{ touchAction: 'none' }}>
      <FlashOverlay trigger={hitCount} />

      <GameHUD
        score={score}
        lives={lives}
        currentWord={currentWord}
        collectedLetters={collectedLetters}
      />

      <Maze
        layout={maze}
        player={player}
        letters={letters}
        creatures={creatures}
        nextLetterIndex={collectedLetters.length}
        isInvincible={isInvincible}
        onSwipeDirection={handleDirection}
      />

      {/* Touch D-pad for tablet/mobile */}
      <TouchControls onDirection={handleDirection} />

      {/* Quit button below controls */}
      <div className="mt-2">
        <Button variant="accent" size="md" onClick={onExit}>
          {DUTCH_TEXT.game.quit}
        </Button>
      </div>
    </div>
  );
}
