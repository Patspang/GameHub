// Freek's dialogue box — dark wooden bottom bar matching the reference design.
// Full-width panel with character portrait, name label, text, and next button.

export function DialogueBox({ line, onNext, isLast }) {
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
