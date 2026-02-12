// Normal mode: 2x5 grid of letter tiles
// Tapped correct tiles fade out, wrong taps are handled by parent

export function LetterTiles({ tiles, onSelectTile }) {
  return (
    <div className="grid grid-cols-5 gap-3 max-w-md mx-auto mt-6">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          onPointerDown={() => !tile.used && onSelectTile(tile)}
          disabled={tile.used}
          className={`
            game-interactive font-display font-bold text-3xl
            w-16 h-16 rounded-xl shadow-md
            flex items-center justify-center cursor-pointer
            ${tile.used
              ? 'bg-bg-secondary text-text-secondary/30 !transform-none'
              : 'bg-white text-letter border-2 border-primary-blue active:scale-90 active:bg-primary-blue active:text-white'}
          `}
        >
          {tile.letter}
        </button>
      ))}
    </div>
  );
}
