// Sudoku puzzle generator supporting 4x4, 6x6, and 9x9 grids
// Phase A: Generate a complete valid grid via backtracking with randomized digits
// Phase B: Remove cells while verifying unique solution (solver counts to 2, stops)

import { DIFFICULTY } from '../constants/gameConfig';

// Difficulty → grid parameters
const PARAMS = {
  [DIFFICULTY.EASY]: { gridSize: 4, boxRows: 2, boxCols: 2, cellsToRemove: 7 },
  [DIFFICULTY.NORMAL]: { gridSize: 6, boxRows: 2, boxCols: 3, cellsToRemove: 16 },
  [DIFFICULTY.HARD]: { gridSize: 9, boxRows: 3, boxCols: 3, cellsToRemove: 48 },
};

// Fisher-Yates shuffle (in-place)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Check if placing num at (row, col) is valid
function isValid(grid, row, col, num, gridSize, boxRows, boxCols) {
  // Row check
  for (let c = 0; c < gridSize; c++) {
    if (grid[row][c] === num) return false;
  }
  // Column check
  for (let r = 0; r < gridSize; r++) {
    if (grid[r][col] === num) return false;
  }
  // Box check
  const boxStartRow = Math.floor(row / boxRows) * boxRows;
  const boxStartCol = Math.floor(col / boxCols) * boxCols;
  for (let r = boxStartRow; r < boxStartRow + boxRows; r++) {
    for (let c = boxStartCol; c < boxStartCol + boxCols; c++) {
      if (grid[r][c] === num) return false;
    }
  }
  return true;
}

// Generate a complete valid grid using backtracking with random digit order
function generateCompleteGrid(gridSize, boxRows, boxCols) {
  const grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  const digits = Array.from({ length: gridSize }, (_, i) => i + 1);

  function solve(pos) {
    if (pos === gridSize * gridSize) return true;
    const row = Math.floor(pos / gridSize);
    const col = pos % gridSize;

    const shuffled = shuffle([...digits]);
    for (const num of shuffled) {
      if (isValid(grid, row, col, num, gridSize, boxRows, boxCols)) {
        grid[row][col] = num;
        if (solve(pos + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  solve(0);
  return grid;
}

// Count solutions (stops at maxCount for efficiency)
function countSolutions(grid, gridSize, boxRows, boxCols, maxCount = 2) {
  let count = 0;

  function solve(pos) {
    if (count >= maxCount) return;
    if (pos === gridSize * gridSize) {
      count++;
      return;
    }
    const row = Math.floor(pos / gridSize);
    const col = pos % gridSize;

    if (grid[row][col] !== 0) {
      solve(pos + 1);
      return;
    }

    for (let num = 1; num <= gridSize; num++) {
      if (count >= maxCount) return;
      if (isValid(grid, row, col, num, gridSize, boxRows, boxCols)) {
        grid[row][col] = num;
        solve(pos + 1);
        grid[row][col] = 0;
      }
    }
  }

  solve(0);
  return count;
}

// Remove cells from a complete grid while maintaining a unique solution
function createPuzzle(solution, gridSize, boxRows, boxCols, cellsToRemove) {
  const puzzle = solution.map((row) => [...row]);

  // Build shuffled list of all cell positions
  const positions = [];
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      positions.push([r, c]);
    }
  }
  shuffle(positions);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= cellsToRemove) break;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    // Check if the puzzle still has a unique solution
    const testGrid = puzzle.map((row) => [...row]);
    const solutions = countSolutions(testGrid, gridSize, boxRows, boxCols, 2);

    if (solutions === 1) {
      removed++;
    } else {
      // Restore — removing this cell creates ambiguity
      puzzle[r][c] = backup;
    }
  }

  return puzzle;
}

// Main export: generate a puzzle for the given difficulty
// Returns { puzzle: number[][], solution: number[][] }
export function generateSudokuPuzzle(difficulty) {
  const { gridSize, boxRows, boxCols, cellsToRemove } = PARAMS[difficulty];
  const solution = generateCompleteGrid(gridSize, boxRows, boxCols);
  const puzzle = createPuzzle(solution, gridSize, boxRows, boxCols, cellsToRemove);
  return { puzzle, solution };
}
