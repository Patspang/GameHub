// Number input buttons for Sudoku
// Shows digits 1-N + a clear button
// Disabled (faded) when no cell is selected

export function NumberPicker({ maxNumber, onPick, onClear, hasSelection }) {
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);

  // Layout: single row for 4/6, wrap for 9
  const gridClass = maxNumber <= 6
    ? `flex flex-wrap justify-center gap-2`
    : `grid grid-cols-5 gap-2`;

  // Button size scales with number count
  const sizeClass = maxNumber <= 4
    ? 'w-16 h-16 text-2xl'
    : maxNumber <= 6
      ? 'w-14 h-14 text-xl'
      : 'w-12 h-12 text-lg';

  return (
    <div className={`${gridClass} mt-6 max-w-sm mx-auto`}>
      {numbers.map((num) => (
        <button
          key={num}
          onPointerDown={() => hasSelection && onPick(num)}
          className={`
            game-interactive font-display font-bold
            bg-white text-text-primary border-2 border-primary-blue/40
            rounded-xl shadow-sm
            flex items-center justify-center
            ${sizeClass}
            ${hasSelection
              ? 'cursor-pointer active:scale-90 active:bg-primary-blue active:text-white'
              : 'opacity-35 cursor-not-allowed'}
          `}
        >
          {num}
        </button>
      ))}
      {/* Clear button */}
      <button
        onPointerDown={() => hasSelection && onClear()}
        className={`
          game-interactive font-display font-bold
          bg-primary-coral/15 text-primary-coral border-2 border-primary-coral/40
          rounded-xl shadow-sm
          flex items-center justify-center
          ${sizeClass}
          ${hasSelection
            ? 'cursor-pointer active:scale-90 active:bg-primary-coral active:text-white'
            : 'opacity-35 cursor-not-allowed'}
        `}
      >
        ✕
      </button>
    </div>
  );
}
