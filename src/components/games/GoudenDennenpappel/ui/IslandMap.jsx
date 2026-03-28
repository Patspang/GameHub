// Island selection map screen

export function IslandMap({ islands, playerName, onSelectIsland, isComplete, onExit }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #1a3d0f 0%, #2d5a1b 60%, #3a6e22 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 20px',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🗺️</div>
        <h1 style={{ color: '#f0d060', fontSize: 28, fontWeight: 'bold', margin: 0 }}>
          De Schatkaart
        </h1>
        <p style={{ color: '#a8e080', fontSize: 16, marginTop: 6 }}>
          Hoi {playerName}! Kies een eiland.
        </p>
      </div>

      {/* Island cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: '100%',
          maxWidth: 480,
        }}
      >
        {islands.map((island) => {
          const done = isComplete(island.id);
          return (
            <button
              key={island.id}
              onClick={() => onSelectIsland(island.id)}
              style={{
                background: done
                  ? 'rgba(124, 204, 92, 0.18)'
                  : 'rgba(255,255,255,0.08)',
                border: `2px solid ${done ? '#7ccc5c' : 'rgba(255,255,255,0.25)'}`,
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span style={{ fontSize: 36 }}>{island.icon}</span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}
                >
                  {island.name}
                </div>
                <div style={{ color: '#a8e080', fontSize: 14 }}>
                  {island.description}
                </div>
              </div>
              <span style={{ fontSize: 24 }}>{done ? '✅' : '▶'}</span>
            </button>
          );
        })}
      </div>

      {/* Back */}
      <button
        onClick={onExit}
        style={{
          marginTop: 36,
          background: 'transparent',
          color: 'rgba(255,255,255,0.55)',
          border: '2px solid rgba(255,255,255,0.2)',
          borderRadius: 10,
          padding: '10px 24px',
          fontSize: 15,
          cursor: 'pointer',
        }}
      >
        ← Terug naar huis
      </button>
    </div>
  );
}
