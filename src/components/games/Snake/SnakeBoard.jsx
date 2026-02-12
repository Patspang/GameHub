// Grid rendering for the Snake game
// Dynamically computes tile size based on viewport, renders obstacles, numbers, and snake
// Supports swipe gestures for tablet input

import { useMemo } from 'react';
import { useSwipeGesture } from '../../../hooks/useSwipeGesture';
import { NumberFood } from './NumberFood';
import { SnakeSegment } from './SnakeSegment';

const RESERVED_HEIGHT = 340;
const RESERVED_WIDTH = 32;
const MIN_TILE = 24;
const MAX_TILE = 48;

function computeTileSize(rows, cols) {
  const availW = window.innerWidth - RESERVED_WIDTH;
  const availH = window.innerHeight - RESERVED_HEIGHT;
  const tile = Math.min(Math.floor(availW / cols), Math.floor(availH / rows));
  return Math.max(MIN_TILE, Math.min(MAX_TILE, tile));
}

export function SnakeBoard({ gridSize, snake, numbers, targetNumber, obstacles, onSwipeDirection }) {
  const { rows, cols } = gridSize;
  const tileSize = useMemo(() => computeTileSize(rows, cols), [rows, cols]);
  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(onSwipeDirection);

  const boardWidth = cols * tileSize;
  const boardHeight = rows * tileSize;

  return (
    <div
      className="relative rounded-xl shadow-md select-none"
      style={{
        width: boardWidth,
        height: boardHeight,
        backgroundColor: '#D4E7D7',
        touchAction: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${tileSize}px ${tileSize}px`,
        }}
      />

      {/* Border */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ border: '3px solid rgba(45, 55, 72, 0.3)' }}
      />

      {/* Obstacles (hard mode) */}
      {obstacles.map((obs, i) => (
        <div
          key={`obs-${i}`}
          className="absolute rounded-md"
          style={{
            left: obs.col * tileSize + 2,
            top: obs.row * tileSize + 2,
            width: tileSize - 4,
            height: tileSize - 4,
            backgroundColor: 'rgba(45, 55, 72, 0.5)',
          }}
        />
      ))}

      {/* Numbers */}
      {numbers.filter((n) => !n.eaten).map((n) => (
        <NumberFood
          key={n.id}
          number={n}
          tileSize={tileSize}
          isTarget={n.value === targetNumber}
        />
      ))}

      {/* Snake */}
      {snake.map((segment, index) => (
        <SnakeSegment
          key={`seg-${index}`}
          segment={segment}
          index={index}
          tileSize={tileSize}
          totalLength={snake.length}
        />
      ))}
    </div>
  );
}
