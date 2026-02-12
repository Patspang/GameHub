// Renders a single snake segment (head or body)
// Head is a larger darker green circle, body fades from dark to light green toward the tail

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
      }}
    >
      <div
        className="w-full h-full rounded-full shadow-sm"
        style={{
          backgroundColor: isHead ? '#3D8B3D' : `rgba(76, 153, 76, ${opacity})`,
          border: isHead ? '2px solid #2D6B2D' : 'none',
        }}
      />
    </div>
  );
}
