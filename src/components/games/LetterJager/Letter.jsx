// A collectible letter in the maze
// The next letter to collect is large, glowing, and pulsing
// Other letters are small and muted so they don't distract

export function Letter({ letter, tileSize, isNext }) {
  // Next letter is bigger and fills more of the tile
  const size = isNext ? tileSize * 0.9 : tileSize * 0.55;
  const offset = (tileSize - size) / 2;

  return (
    <div
      className={`
        absolute flex items-center justify-center
        rounded-lg font-display font-bold select-none
        transition-all duration-200
        ${isNext
          ? 'text-white animate-pulse z-10'
          : 'text-white/80'
        }
      `}
      style={{
        left: letter.col * tileSize + offset,
        top: letter.row * tileSize + offset,
        width: size,
        height: size,
        fontSize: isNext ? size * 0.6 : size * 0.55,
        backgroundColor: isNext ? '#F59E0B' : 'rgba(90, 103, 216, 0.45)',
        boxShadow: isNext
          ? '0 0 16px 6px rgba(245, 158, 11, 0.55), 0 0 4px 2px rgba(245, 158, 11, 0.3)'
          : 'none',
        border: isNext ? '3px solid #FBBF24' : 'none',
      }}
    >
      {letter.letter}
    </div>
  );
}
