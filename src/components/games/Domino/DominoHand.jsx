// Player's hand of domino tiles — horizontally scrollable row at bottom

import { DominoTile } from './DominoTile';

export function DominoHand({
  tiles,
  selectedTileId,
  playableTileIds,
  onSelectTile,
  disabled,
  hideHints = false,
}) {
  return (
    <div
      className="flex items-center justify-center gap-2 overflow-x-auto py-3 px-3 scroll-smooth"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
    >
      {tiles.map((tile) => {
        const isActuallyPlayable = !disabled && playableTileIds.has(tile.id);
        // When hints are hidden, all tiles look playable (no dimming)
        const visuallyPlayable = hideHints ? !disabled : isActuallyPlayable;
        const isSelected = selectedTileId === tile.id;
        return (
          <div key={tile.id} className="flex-none">
            <DominoTile
              left={tile.left}
              right={tile.right}
              orientation="horizontal"
              size="lg"
              isSelected={isSelected}
              isPlayable={visuallyPlayable}
              onClick={() => {
                if (!disabled) onSelectTile(tile.id);
              }}
            />
          </div>
        );
      })}
      {tiles.length === 0 && (
        <p className="font-body text-text-secondary text-sm py-2">
          Geen stenen meer!
        </p>
      )}
    </div>
  );
}
