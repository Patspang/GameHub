// Renders the ice maze grid, penguin, fish, and sea exit
// Visual theme: icy blue walls, white paths, penguin emoji, numbered fish

import { useMemo } from 'react';
import { useSwipeGesture } from '../../../hooks/useSwipeGesture';

const RESERVED_HEIGHT = 340;
const RESERVED_WIDTH = 32;
const MIN_TILE = 20;
const MAX_TILE = 44;

function computeTileSize(rows, cols) {
  const availW = (typeof window !== 'undefined' ? window.innerWidth : 1024) - RESERVED_WIDTH;
  const availH = (typeof window !== 'undefined' ? window.innerHeight : 768) - RESERVED_HEIGHT;
  const tileFromWidth = Math.floor(availW / cols);
  const tileFromHeight = Math.floor(availH / rows);
  const tile = Math.min(tileFromWidth, tileFromHeight);
  return Math.max(MIN_TILE, Math.min(MAX_TILE, tile));
}

function FishItem({ fish, tileSize, isNext }) {
  const size = isNext ? tileSize * 0.9 : tileSize * 0.55;
  const offset = (tileSize - size) / 2;

  return (
    <div
      className={`absolute flex items-center justify-center rounded-lg select-none transition-all duration-200 ${
        isNext ? 'animate-pulse z-10' : ''
      }`}
      style={{
        left: fish.col * tileSize + offset,
        top: fish.row * tileSize + offset,
        width: size,
        height: size,
        backgroundColor: isNext ? '#F59E0B' : 'rgba(90, 103, 216, 0.45)',
        boxShadow: isNext ? '0 0 16px 6px rgba(245, 158, 11, 0.55)' : 'none',
        border: isNext ? '3px solid #FBBF24' : 'none',
      }}
    >
      <span style={{ fontSize: size * 0.45 }}>🐟</span>
      <span
        className="absolute font-display font-bold text-white"
        style={{ fontSize: size * 0.3, bottom: 0, right: 2 }}
      >
        {fish.number}
      </span>
    </div>
  );
}

function SeaExit({ seaExit, tileSize, isOpen }) {
  const size = tileSize * 0.9;
  const offset = (tileSize - size) / 2;

  return (
    <div
      className={`absolute flex items-center justify-center rounded-lg select-none transition-all duration-300 ${
        isOpen ? 'animate-sea-wave z-10' : ''
      }`}
      style={{
        left: seaExit.col * tileSize + offset,
        top: seaExit.row * tileSize + offset,
        width: size,
        height: size,
        opacity: isOpen ? 1 : 0.4,
        backgroundColor: isOpen ? 'rgba(72, 187, 120, 0.3)' : 'transparent',
        boxShadow: isOpen ? '0 0 16px 6px rgba(72, 187, 120, 0.5)' : 'none',
      }}
    >
      <span style={{ fontSize: size * 0.6 }}>🌊</span>
    </div>
  );
}

function Penguin({ penguin, tileSize }) {
  const size = tileSize * 0.8;
  const offset = (tileSize - size) / 2;

  return (
    <div
      className="absolute flex items-center justify-center select-none z-20 transition-all duration-100"
      style={{
        left: penguin.col * tileSize + offset,
        top: penguin.row * tileSize + offset,
        width: size,
        height: size,
      }}
    >
      <span style={{ fontSize: size * 0.7 }}>🐧</span>
    </div>
  );
}

export function IceMaze({
  maze,
  penguin,
  fish,
  seaExit,
  nextFishNumber,
  allFishCollected,
  onSwipeDirection,
}) {
  const rows = maze.length;
  const cols = maze[0].length;

  const tileSize = useMemo(() => computeTileSize(rows, cols), [rows, cols]);

  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    onSwipeDirection || (() => {})
  );

  return (
    <div className="flex justify-center" style={{ touchAction: 'none' }}>
      <div
        className="relative rounded-xl shadow-inner overflow-hidden border-4 border-primary-blue/30"
        style={{
          width: cols * tileSize,
          height: rows * tileSize,
          background: 'linear-gradient(to bottom, #E8F4F8, #B3D9F2)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Ice wall tiles */}
        {maze.map((row, rowIdx) =>
          row.map((cell, colIdx) =>
            cell === 1 ? (
              <div
                key={`w-${rowIdx}-${colIdx}`}
                className="absolute rounded-sm"
                style={{
                  left: colIdx * tileSize,
                  top: rowIdx * tileSize,
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: '#B3D9F2',
                  boxShadow: 'inset 0 0 2px rgba(107,155,209,0.5)',
                  border: '1px solid rgba(107,155,209,0.3)',
                }}
              />
            ) : null
          )
        )}

        {/* Sea exit */}
        {seaExit && (
          <SeaExit
            seaExit={seaExit}
            tileSize={tileSize}
            isOpen={allFishCollected}
          />
        )}

        {/* Fish (uncollected only) */}
        {fish
          .filter((f) => !f.collected)
          .map((f) => (
            <FishItem
              key={f.id}
              fish={f}
              tileSize={tileSize}
              isNext={f.number === nextFishNumber}
            />
          ))}

        {/* Penguin */}
        {penguin && (
          <Penguin penguin={penguin} tileSize={tileSize} />
        )}
      </div>
    </div>
  );
}
