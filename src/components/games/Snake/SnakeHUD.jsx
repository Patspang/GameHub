// Score, lives, round counter, and number sequence progress display for Snake
// Shows which numbers have been eaten and which is the current target

import { DUTCH_TEXT } from '../../../constants/dutch-text';

export function SnakeHUD({ score, targetNumber, maxNumber, currentRound, totalRounds }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 mb-3 w-full max-w-2xl mx-auto">
      {/* Top row: score and round */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-text-primary">
            {DUTCH_TEXT.game.score}:
          </span>
          <span className="font-display font-bold text-2xl text-primary-blue-dark">
            {score}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-md text-text-secondary">
            {DUTCH_TEXT.snake.hud.round} {currentRound}/{totalRounds}
          </span>
        </div>
      </div>

      {/* Bottom row: number sequence progress */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        <span className="font-display font-bold text-md text-text-primary mr-1">
          {DUTCH_TEXT.snake.hud.target}:
        </span>
        {Array.from({ length: maxNumber }, (_, i) => {
          const num = i + 1;
          const isEaten = num < targetNumber;
          const isCurrent = num === targetNumber;
          return (
            <span
              key={num}
              className={`
                font-display font-bold text-lg w-9 h-9 flex items-center justify-center
                rounded-lg transition-all duration-200
                ${isEaten ? 'bg-success-dark text-white scale-90' :
                  isCurrent ? 'bg-primary-yellow text-text-primary scale-110 animate-pulse' :
                  'bg-bg-secondary text-text-secondary'}
              `}
            >
              {num}
            </span>
          );
        })}
      </div>
    </div>
  );
}
