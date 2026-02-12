// Visual coin groups showing the addition problem
// Renders countable 🪙 emojis in tens-frame style (rows of 5)
// This is the educational core — the child can count the coins to find the answer

function CoinGroup({ count, alignRight }) {
  // Scale coin size based on count for readability
  const sizeClass = count > 10 ? 'text-2xl gap-0.5' : count > 5 ? 'text-3xl gap-1' : 'text-4xl gap-1.5';

  // For the left group, use RTL direction so partial rows sit flush-right (closer to the + sign)
  return (
    <div
      className={`grid grid-cols-5 ${sizeClass} select-none`}
      style={alignRight ? { direction: 'rtl' } : undefined}
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} role="img" aria-label="munt" style={alignRight ? { direction: 'ltr' } : undefined}>
          🪙
        </span>
      ))}
    </div>
  );
}

export function CoinDisplay({ a, b }) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap my-2">
      {/* Group A — right-aligned so partial rows sit flush against the + sign */}
      <CoinGroup count={a} alignRight />

      {/* Plus sign */}
      <span className="text-4xl font-bold text-primary-coral select-none mx-1">+</span>

      {/* Group B */}
      <CoinGroup count={b} />

      {/* Equals sign + question mark */}
      <span className="text-4xl font-bold text-primary-blue select-none mx-1">=</span>
      <span className="text-4xl font-bold text-primary-blue animate-bounce select-none">?</span>
    </div>
  );
}
