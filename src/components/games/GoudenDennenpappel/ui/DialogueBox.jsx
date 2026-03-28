// Freek's dialogue box — two modes:
// centered=true  → Freek intro/instruction: large modal in the center of the screen
// centered=false → In-game remark: compact dark bar at the bottom

export function DialogueBox({ line, onNext, isLast, centered }) {
  if (centered) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.55)',
          zIndex: 30,
          userSelect: 'none',
          padding: 24,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(160deg, #2e1e0a 0%, #1a0e05 100%)',
            border: '3px solid #7a5a2e',
            borderRadius: 20,
            padding: '28px 28px 24px',
            maxWidth: 480,
            width: '100%',
            boxShadow: '0 8px 48px rgba(0,0,0,0.75)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {/* Character portrait */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 35%, #5a9c30, #2d5a1a)',
              border: '4px solid #8ccc5c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 44,
              boxShadow: '0 0 20px rgba(140,204,92,0.45)',
              flexShrink: 0,
            }}
          >
            🧝
          </div>

          {/* Name */}
          <div
            style={{
              color: '#8ccc5c',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Freek
          </div>

          {/* Dialogue text */}
          <div
            style={{
              color: '#f5f0e8',
              fontSize: 20,
              lineHeight: 1.55,
              fontFamily: 'system-ui, sans-serif',
              textAlign: 'center',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {line}
          </div>

          {/* Next button */}
          <button
            onClick={onNext}
            style={{
              background: 'linear-gradient(180deg, #5a8c2a 0%, #3a6018 100%)',
              color: '#f0f8e8',
              border: '2px solid #8ccc5c',
              borderRadius: 12,
              padding: '13px 36px',
              fontSize: 17,
              fontWeight: 'bold',
              cursor: 'pointer',
              fontFamily: 'system-ui, sans-serif',
              boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
              marginTop: 4,
              letterSpacing: 0.3,
            }}
          >
            {isLast ? 'Oke! ✓' : 'Volgende ▶'}
          </button>
        </div>
      </div>
    );
  }

  // --- Bottom bar (in-game remark) ---
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'linear-gradient(180deg, #2e1e0a 0%, #1a0e05 100%)',
        borderTop: '3px solid #7a5a2e',
        padding: '14px 20px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        zIndex: 20,
        userSelect: 'none',
        minHeight: 88,
        boxShadow: '0 -4px 24px rgba(0,0,0,0.55)',
      }}
    >
      {/* Forest icon badge */}
      <div
        style={{
          flexShrink: 0,
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2d6b1a, #1e4a10)',
          border: '2px solid #4a9c2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 20,
        }}
      >
        🌲
      </div>

      {/* Character portrait — oval with elf face */}
      <div
        style={{
          flexShrink: 0,
          width: 58,
          height: 66,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 35%, #5a9c30, #2d5a1a)',
          border: '3px solid #8ccc5c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          boxShadow: '0 0 14px rgba(140, 204, 92, 0.35)',
          overflow: 'hidden',
        }}
      >
        🧝
      </div>

      {/* Name + dialogue text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: '#8ccc5c',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: 'uppercase',
            marginBottom: 5,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          Freek
        </div>
        <div
          style={{
            color: '#f5f0e8',
            fontSize: 17,
            lineHeight: 1.5,
            fontFamily: 'system-ui, sans-serif',
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
        >
          {line}
        </div>
      </div>

      {/* Next / Done button */}
      <button
        onClick={onNext}
        style={{
          flexShrink: 0,
          background: 'linear-gradient(180deg, #4a3418 0%, #2e1e08 100%)',
          color: '#f0e8d0',
          border: '2px solid #7a5a2e',
          borderRadius: 10,
          padding: '11px 22px',
          fontSize: 15,
          fontWeight: 'bold',
          cursor: 'pointer',
          alignSelf: 'center',
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,220,140,0.1)',
          letterSpacing: 0.3,
        }}
      >
        {isLast ? 'Oke! ✓' : 'Volgende ▶'}
      </button>
    </div>
  );
}
