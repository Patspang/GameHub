// Sudoku — number puzzle game for kids
// Turn-based: no game loop, React state + event handlers
// Grid sizes: 4x4 (Easy), 6x6 (Normal), 9x9 (Hard)
// No lose condition — wrong answers get flash + sound, child retries

import { useState, useCallback } from 'react';
import { SUDOKU_CONFIG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { generateSudokuPuzzle } from '../../../utils/sudokuPuzzles';
import { SudokuGrid } from './SudokuGrid';
import { NumberPicker } from './NumberPicker';
import { SudokuHUD } from './SudokuHUD';
import { SudokuGameOver } from './SudokuGameOver';
import { Confetti } from '../../common/Confetti';
import { FlashOverlay } from '../../common/FlashOverlay';

const { CELEBRATION_DELAY, SCORING } = SUDOKU_CONFIG;

function initRound(difficulty) {
  const puzzleCount = SUDOKU_CONFIG.PUZZLES_PER_SESSION[difficulty];
  const puzzles = Array.from({ length: puzzleCount }, () =>
    generateSudokuPuzzle(difficulty)
  );
  return {
    puzzles,
    currentPuzzleIndex: 0,
    userGrid: puzzles[0].puzzle.map((row) => [...row]),
    selectedCell: null,
    recentCell: null,
    score: 0,
    wrongFlash: 0,
    showCelebration: false,
    gameStatus: 'playing',
  };
}

export function Sudoku({ difficulty, onExit, onChangeDifficulty }) {
  const [state, setState] = useState(() => initRound(difficulty));
  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const { gridSize, boxRows, boxCols } = SUDOKU_CONFIG.GRID_PARAMS[difficulty];

  // Advance to next puzzle or finish the session
  const advancePuzzle = useCallback((currentScore) => {
    setState((prev) => ({ ...prev, showCelebration: true }));
    playSound('complete');

    setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentPuzzleIndex + 1;
        if (nextIndex >= prev.puzzles.length) {
          // Session complete — check high score
          const gameScores = scores['sudoku'] || {};
          const prevBest = gameScores[difficulty] || 0;
          if (currentScore > prevBest) {
            setScores((s) => ({
              ...s,
              sudoku: { ...(s.sudoku || {}), [difficulty]: currentScore },
            }));
            setIsNewHighScore(true);
            playSound('highscore');
          }
          return { ...prev, showCelebration: false, gameStatus: 'won' };
        }
        // Load next puzzle
        return {
          ...prev,
          currentPuzzleIndex: nextIndex,
          userGrid: prev.puzzles[nextIndex].puzzle.map((row) => [...row]),
          selectedCell: null,
          recentCell: null,
          showCelebration: false,
        };
      });
    }, CELEBRATION_DELAY);
  }, [difficulty, scores, setScores, playSound]);

  // Handle cell tap — selects an empty cell
  const handleCellSelect = useCallback((row, col) => {
    if (state.showCelebration) return;
    const originalPuzzle = state.puzzles[state.currentPuzzleIndex].puzzle;
    if (originalPuzzle[row][col] !== 0) return; // Pre-filled, ignore
    setState((prev) => ({ ...prev, selectedCell: { row, col } }));
  }, [state.showCelebration, state.puzzles, state.currentPuzzleIndex]);

  // Handle number pick — places a number in the selected cell
  const handleNumberPick = useCallback((num) => {
    if (!state.selectedCell || state.showCelebration) return;
    const { row, col } = state.selectedCell;
    const solution = state.puzzles[state.currentPuzzleIndex].solution;

    if (num === solution[row][col]) {
      // Correct placement
      const points = SCORING.CELL_CORRECT[difficulty];
      const newScore = state.score + points;
      const newGrid = state.userGrid.map((r) => [...r]);
      newGrid[row][col] = num;
      playSound('collect');

      // Check if puzzle is complete (no zeros remain)
      const puzzleComplete = newGrid.every((r) => r.every((c) => c !== 0));

      if (puzzleComplete) {
        const bonusScore = newScore + SCORING.PUZZLE_COMPLETE_BONUS[difficulty];
        setState((prev) => ({
          ...prev,
          userGrid: newGrid,
          selectedCell: null,
          recentCell: { row, col },
          score: bonusScore,
        }));
        advancePuzzle(bonusScore);
      } else {
        setState((prev) => ({
          ...prev,
          userGrid: newGrid,
          selectedCell: null,
          recentCell: { row, col },
          score: newScore,
        }));
      }
    } else {
      // Wrong placement — flash + sound, keep cell selected to retry
      setState((prev) => ({
        ...prev,
        wrongFlash: prev.wrongFlash + 1,
      }));
      playSound('wrong');
    }
  }, [state, difficulty, advancePuzzle, playSound]);

  // Handle clear — remove user-entered number from selected cell
  const handleClear = useCallback(() => {
    if (!state.selectedCell || state.showCelebration) return;
    const { row, col } = state.selectedCell;
    const originalPuzzle = state.puzzles[state.currentPuzzleIndex].puzzle;
    if (originalPuzzle[row][col] !== 0) return; // Can't clear pre-filled
    const newGrid = state.userGrid.map((r) => [...r]);
    newGrid[row][col] = 0;
    setState((prev) => ({ ...prev, userGrid: newGrid, recentCell: null }));
  }, [state.selectedCell, state.showCelebration, state.puzzles, state.currentPuzzleIndex, state.userGrid]);

  // Restart with fresh puzzles
  const handleRestart = useCallback(() => {
    setState(initRound(difficulty));
    setIsNewHighScore(false);
  }, [difficulty]);

  // --- Win screen ---
  if (state.gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <Confetti />
        <SudokuGameOver
          score={state.score}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onExit={onExit}
          onChangeDifficulty={onChangeDifficulty}
        />
      </div>
    );
  }

  // --- Playing screen ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4 no-select">
      <FlashOverlay trigger={state.wrongFlash} />

      <SudokuHUD
        score={state.score}
        currentPuzzle={state.currentPuzzleIndex}
        totalPuzzles={state.puzzles.length}
      />

      <div className="flex flex-col items-center flex-1 justify-center w-full max-w-lg">
        {!state.showCelebration ? (
          <>
            <SudokuGrid
              grid={state.userGrid}
              originalPuzzle={state.puzzles[state.currentPuzzleIndex].puzzle}
              selectedCell={state.selectedCell}
              gridSize={gridSize}
              boxRows={boxRows}
              boxCols={boxCols}
              onCellSelect={handleCellSelect}
              recentCell={state.recentCell}
            />

            <NumberPicker
              maxNumber={gridSize}
              onPick={handleNumberPick}
              onClear={handleClear}
              hasSelection={state.selectedCell !== null}
            />
          </>
        ) : (
          <div className="text-center">
            <div className="text-6xl mb-4">🧩</div>
            <p className="font-display text-2xl font-bold text-text-primary">
              {DUTCH_TEXT.sudoku.feedback.puzzleComplete}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
