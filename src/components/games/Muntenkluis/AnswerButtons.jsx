// Answer input buttons — adapts per difficulty
// Easy: 3 multiple-choice buttons (shuffled)
// Normal: number grid 1-10
// Hard: number grid 1-20

import { useState } from 'react';
import { DIFFICULTY } from '../../../constants/gameConfig';

export function AnswerButtons({ difficulty, correctAnswer, wrongOptions, onAnswer }) {
  const isEasy = difficulty === DIFFICULTY.EASY;
  const isNormal = difficulty === DIFFICULTY.NORMAL;

  if (isEasy) {
    return <MultipleChoice correctAnswer={correctAnswer} wrongOptions={wrongOptions} onAnswer={onAnswer} />;
  }

  const maxNumber = isNormal ? 10 : 20;
  return <NumberGrid maxNumber={maxNumber} onAnswer={onAnswer} />;
}

// Easy mode: 3 large buttons, shuffled once per problem
function MultipleChoice({ correctAnswer, wrongOptions, onAnswer }) {
  const [shuffled] = useState(() =>
    [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5)
  );

  return (
    <div className="flex gap-4 justify-center mt-4">
      {shuffled.map((num) => (
        <button
          key={num}
          onPointerDown={() => onAnswer(num)}
          className="game-interactive font-display font-bold text-4xl
            bg-white text-text-primary border-3 border-primary-blue
            w-24 h-24 rounded-2xl shadow-md cursor-pointer
            active:scale-95 active:bg-primary-blue active:text-white
            flex items-center justify-center"
        >
          {num}
        </button>
      ))}
    </div>
  );
}

// Normal/Hard mode: grid of number buttons
function NumberGrid({ maxNumber, onAnswer }) {
  const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
  const isLarge = maxNumber > 10;

  return (
    <div className={`grid grid-cols-5 gap-2 mt-4 max-w-sm mx-auto ${isLarge ? 'max-w-md' : ''}`}>
      {numbers.map((num) => (
        <button
          key={num}
          onPointerDown={() => onAnswer(num)}
          className={`game-interactive font-display font-bold
            bg-white text-text-primary border-2 border-primary-blue/50
            rounded-xl shadow-sm cursor-pointer
            active:scale-90 active:bg-primary-blue active:text-white
            flex items-center justify-center
            ${isLarge ? 'w-14 h-14 text-xl' : 'w-16 h-16 text-2xl'}`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
