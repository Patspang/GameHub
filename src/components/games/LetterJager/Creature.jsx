// Friendly creature that roams the maze
// Cute round blob with a happy face - not scary!

const FACES = ['🦄', '🦄', '🦄', '🦄'];

// Map color tokens to actual hex values for inline styles (avoids Tailwind purge issues)
const COLOR_MAP = {
  'creature-1': '#A78BFA',
  'creature-2': '#34D399',
  'creature-3': '#F472B6',
  'creature-4': '#60A5FA',
};

export function Creature({ creature, tileSize }) {
  const size = tileSize * 0.8;
  const offset = (tileSize - size) / 2;

  // Pick a stable face based on creature id
  const faceIndex = parseInt(creature.id.split('-')[1], 10) % FACES.length;

  return (
    <div
      className="absolute transition-all duration-200"
      style={{
        left: creature.col * tileSize + offset,
        top: creature.row * tileSize + offset,
        width: size,
        height: size,
      }}
    >
      <div
        className="w-full h-full rounded-full shadow-md flex items-center justify-center"
        style={{
          backgroundColor: COLOR_MAP[creature.color] || '#A78BFA',
          fontSize: size * 0.5,
        }}
      >
        <span className="select-none" role="img" aria-label="vriendelijk wezen">
          {FACES[faceIndex]}
        </span>
      </div>
    </div>
  );
}
