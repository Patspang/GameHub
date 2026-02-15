// Single memory card with CSS 3D flip animation
// Back: colored gradient with ❓, Front: large emoji on white

export function MemoryCard({ emoji, isFlipped, isMatched, onClick, cardSize }) {
  const showFace = isFlipped || isMatched;

  return (
    <button
      onClick={() => !showFace && onClick()}
      disabled={showFace}
      className="cursor-pointer disabled:cursor-default"
      style={{
        width: cardSize,
        height: cardSize,
        perspective: '600px',
      }}
      aria-label={showFace ? emoji : 'Kaart omdraaien'}
    >
      <div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
          transform: showFace ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Back face (visible when not flipped) */}
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center
            bg-gradient-to-br from-primary-blue to-primary-green shadow-md
            ${!showFace ? 'active:scale-90' : ''}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <span className="text-3xl opacity-60">❓</span>
        </div>

        {/* Front face (visible when flipped) */}
        <div
          className={`absolute inset-0 rounded-2xl flex items-center justify-center
            bg-white shadow-md
            ${isMatched ? 'ring-4 ring-success scale-95 opacity-75' : ''}`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <span style={{ fontSize: cardSize * 0.55 }}>{emoji}</span>
        </div>
      </div>
    </button>
  );
}
