// Bos Ritje — visual programming game where kids plan a car route through a forest
// Plan-first: build entire command sequence, then watch car execute
// 15 progressive levels (no difficulty selection), star-based scoring

import { useState, useCallback, useRef } from 'react';
import { BOS_RITJE_CONFIG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { getLevel, getTotalLevels } from './levelData';
import { calculateStars } from './scoringSystem';
import { ForestCanvas } from './ForestCanvas';
import { CommandPanel } from './CommandPanel';
import { BosRitjeHUD } from './BosRitjeHUD';
import { BosRitjeFeedback } from './BosRitjeFeedback';

const { CELEBRATION_DELAY } = BOS_RITJE_CONFIG;

// Direction vectors
const DIR_VECTORS = {
  north: { dx: 0, dy: -1 },
  east: { dx: 1, dy: 0 },
  south: { dx: 0, dy: 1 },
  west: { dx: -1, dy: 0 },
};

// Turn left/right from current direction
const TURN_LEFT = { north: 'west', west: 'south', south: 'east', east: 'north' };
const TURN_RIGHT = { north: 'east', east: 'south', south: 'west', west: 'north' };

function isPassable(grid, row, col, gridSize) {
  if (row < 0 || row >= gridSize.rows || col < 0 || col >= gridSize.cols) return false;
  const cell = grid[row][col];
  return cell === 'path' || cell === 'start' || cell === 'goal';
}

export function BosRitje({ onExit }) {
  const [levelIndex, setLevelIndex] = useState(0);
  const [commands, setCommands] = useState([]);
  const [gamePhase, setGamePhase] = useState('planning');
  // planning | executing | success | collision | missed
  const [executionIndex, setExecutionIndex] = useState(-1);
  const [resultData, setResultData] = useState(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const [progress, setProgress] = useLocalStorage('gamehub-bos-ritje-progress', {});
  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const canvasActionsRef = useRef(null);

  // Current car state during execution (not React state — updated synchronously)
  const carStateRef = useRef({ col: 0, row: 0, direction: 'north' });

  const levelData = getLevel(levelIndex);
  const totalLevels = getTotalLevels();
  const maxCmd = levelData?.maxCommands || 8;

  // Get earned stars for current level from progress
  const earnedStars = progress[levelIndex] || 0;

  // Add a command to the route
  const handleAddCommand = useCallback((cmd) => {
    setCommands((prev) => {
      if (prev.length >= maxCmd) return prev;
      return [...prev, cmd];
    });
  }, [maxCmd]);

  // Remove a command from the route
  const handleRemoveCommand = useCallback((index) => {
    setCommands((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear all commands
  const handleClear = useCallback(() => {
    setCommands([]);
  }, []);

  // Execute a single command step, then recurse
  const executeStep = useCallback((cmds, stepIndex) => {
    if (stepIndex >= cmds.length) {
      // All commands executed — check if at goal
      const { col, row } = carStateRef.current;
      if (col === levelData.goalX && row === levelData.goalY) {
        // Success!
        const stars = calculateStars(cmds.length, levelData.optimalSteps);

        // Save progress (best stars per level index)
        const prevStars = progress[levelIndex] || 0;
        if (stars > prevStars) {
          setProgress((p) => ({
            ...p,
            [levelIndex]: stars,
          }));
        }

        // Calculate total score: sum of all stars across all levels
        const allProgress = { ...progress, [levelIndex]: Math.max(stars, prevStars) };
        const totalScore = Object.values(allProgress).reduce((sum, s) => sum + s * 100, 0);

        // Save to gamehub-scores for homepage display
        const prevBest = scores['bos-ritje'] || 0;
        if (totalScore > prevBest) {
          setScores((s) => ({
            ...s,
            'bos-ritje': totalScore,
          }));
          setIsNewHighScore(true);
          playSound('highscore');
        } else {
          playSound('complete');
        }

        // Auto-advance to next level after a brief pause
        const isLast = levelIndex >= totalLevels - 1;
        setTimeout(() => {
          if (isLast) {
            // Last level — show success feedback
            setResultData({
              type: 'success',
              stars,
              usedSteps: cmds.length,
              optimalSteps: levelData.optimalSteps,
            });
            setGamePhase('success');
          } else {
            // Auto-advance to next level
            setLevelIndex((prev) => prev + 1);
            setCommands([]);
            setGamePhase('planning');
            setExecutionIndex(-1);
            setResultData(null);
            setIsNewHighScore(false);
          }
        }, CELEBRATION_DELAY);
      } else {
        // Missed the goal — stay on planning screen for editing
        playSound('wrong');
        const msg = DUTCH_TEXT.bosRitje.feedback.missed.message;
        setTimeout(() => {
          setGamePhase('planning');
          setExecutionIndex(-1);
          setFeedbackMessage(msg);
          // Reset car to start
          if (canvasActionsRef.current && levelData) {
            canvasActionsRef.current.resetCar(
              levelData.startX, levelData.startY, levelData.startDirection
            );
          }
          setTimeout(() => setFeedbackMessage(null), 3000);
        }, 600);
      }
      return;
    }

    setExecutionIndex(stepIndex);
    const cmd = cmds[stepIndex];
    const { col, row, direction } = carStateRef.current;

    if (cmd === 'forward') {
      const vec = DIR_VECTORS[direction];
      const newCol = col + vec.dx;
      const newRow = row + vec.dy;

      // Check collision
      if (!isPassable(levelData.grid, newRow, newCol, levelData.gridSize)) {
        // Determine collision type
        let collisionType = 'outOfBounds';
        if (newRow >= 0 && newRow < levelData.gridSize.rows &&
            newCol >= 0 && newCol < levelData.gridSize.cols) {
          collisionType = levelData.grid[newRow][newCol];
          if (collisionType === 'grass') collisionType = 'outOfBounds';
        }

        playSound('wrong');
        if (canvasActionsRef.current) {
          canvasActionsRef.current.showCollision();
        }

        // Stay on planning screen — reset car, keep commands for editing
        const collisionMessages = DUTCH_TEXT.bosRitje.feedback.collision;
        const msg = collisionMessages[collisionType] || collisionMessages.outOfBounds;
        setTimeout(() => {
          setGamePhase('planning');
          setExecutionIndex(-1);
          setFeedbackMessage(msg);
          // Reset car to start
          if (canvasActionsRef.current && levelData) {
            canvasActionsRef.current.resetCar(
              levelData.startX, levelData.startY, levelData.startDirection
            );
          }
          // Clear message after a few seconds
          setTimeout(() => setFeedbackMessage(null), 3000);
        }, 600);
        return;
      }

      // Valid move — animate
      playSound('collect');
      carStateRef.current = { col: newCol, row: newRow, direction };

      if (canvasActionsRef.current) {
        canvasActionsRef.current.executeForward(col, row, newCol, newRow, () => {
          executeStep(cmds, stepIndex + 1);
        });
      }
    } else if (cmd === 'left') {
      const newDir = TURN_LEFT[direction];
      carStateRef.current = { col, row, direction: newDir };

      if (canvasActionsRef.current) {
        canvasActionsRef.current.executeTurn(newDir, () => {
          executeStep(cmds, stepIndex + 1);
        });
      }
    } else if (cmd === 'right') {
      const newDir = TURN_RIGHT[direction];
      carStateRef.current = { col, row, direction: newDir };

      if (canvasActionsRef.current) {
        canvasActionsRef.current.executeTurn(newDir, () => {
          executeStep(cmds, stepIndex + 1);
        });
      }
    }
  }, [levelData, levelIndex, totalLevels, progress, scores, setProgress, setScores, playSound]);

  // Start executing the planned route
  const handleStart = useCallback(() => {
    if (commands.length === 0 || !levelData) return;

    // Reset car to start position
    carStateRef.current = {
      col: levelData.startX,
      row: levelData.startY,
      direction: levelData.startDirection,
    };

    setGamePhase('executing');
    setExecutionIndex(0);
    setIsNewHighScore(false);
    setFeedbackMessage(null);

    // Start executing from step 0
    executeStep(commands, 0);
  }, [commands, levelData, executeStep]);

  // Retry current level
  const handleRetry = useCallback(() => {
    setCommands([]);
    setGamePhase('planning');
    setExecutionIndex(-1);
    setResultData(null);
    setIsNewHighScore(false);

    // Reset car on canvas
    if (canvasActionsRef.current && levelData) {
      canvasActionsRef.current.resetCar(
        levelData.startX, levelData.startY, levelData.startDirection
      );
    }
  }, [levelData]);

  // Go to next level
  const handleNextLevel = useCallback(() => {
    const nextIndex = levelIndex + 1;
    if (nextIndex < totalLevels) {
      setLevelIndex(nextIndex);
      setCommands([]);
      setGamePhase('planning');
      setExecutionIndex(-1);
      setResultData(null);
      setIsNewHighScore(false);
    }
  }, [levelIndex, totalLevels]);

  if (!levelData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="font-display text-xl text-text-secondary">Level niet gevonden</p>
      </div>
    );
  }

  // Show feedback screen (only for success on last level)
  if (gamePhase === 'success') {
    return (
      <BosRitjeFeedback
        type={resultData?.type || gamePhase}
        stars={resultData?.stars}
        usedSteps={resultData?.usedSteps}
        optimalSteps={resultData?.optimalSteps}
        collisionType={resultData?.collisionType}
        collisionStep={resultData?.collisionStep}
        collisionCommand={resultData?.collisionCommand}
        isLastLevel={levelIndex >= totalLevels - 1}
        isNewHighScore={isNewHighScore}
        onNextLevel={handleNextLevel}
        onRetry={handleRetry}
        onExit={onExit}
      />
    );
  }

  // Planning or executing view
  return (
    <div className="flex flex-col items-center px-2 py-2 max-w-[700px] mx-auto landscape:max-w-none landscape:h-[100dvh] landscape:max-h-[100dvh] landscape:overflow-hidden">
      <BosRitjeHUD
        levelData={levelData}
        earnedStars={earnedStars}
        totalLevels={totalLevels}
      />

      {/* Portrait: vertical stack. Landscape: canvas left, controls right */}
      <div className="flex flex-col landscape:flex-row landscape:flex-1 landscape:gap-3 landscape:min-h-0 w-full landscape:items-start">
        <div className="landscape:flex-1 landscape:min-w-0 landscape:self-stretch landscape:flex landscape:items-center landscape:justify-center">
          <ForestCanvas
            levelData={levelData}
            actionsRef={canvasActionsRef}
          />
        </div>

        <div className="mt-3 w-full landscape:mt-0 landscape:w-[200px] landscape:shrink-0 landscape:self-stretch landscape:flex landscape:flex-col landscape:justify-center landscape:items-center">
          {/* Inline collision/missed feedback message */}
          {feedbackMessage && (
            <div className="w-full max-w-[600px] landscape:max-w-none mx-auto mb-2 px-4 py-2 bg-error/20 border-2 border-error rounded-xl text-center animate-bounce">
              <span className="font-display font-bold text-text-primary text-sm">
                💥 {feedbackMessage}
              </span>
            </div>
          )}

          <CommandPanel
            commands={commands}
            maxCommands={maxCmd}
            onAddCommand={handleAddCommand}
            onRemoveCommand={handleRemoveCommand}
            onClear={handleClear}
            onStart={handleStart}
            executing={gamePhase === 'executing'}
            executionIndex={executionIndex}
          />
        </div>
      </div>
    </div>
  );
}
