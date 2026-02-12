// Single block cell for the Tetris board
// Renders a colored square with subtle 3D border effect

export function TetrisBlock({ color, size }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderTop: `2px solid ${lighten(color, 30)}`,
        borderLeft: `2px solid ${lighten(color, 20)}`,
        borderBottom: `2px solid ${darken(color, 20)}`,
        borderRight: `2px solid ${darken(color, 15)}`,
        borderRadius: 3,
      }}
    />
  );
}

// Simple color lightening
function lighten(hex, amount) {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amount);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amount);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amount);
  return `rgb(${r},${g},${b})`;
}

// Simple color darkening
function darken(hex, amount) {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
  return `rgb(${r},${g},${b})`;
}
