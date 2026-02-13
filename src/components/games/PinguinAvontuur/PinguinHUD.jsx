// HUD for Pinguïn Avontuur — score + fish progress badges

import { DUTCH_TEXT } from '../../../constants/dutch-text';

const T = DUTCH_TEXT.pinguinAvontuur;

export function PinguinHUD({ score, fishCollected, totalFish }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 mb-3 w-full max-w-2xl mx-auto">
      {/* Score */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-text-primary">
            {DUTCH_TEXT.game.score}:
          </span>
          <span className="font-display font-bold text-2xl text-primary-blue-dark">
            {score}
          </span>
        </div>
      </div>

      {/* Fish progress: numbered badges */}
      <div className="flex items-center justify-center gap-1 flex-wrap">
        <span className="font-display font-bold text-md text-text-primary mr-1">
          {T.hud.fish}:
        </span>
        {Array.from({ length: totalFish }, (_, i) => {
          const num = i + 1;
          const isCollected = num <= fishCollected;
          const isCurrent = num === fishCollected + 1;
          return (
            <span
              key={num}
              className={`font-display font-bold text-lg w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200 ${
                isCollected
                  ? 'bg-success-dark text-white scale-90'
                  : isCurrent
                    ? 'bg-primary-yellow text-text-primary scale-110 animate-pulse'
                    : 'bg-bg-secondary text-text-secondary'
              }`}
            >
              {num}
            </span>
          );
        })}
      </div>
    </div>
  );
}
