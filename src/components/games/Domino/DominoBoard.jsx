// Board component: horizontal scrollable chain of placed domino tiles
// Shows placement zones when player has a tile selected

import { useEffect, useRef } from 'react';
import { DominoTile } from './DominoTile';
import { DUTCH_TEXT } from '../../../constants/dutch-text';

const T = DUTCH_TEXT.domino;

function PlacementZone({ onClick, side }) {
  return (
    <button
      onClick={onClick}
      className="flex-none w-20 h-16 rounded-xl border-3 border-dashed border-success
        bg-success/15 flex items-center justify-center
        animate-pulse hover:bg-success/25 active:scale-90 transition-all"
    >
      <span className="text-success font-bold text-2xl">
        {side === 'left' ? '⬅' : '➡'}
      </span>
    </button>
  );
}

export function DominoBoard({
  chain,
  showLeftZone,
  showRightZone,
  onPlaceLeft,
  onPlaceRight,
}) {
  const scrollRef = useRef(null);

  // Auto-scroll to the end when chain grows
  useEffect(() => {
    if (scrollRef.current && chain.length > 0) {
      const el = scrollRef.current;
      // Scroll to center-right to show the latest placed tile
      el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    }
  }, [chain.length]);

  // Empty board
  if (chain.length === 0 && !showLeftZone) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="font-display text-lg text-text-secondary animate-bounce">
          {T.feedback.placedFirst}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center w-full px-2 min-h-0">
      <div
        ref={scrollRef}
        className="flex items-center justify-center gap-2 overflow-x-auto py-4 px-4 w-full scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {/* Left placement zone */}
        {showLeftZone && <PlacementZone onClick={onPlaceLeft} side="left" />}

        {/* Chain tiles */}
        {chain.map((tile, i) => {
          const isDouble = tile.left === tile.right;
          return (
            <div key={`chain-${i}`} className="flex-none animate-domino-place">
              <DominoTile
                left={tile.left}
                right={tile.right}
                orientation={isDouble ? 'vertical' : 'horizontal'}
                size="sm"
                isDouble={isDouble}
              />
            </div>
          );
        })}

        {/* Right placement zone */}
        {showRightZone && <PlacementZone onClick={onPlaceRight} side="right" />}
      </div>
    </div>
  );
}
