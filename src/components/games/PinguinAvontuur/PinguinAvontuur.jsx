// Pinguïn Avontuur — penguin ice maze game
// Navigate the penguin through an ice maze, collect numbered fish in order, reach the sea
// No enemies, no lose condition — pure navigation + counting
// Uses RAF game loop with refs (same pattern as LetterJager)

import { useState, useEffect, useCallback, useRef } from 'react';
import { generateIceMaze, getPenguinSpawn, getSeaExit, placeFish } from '../../../utils/mazeGeneratorIce';
import { PINGUIN_CONFIG, DIFFICULTY } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { IceMaze } from './IceMaze';
import { PinguinHUD } from './PinguinHUD';
import { PinguinGameOver } from './PinguinGameOver';
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

const T = DUTCH_TEXT.pinguinAvontuur;

export function PinguinAvontuur({ difficulty, onExit, onChangeDifficulty }) {
  const [gameStatus, setGameStatus] = useState('ready');
  const [maze, setMaze] = useState(null);
  const [penguin, setPenguin] = useState(null);
  const [fish, setFish] = useState([]);
  const [seaExit, setSeaExit] = useState(null);
  const [score, setScore] = useState(0);
  const [fishCollected, setFishCollected] = useState(0);
  const [shakeCount, setShakeCount] = useState(0);
  const [highScores, setHighScores] = useLocalStorage('gamehub-scores', {});
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  useEffect(() => { playSoundRef.current = playSound; }, [playSound]);

  // Refs for RAF loop access
  const gameStatusRef = useRef(gameStatus);
  const penguinRef = useRef(penguin);
  const fishRef = useRef(fish);
  const seaExitRef = useRef(seaExit);
  const scoreRef = useRef(score);
  const fishCollectedRef = useRef(fishCollected);
  const pendingDirection = useRef(null);

  // Keep refs in sync
  useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);
  useEffect(() => { penguinRef.current = penguin; }, [penguin]);
  useEffect(() => { fishRef.current = fish; }, [fish]);
  useEffect(() => { seaExitRef.current = seaExit; }, [seaExit]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { fishCollectedRef.current = fishCollected; }, [fishCollected]);

  const totalFish = PINGUIN_CONFIG.FISH_COUNT[difficulty];

  // Initialize game
  const initGame = useCallback(() => {
    const gridSize = PINGUIN_CONFIG.GRID_SIZE[difficulty];
    const extraWalls = PINGUIN_CONFIG.EXTRA_WALLS_TO_REMOVE[difficulty];
    const { maze: mazeGrid, rows, cols } = generateIceMaze(gridSize.rows, gridSize.cols, extraWalls);

    const spawn = getPenguinSpawn(mazeGrid);
    const exit = getSeaExit(mazeGrid, rows, cols);
    const fishList = placeFish(mazeGrid, PINGUIN_CONFIG.FISH_COUNT[difficulty], spawn, exit, rows, cols);

    setMaze(mazeGrid);
    setPenguin({ row: spawn.row, col: spawn.col, direction: 'right' });
    setFish(fishList);
    setSeaExit(exit);
    setScore(0);
    setFishCollected(0);
    setShakeCount(0);
    setIsNewHighScore(false);
    setFeedbackMsg(null);
    setGameStatus('playing');
  }, [difficulty]);

  // Direction input handler
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

  // Check if position is walkable
  const canMoveTo = useCallback((mazeGrid, row, col) => {
    if (row < 0 || row >= mazeGrid.length) return false;
    if (col < 0 || col >= mazeGrid[0].length) return false;
    return mazeGrid[row][col] === 0;
  }, []);

  // Show brief feedback message
  const showFeedback = useCallback((msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 1200);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameStatus !== 'playing' || !maze) return;

    let lastPlayerMove = 0;
    let animFrameId;

    const tick = (timestamp) => {
      if (gameStatusRef.current !== 'playing') return;

      // Move penguin
      if (pendingDirection.current && timestamp - lastPlayerMove >= PINGUIN_CONFIG.PLAYER_SPEED) {
        const p = penguinRef.current;
        const dir = pendingDirection.current;
        const delta = MOVE_DELTA[dir];
        const newRow = p.row + delta.row;
        const newCol = p.col + delta.col;

        if (canMoveTo(maze, newRow, newCol)) {
          const newPenguin = { row: newRow, col: newCol, direction: dir };
          setPenguin(newPenguin);
          penguinRef.current = newPenguin;

          // Check fish collection
          const currentFish = fishRef.current;
          const collected = fishCollectedRef.current;
          const nextNumber = collected + 1;

          for (let i = 0; i < currentFish.length; i++) {
            const f = currentFish[i];
            if (!f.collected && f.row === newRow && f.col === newCol) {
              if (f.number === nextNumber) {
                // Correct fish — collect it
                const updatedFish = currentFish.map((item, idx) =>
                  idx === i ? { ...item, collected: true } : item
                );
                setFish(updatedFish);
                fishRef.current = updatedFish;

                const newCollected = collected + 1;
                setFishCollected(newCollected);
                fishCollectedRef.current = newCollected;

                const newScore = scoreRef.current + PINGUIN_CONFIG.FISH_SCORE;
                setScore(newScore);
                scoreRef.current = newScore;

                playSoundRef.current('collect');

                // Check if all fish collected
                if (newCollected >= PINGUIN_CONFIG.FISH_COUNT[difficulty]) {
                  showFeedback(T.feedback.allFishCollected);
                }
              } else {
                // Wrong fish — shake feedback, no penalty
                setShakeCount((c) => c + 1);
                playSoundRef.current('wrong');
              }
              break;
            }
          }

          // Check sea exit
          const exit = seaExitRef.current;
          if (exit && newRow === exit.row && newCol === exit.col) {
            if (fishCollectedRef.current >= PINGUIN_CONFIG.FISH_COUNT[difficulty]) {
              // Win!
              const finalScore = scoreRef.current + PINGUIN_CONFIG.COMPLETION_BONUS;
              setScore(finalScore);
              scoreRef.current = finalScore;
              playSoundRef.current('complete');
              setGameStatus('won');
              gameStatusRef.current = 'won';
              return;
            }
          }
        } else {
          // Update direction even if can't move
          setPenguin((prev) => ({ ...prev, direction: dir }));
        }

        lastPlayerMove = timestamp;
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameStatus, maze, difficulty, canMoveTo, showFeedback]);

  // Save high score on win
  useEffect(() => {
    if (gameStatus === 'won') {
      const currentBest = highScores?.['pinguin-avontuur']?.[difficulty] || 0;
      if (score > currentBest) {
        setHighScores((prev) => ({
          ...prev,
          'pinguin-avontuur': {
            ...(prev['pinguin-avontuur'] || {}),
            [difficulty]: score,
          },
        }));
        setIsNewHighScore(true);
        playSound('highscore');
      }
    }
  }, [gameStatus, score, difficulty, highScores, setHighScores, playSound]);

  // --- Ready screen ---
  if (gameStatus === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="text-8xl mb-6">🐧</div>
        <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
          {T.name}
        </h2>
        <p className="font-body text-lg text-text-secondary text-center mb-2">
          {T.instructions.howToPlay}
        </p>
        <p className="font-body text-md text-text-secondary text-center mb-2">
          {T.instructions.collectFish}
        </p>
        <p className="font-body text-md text-text-secondary text-center mb-8">
          {T.instructions.useArrows}
        </p>
        <Button variant="success" size="lg" onClick={initGame}>
          🎮 {DUTCH_TEXT.menu.startGame}
        </Button>
      </div>
    );
  }

  // --- Win screen ---
  if (gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <Confetti />
        <PinguinGameOver
          score={score}
          isNewHighScore={isNewHighScore}
          onRestart={initGame}
          onExit={onExit}
          onChangeDifficulty={onChangeDifficulty}
        />
      </div>
    );
  }

  // --- Playing ---
  if (!maze || !penguin) return null;

  return (
    <div className="flex flex-col items-center px-2 py-2 no-select" style={{ touchAction: 'none' }}>
      <FlashOverlay trigger={shakeCount} />

      <PinguinHUD
        score={score}
        fishCollected={fishCollected}
        totalFish={totalFish}
      />

      <IceMaze
        maze={maze}
        penguin={penguin}
        fish={fish}
        seaExit={seaExit}
        nextFishNumber={fishCollected + 1}
        allFishCollected={fishCollected >= totalFish}
        onSwipeDirection={handleDirection}
      />

      {/* Feedback overlay */}
      {feedbackMsg && (
        <div className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 bg-primary-green/90 rounded-2xl px-6 py-3 shadow-lg pointer-events-none">
          <p className="font-display font-bold text-xl text-white text-center">
            {feedbackMsg}
          </p>
        </div>
      )}

      <TouchControls onDirection={handleDirection} />

      <div className="mt-2">
        <Button variant="accent" size="md" onClick={onExit}>
          {DUTCH_TEXT.game.quit}
        </Button>
      </div>
    </div>
  );
}
