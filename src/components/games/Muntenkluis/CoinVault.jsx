// Dark vault/safe that fills with coins as the child answers correctly
// Features a coin-roll animation: coin rolls in from the left into the vault opening

export function CoinVault({ fillLevel, totalSlots, showCoinDrop }) {
  const fillPercent = (fillLevel / totalSlots) * 100;

  return (
    <div className="flex flex-col items-center mb-3 relative">
      {/* Rolling coin animation — coin rolls from left into the vault slot */}
      {showCoinDrop && (
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 z-20 animate-coin-roll">
          <span className="text-3xl">🪙</span>
        </div>
      )}

      {/* Vault body — dark steel safe */}
      <div className="relative w-60 h-36 rounded-xl border-4 border-gray-700 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 shadow-xl">
        {/* Vault door detail — handle/dial on right side */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-3 border-gray-500 bg-gray-700 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
          </div>
        </div>

        {/* Fill level — gold rising from bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out"
          style={{
            height: `${fillPercent}%`,
            background: 'linear-gradient(to top, #D4A017, #F4D35E, #F4D35E80)',
          }}
        >
          {/* Coins stacked inside */}
          <div className="flex flex-wrap justify-center gap-0.5 p-1 items-end h-full">
            {Array.from({ length: fillLevel }, (_, i) => (
              <span key={i} className="text-xl">
                🪙
              </span>
            ))}
          </div>
        </div>

        {/* Vault slot at top — where coins enter */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-600 rounded-full z-10" />

        {/* Empty state */}
        {fillLevel === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-600 font-display text-sm font-bold tracking-wider">KLUIS</span>
          </div>
        )}
      </div>

      {/* Progress text */}
      <div className="mt-1.5 font-display text-sm text-text-secondary font-bold">
        {fillLevel} / {totalSlots}
      </div>
    </div>
  );
}
