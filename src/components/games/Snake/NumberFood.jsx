// Number items on the snake board
// Target number glows golden and pulses (same visual as Letter Jager's next letter)
// Non-target numbers are smaller and muted

export function NumberFood({ number, tileSize, isTarget }) {
  const size = isTarget ? tileSize * 0.9 : tileSize * 0.55;
  const offset = (tileSize - size) / 2;

  return (
    <div
      className={`
        absolute flex items-center justify-center
        rounded-lg font-display font-bold select-none
        transition-all duration-200
        ${isTarget ? 'text-white animate-pulse z-10' : 'text-white/80'}
      `}
      style={{
        left: number.col * tileSize + offset,
        top: number.row * tileSize + offset,
        width: size,
        height: size,
        fontSize: isTarget ? size * 0.6 : size * 0.55,
        backgroundColor: isTarget ? '#F59E0B' : 'rgba(90, 103, 216, 0.45)',
        boxShadow: isTarget
          ? '0 0 16px 6px rgba(245, 158, 11, 0.55), 0 0 4px 2px rgba(245, 158, 11, 0.3)'
          : 'none',
        border: isTarget ? '3px solid #FBBF24' : 'none',
      }}
    >
      {number.value}
    </div>
  );
}
