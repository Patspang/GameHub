// Grid rendering for the Tetris game
// Dynamically computes tile size based on viewport
// Renders placed blocks and the current falling piece

import { useMemo } from 'react';
import { TetrisBlock } from './TetrisBlock';

const RESERVED_HEIGHT = 340;
const RESERVED_WIDTH = 32;
const MIN_TILE = 20;
const MAX_TILE = 36;

function computeTileSize(rows, cols) {
  const availW = window.innerWidth - RESERVED_WIDTH;
  const availH = window.innerHeight - RESERVED_HEIGHT;
  const tile = Math.min(Math.floor(availW / cols), Math.floor(availH / rows));
  return Math.max(MIN_TILE, Math.min(MAX_TILE, tile));
}

export function TetrisBoard({ board, currentPiece, boardWidth, boardHeight }) {
  const tileSize = useMemo(() => computeTileSize(boardHeight, boardWidth), [boardHeight, boardWidth]);

  const pixelWidth = boardWidth * tileSize;
  const pixelHeight = boardHeight * tileSize;

  // Build set of current piece cells for rendering
  const pieceCells = useMemo(() => {
    if (!currentPiece) return [];
    const { piece, row, col, rotation } = currentPiece;
    return piece.shapes[rotation].map(([dr, dc]) => ({
      r: row + dr,
      c: col + dc,
      color: piece.color,
    }));
  }, [currentPiece]);

  return (
    <div
      className="relative rounded-xl shadow-md select-none"
      style={{
        width: pixelWidth,
        height: pixelHeight,
        backgroundColor: '#E8F4F8',
        touchAction: 'none',
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
          `,
          backgroundSize: `${tileSize}px ${tileSize}px`,
        }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ border: '3px solid rgba(45, 55, 72, 0.3)' }}
      />

      {/* Placed blocks on the board */}
      {board.map((row, r) =>
        row.map((cell, c) =>
          cell ? (
            <div
              key={`${r}-${c}`}
              className="absolute"
              style={{
                left: c * tileSize,
                top: r * tileSize,
              }}
            >
              <TetrisBlock color={cell} size={tileSize} />
            </div>
          ) : null
        )
      )}

      {/* Current falling piece */}
      {pieceCells.map(({ r, c, color }, i) =>
        r >= 0 ? (
          <div
            key={`piece-${i}`}
            className="absolute"
            style={{
              left: c * tileSize,
              top: r * tileSize,
            }}
          >
            <TetrisBlock color={color} size={tileSize} />
          </div>
        ) : null
      )}
    </div>
  );
}
