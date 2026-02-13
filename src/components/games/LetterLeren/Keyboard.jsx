// Hard mode: visual QWERTY keyboard with large touch-friendly keys
// Also listens for physical keyboard input

import { useEffect } from 'react';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

export function Keyboard({ onKeyPress }) {
  // Also listen for physical keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      const letter = e.key.toUpperCase();
      if (/^[A-Z]$/.test(letter)) {
        e.preventDefault();
        onKeyPress(letter);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onKeyPress]);

  return (
    <div className="flex flex-col items-center gap-2 mt-6">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 justify-center">
          {row.map((letter) => (
            <button
              key={letter}
              onPointerDown={() => onKeyPress(letter)}
              className="game-interactive font-display font-bold text-xl
                min-w-[44px] h-14 px-2 rounded-lg shadow-sm cursor-pointer
                bg-white text-text-primary border border-primary-blue-dark/30
                active:scale-90 active:bg-primary-blue active:text-white"
            >
              {letter}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
