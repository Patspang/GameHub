// Opdracht HUD — top-right wooden-themed quest panel
// Shows mushroom collection progress + log/path status

export function CollectableHUD({ mushroomCount, totalMushrooms, logRolled }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        right: 16,
        background: 'linear-gradient(180deg, #2e1e0a 0%, #1a0e05 100%)',
        border: '2px solid #7a5a2e',
        borderRadius: 12,
        overflow: 'hidden',
        minWidth: 168,
        boxShadow: '0 4px 18px rgba(0,0,0,0.55)',
        zIndex: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(90deg, #3d2510, #2e1808)',
          borderBottom: '2px solid #7a5a2e',
          padding: '7px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <span style={{ fontSize: 14 }}>📜</span>
        <span
          style={{
            color: '#f0d060',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Opdracht
        </span>
      </div>

      <div style={{ padding: '10px 14px 12px', display: 'flex', flexDirection: 'column', gap: 9 }}>

        {/* Mushroom progress */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 20, lineHeight: 1 }}>🍄</span>
          <div style={{ display: 'flex', gap: 5 }}>
            {Array.from({ length: totalMushrooms }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: i < mushroomCount
                    ? 'radial-gradient(circle at 35% 35%, #ff5555, #cc1111)'
                    : 'rgba(255,255,255,0.1)',
                  border: '2px solid',
                  borderColor: i < mushroomCount ? '#ff6666' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s',
                  transform: i < mushroomCount ? 'scale(1.12)' : 'scale(1)',
                  boxShadow: i < mushroomCount ? '0 0 6px rgba(220,40,40,0.5)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Log / path status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontSize: 18, lineHeight: 1, opacity: logRolled ? 1 : 0.4 }}>🪵</span>
          <span
            style={{
              color: logRolled ? '#8ccc5c' : 'rgba(255,255,255,0.4)',
              fontSize: 12,
              fontWeight: logRolled ? 700 : 400,
              fontFamily: 'system-ui, sans-serif',
              transition: 'color 0.3s',
            }}
          >
            {logRolled ? 'Pad vrij!' : 'Pad geblokkeerd'}
          </span>
        </div>

      </div>
    </div>
  );
}
