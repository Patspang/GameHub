// Renders the maze grid, player, letters, and creatures
// Tile size is computed dynamically to fit within the available viewport
// Supports swipe gestures on the maze area for tablet control

import { useMemo } from 'react';
import { useSwipeGesture } from '../../../hooks/useSwipeGesture';
import { Player } from './Player';
import { Letter } from './Letter';
import { Creature } from './Creature';

// Space reserved for HUD above and touch controls + quit button below
const RESERVED_HEIGHT = 340;
const RESERVED_WIDTH = 32; // side padding
const MIN_TILE = 28;
const MAX_TILE = 52;

function computeTileSize(rows, cols) {
  const availW = (typeof window !== 'undefined' ? window.innerWidth : 1024) - RESERVED_WIDTH;
  const availH = (typeof window !== 'undefined' ? window.innerHeight : 768) - RESERVED_HEIGHT;

  const tileFromWidth = Math.floor(availW / cols);
  const tileFromHeight = Math.floor(availH / rows);
  const tile = Math.min(tileFromWidth, tileFromHeight);

  return Math.max(MIN_TILE, Math.min(MAX_TILE, tile));
}

export function Maze({
  layout,
  player,
  letters,
  creatures,
  nextLetterIndex,
  isInvincible,
  onSwipeDirection,
}) {
  const rows = layout.length;
  const cols = layout[0].length;

  const tileSize = useMemo(() => computeTileSize(rows, cols), [rows, cols]);

  // Swipe gesture on the maze area
  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    onSwipeDirection || (() => {})
  );

  return (
    <div className="flex justify-center" style={{ touchAction: 'none' }}>
      <div
        className="relative bg-bg-maze rounded-xl shadow-inner overflow-hidden border-4 border-primary-green/30"
        style={{
          width: cols * tileSize,
          height: rows * tileSize,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Wall tiles */}
        {layout.map((row, rowIdx) =>
          row.map((cell, colIdx) =>
            cell === 1 ? (
              <div
                key={`wall-${rowIdx}-${colIdx}`}
                className="absolute bg-primary-blue/80 rounded-sm"
                style={{
                  left: colIdx * tileSize,
                  top: rowIdx * tileSize,
                  width: tileSize,
                  height: tileSize,
                }}
              />
            ) : null
          )
        )}

        {/* Letters */}
        {letters.map((letter, index) =>
          !letter.collected ? (
            <Letter
              key={letter.id}
              letter={letter}
              tileSize={tileSize}
              isNext={index === nextLetterIndex}
            />
          ) : null
        )}

        {/* Creatures */}
        {creatures.map((creature) => (
          <Creature
            key={creature.id}
            creature={creature}
            tileSize={tileSize}
          />
        ))}

        {/* Player */}
        <Player
          player={player}
          tileSize={tileSize}
          isInvincible={isInvincible}
        />
      </div>
    </div>
  );
}
