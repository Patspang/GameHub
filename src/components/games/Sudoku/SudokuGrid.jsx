// Sudoku grid renderer
// CSS Grid layout with thick box borders, cell highlighting, touch-friendly sizing
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

  return (
    <div
      className="inline-grid bg-text-primary rounded-lg overflow-hidden shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        gap: '1px',
        padding: '2px',
      }}
    >
      {grid.map((row, r) =>
        row.map((value, c) => {
          const isPreFilled = originalPuzzle[r][c] !== 0;
          const isSelected = selectedCell?.row === r && selectedCell?.col === c;
          const isHighlighted = highlightSet?.has(`${r}-${c}`) && !isSelected;
          const isEmpty = value === 0;
          const isRecent = recentCell?.row === r && recentCell?.col === c;

          // Thick border at box boundaries
          const isBoxRight = (c + 1) % boxCols === 0 && c < gridSize - 1;
          const isBoxBottom = (r + 1) % boxRows === 0 && r < gridSize - 1;

          return (
            <div
              key={`${r}-${c}`}
              onPointerDown={() => onCellSelect(r, c)}
              className={`
                flex items-center justify-center cursor-pointer
                font-display font-bold ${fontSize}
                transition-colors duration-100
                ${isSelected
                  ? 'bg-primary-blue/20 ring-2 ring-inset ring-primary-blue'
                  : isHighlighted
                    ? 'bg-primary-blue/8'
                    : 'bg-white'}
                ${isPreFilled ? 'text-text-primary' : 'text-primary-blue'}
                ${isEmpty && !isSelected ? 'hover:bg-primary-blue/5' : ''}
                ${isRecent && !isPreFilled ? 'animate-cell-pop' : ''}
              `}
              style={{
                width: cellSize,
                height: cellSize,
                // Thick borders at box boundaries via box-shadow
                boxShadow: [
                  isBoxRight ? `2px 0 0 0 var(--color-text-primary)` : '',
                  isBoxBottom ? `0 2px 0 0 var(--color-text-primary)` : '',
                  isBoxRight && isBoxBottom ? `2px 2px 0 0 var(--color-text-primary)` : '',
                ].filter(Boolean).join(', ') || 'none',
              }}
            >
              {value !== 0 ? value : ''}
            </div>
          );
        })
      )}
    </div>
  );
}
