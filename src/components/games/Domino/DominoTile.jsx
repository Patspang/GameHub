// Visual rendering of a single domino tile
// Uses CSS grid for standard dot patterns (0-6)

// Dot positions in a 3x3 grid for each pip count
// Grid cells numbered: 0=TL 1=TC 2=TR 3=ML 4=MC 5=MR 6=BL 7=BC 8=BR
const DOT_POSITIONS = {
  0: [],
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

function DotHalf({ value, dotSize, className = '' }) {
  const positions = DOT_POSITIONS[value] || [];
  return (
    <div className={`grid grid-cols-3 grid-rows-3 gap-px ${className}`}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} className="flex items-center justify-center">
          {positions.includes(i) && (
            <div
              className="rounded-full bg-text-primary"
              style={{ width: dotSize, height: dotSize }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function DominoTile({
  left,
  right,
  orientation = 'horizontal', // 'horizontal' | 'vertical'
  size = 'lg',                 // 'sm' (chain) | 'lg' (hand)
  isSelected = false,
  isFaceDown = false,
  isPlayable = true,
  isDouble = false,
  onClick,
}) {
  const isHorizontal = orientation === 'horizontal';
  const isSmall = size === 'sm';

  // Dimensions — lg is for player hand (big touch targets), sm is for chain
  const tileW = isSmall ? (isHorizontal ? 64 : 32) : (isHorizontal ? 88 : 44);
  const tileH = isSmall ? (isHorizontal ? 32 : 64) : (isHorizontal ? 44 : 88);
  const dotSize = isSmall ? 5 : 7;
  const halfPad = isSmall ? 'p-1' : 'p-1.5';

  // Face-down tile (computer's hand)
  if (isFaceDown) {
    return (
      <div
        className="rounded-lg bg-primary-blue-dark shadow-md flex items-center justify-center"
        style={{ width: tileW, height: tileH, minWidth: tileW }}
      >
        <span className="text-white/40 font-bold" style={{ fontSize: isSmall ? 12 : 18 }}>?</span>
      </div>
    );
  }

  const selectedRing = isSelected
    ? 'ring-3 ring-primary-blue scale-105'
    : '';
  const playableStyle = !isPlayable
    ? 'opacity-40'
    : 'cursor-pointer';
  const hoverStyle = isPlayable && onClick
    ? 'hover:shadow-lg active:scale-95 transition-transform'
    : '';

  return (
    <div
      className={`rounded-lg bg-white shadow-md border border-gray-200
        flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-stretch
        ${selectedRing} ${playableStyle} ${hoverStyle}`}
      style={{ width: tileW, height: tileH, minWidth: tileW }}
      onClick={isPlayable && onClick ? onClick : undefined}
    >
      <DotHalf value={left} dotSize={dotSize} className={`flex-1 ${halfPad}`} />
      {/* Divider line */}
      {isHorizontal ? (
        <div className="w-px bg-gray-300 self-stretch" />
      ) : (
        <div className="h-px bg-gray-300 self-stretch" />
      )}
      <DotHalf value={right} dotSize={dotSize} className={`flex-1 ${halfPad}`} />
    </div>
  );
}
