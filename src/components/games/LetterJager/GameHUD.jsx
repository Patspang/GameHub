// Heads-up display shown during gameplay
// Shows score, lives, and word progress with collected letters highlighted
// Tablet-first: stacks vertically on narrow screens, uses large touch-friendly text

import { DUTCH_TEXT } from '../../../constants/dutch-text';

export function GameHUD({ score, lives, currentWord, collectedLetters }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 mb-3 w-full max-w-2xl mx-auto">
      {/* Top row: score and lives */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-text-primary">
            {DUTCH_TEXT.game.score}:
          </span>
          <span className="font-display font-bold text-2xl text-primary-blue">
            {score}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: 3 }, (_, i) => (
            <span key={i} className="text-2xl" role="img" aria-label="leven">
              {i < lives ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom row: word progress - centered, large letter slots */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        <span className="font-display font-bold text-md text-text-primary mr-2">
          {DUTCH_TEXT.game.targetWord}:
        </span>
        {currentWord.split('').map((letter, i) => {
          const isCollected = i < collectedLetters.length;
          return (
            <span
              key={i}
              className={`
                font-display font-bold text-xl w-9 h-9 flex items-center justify-center
                rounded-lg transition-all duration-200
                ${isCollected
                  ? 'bg-success text-white scale-110'
                  : 'bg-bg-secondary text-text-secondary'
                }
              `}
            >
              {isCollected ? collectedLetters[i] : '_'}
            </span>
          );
        })}
      </div>
    </div>
  );
}
