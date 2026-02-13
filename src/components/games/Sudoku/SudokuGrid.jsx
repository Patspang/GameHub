// Sudoku grid renderer
// Nested structure: outer grid of boxes, each box contains its cells
// Thick dark borders between boxes, thin borders between cells within a box
// Pre-filled numbers are bold/dark, user-entered numbers are blue with pop animation
// Cell size is viewport-aware: computed from screen width, clamped to min/max

import { useMemo } from 'react';

// Max cell size per grid size — used on wide screens
const MAX_CELL = { 4: 72, 6: 56, 9: 40 };
// Min cell size — touch target floor
const MIN_CELL = { 4: 48, 6: 36, 9: 28 };
// Side padding reserved (2 × 16px page padding)
const RESERVED_WIDTH = 32;
// Outer gap (3px per gap between boxes) + outer padding (2 × 3px)
function computeGridOverhead(boxCountCols, gridSize) {
  // Outer padding: 3px left + 3px right = 6px
  // Gaps between boxes: (boxCountCols - 1) * 3px
  // Inner cell gaps per box: (gridSize/boxCountCols - 1) * 1px per box, times boxCountCols boxes
  const outerPad = 6;
  const outerGaps = (boxCountCols - 1) * 3;
  const cellsPerBox = gridSize / boxCountCols;
  const innerGaps = boxCountCols * (cellsPerBox - 1) * 1;
  return outerPad + outerGaps + innerGaps;
}

function computeCellSize(gridSize, boxCols) {
  const boxCountCols = gridSize / boxCols;
  const overhead = computeGridOverhead(boxCountCols, gridSize);
  const availWidth = window.innerWidth - RESERVED_WIDTH - overhead;
  const computed = Math.floor(availWidth / gridSize);
  return Math.max(MIN_CELL[gridSize], Math.min(MAX_CELL[gridSize], computed));
}

// Font size adapts to cell size
function getFontClass(cellSize) {
  if (cellSize >= 56) return 'text-3xl';
  if (cellSize >= 40) return 'text-2xl';
  if (cellSize >= 32) return 'text-xl';
  return 'text-lg';
}

export function SudokuGrid({
  grid,
  originalPuzzle,
  selectedCell,
  gridSize,
  boxRows,
  boxCols,
  onCellSelect,
  recentCell,
}) {
  const cellSize = computeCellSize(gridSize, boxCols);
  const fontSize = getFontClass(cellSize);

  // How many boxes in each direction
  const boxCountRows = gridSize / boxRows;
  const boxCountCols = gridSize / boxCols;

  // Pre-compute which cells are in the same group as the selected cell
  const highlightSet = useMemo(() => {
    if (!selectedCell) return null;
    const set = new Set();
    const { row: sr, col: sc } = selectedCell;
    for (let i = 0; i < gridSize; i++) {
      set.add(`${sr}-${i}`); // same row
      set.add(`${i}-${sc}`); // same col
    }
    // same box
    const boxR = Math.floor(sr / boxRows) * boxRows;
    const boxC = Math.floor(sc / boxCols) * boxCols;
    for (let r = boxR; r < boxR + boxRows; r++) {
      for (let c = boxC; c < boxC + boxCols; c++) {
        set.add(`${r}-${c}`);
      }
    }
    return set;
  }, [selectedCell, gridSize, boxRows, boxCols]);

  // Build boxes: each box is a group of cells
  const boxes = [];
  for (let br = 0; br < boxCountRows; br++) {
    for (let bc = 0; bc < boxCountCols; bc++) {
      const cells = [];
      for (let lr = 0; lr < boxRows; lr++) {
        for (let lc = 0; lc < boxCols; lc++) {
          const r = br * boxRows + lr;
          const c = bc * boxCols + lc;
          cells.push({ r, c, value: grid[r][c] });
        }
      }
      boxes.push({ br, bc, cells });
    }
  }

  return (
    <div
      className="inline-grid rounded-lg overflow-hidden shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${boxCountCols}, auto)`,
        gridTemplateRows: `repeat(${boxCountRows}, auto)`,
        gap: '3px',
        padding: '3px',
        backgroundColor: '#2D3748',
      }}
    >
      {boxes.map((box) => (
        <div
          key={`box-${box.br}-${box.bc}`}
          className="inline-grid"
          style={{
            gridTemplateColumns: `repeat(${boxCols}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${boxRows}, ${cellSize}px)`,
            gap: '1px',
            backgroundColor: '#A0AEC0',
          }}
        >
          {box.cells.map(({ r, c, value }) => {
            const isPreFilled = originalPuzzle[r][c] !== 0;
            const isSelected = selectedCell?.row === r && selectedCell?.col === c;
            const isHighlighted = highlightSet?.has(`${r}-${c}`) && !isSelected;
            const isEmpty = value === 0;
            const isRecent = recentCell?.row === r && recentCell?.col === c;

            return (
              <div
                key={`${r}-${c}`}
                onPointerDown={() => onCellSelect(r, c)}
                className={`
                  flex items-center justify-center cursor-pointer
                  font-display font-bold ${fontSize}
                  transition-colors duration-100
                  ${isSelected
                    ? 'bg-primary-blue/25 ring-2 ring-inset ring-primary-blue'
                    : isHighlighted
                      ? 'bg-primary-blue/10'
                      : 'bg-white'}
                  ${isPreFilled ? 'text-text-primary' : 'text-primary-blue'}
                  ${isEmpty && !isSelected ? 'hover:bg-primary-blue/5' : ''}
                  ${isRecent && !isPreFilled ? 'animate-cell-pop' : ''}
                `}
                style={{ width: cellSize, height: cellSize }}
              >
                {value !== 0 ? value : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
