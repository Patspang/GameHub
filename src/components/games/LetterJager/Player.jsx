// The player character - a friendly orange circle with eyes
// Blinks when invincible after creature collision

export function Player({ player, tileSize, isInvincible }) {
  const size = tileSize * 0.8;
  const offset = (tileSize - size) / 2;

  return (
    <div
      className={`absolute transition-all duration-100 ${isInvincible ? 'animate-pulse' : ''}`}
      style={{
        left: player.col * tileSize + offset,
        top: player.row * tileSize + offset,
        width: size,
        height: size,
      }}
    >
      {/* Body */}
      <div
        className="w-full h-full rounded-full bg-player shadow-md flex items-center justify-center"
        style={{ fontSize: size * 0.5 }}
      >
        {/* Face - direction aware */}
        <span className="select-none" role="img" aria-label="speler">
          {player.direction === 'left' ? '😊' : player.direction === 'right' ? '😊' : '😊'}
        </span>
      </div>
    </div>
  );
}
