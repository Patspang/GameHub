// Renders a single snake segment (head or body)
// Head shows a snake emoji, body segments fade from dark to light green toward the tail

export function SnakeSegment({ segment, index, tileSize, totalLength }) {
  const isHead = index === 0;
  const size = isHead ? tileSize * 0.85 : tileSize * 0.7;
  const offset = (tileSize - size) / 2;

  // Head is darkest, fades toward tail
  const opacity = 1 - (index / Math.max(totalLength, 1)) * 0.4;

  return (
    <div
      className={`absolute ${isHead ? 'z-10' : ''}`}
      style={{
        left: segment.col * tileSize + offset,
        top: segment.row * tileSize + offset,
        width: size,
        height: size,
        transition: 'left 0.08s linear, top 0.08s linear',
      }}
    >
      <div
        className="w-full h-full rounded-full shadow-sm flex items-center justify-center"
        style={{
          backgroundColor: isHead ? '#4A9E4A' : `rgba(76, 153, 76, ${opacity})`,
          fontSize: isHead ? size * 0.55 : 0,
        }}
      >
        {isHead && <span className="select-none">🐍</span>}
      </div>
    </div>
  );
}
