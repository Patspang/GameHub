// Sudoku grid renderer
// Nested structure: outer grid of boxes, each box contains its cells
// Thick dark borders between boxes, thin borders between cells within a box
// Pre-filled numbers are bold/dark, user-entered numbers are blue with pop animation

import { useMemo } from 'react';

// Cell size per grid size (px) — touch-friendly minimums
const CELL_SIZES = { 4: 72, 6: 56, 9: 40 };
// Font size per grid size
const FONT_SIZES = { 4: 'text-3xl', 6: 'text-2xl', 9: 'text-xl' };

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
  const cellSize = CELL_SIZES[gridSize] || 40;
  const fontSize = FONT_SIZES[gridSize] || 'text-xl';

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
