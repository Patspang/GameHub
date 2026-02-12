// Easy mode: 3 large word buttons (1 correct + 2 wrong)
// Shuffled once per word via useState lazy initializer

import { useState } from 'react';

export function WordChoices({ correctWord, wrongOptions, onChoice }) {
  // Shuffle options once when component mounts (per word)
  const [shuffledOptions] = useState(() =>
    [correctWord, ...wrongOptions].sort(() => Math.random() - 0.5)
  );

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto mt-6">
      {shuffledOptions.map((word) => (
        <button
          key={word}
          onPointerDown={() => onChoice(word)}
          className="game-interactive font-display font-bold text-3xl
            bg-white text-text-primary border-3 border-primary-blue
            px-8 py-5 rounded-2xl shadow-md cursor-pointer
            active:scale-95 active:bg-primary-blue active:text-white"
        >
          {word}
        </button>
      ))}
    </div>
  );
}
