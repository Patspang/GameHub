// Top bar for Memory game — moves counter, pairs progress, score

import { DUTCH_TEXT } from '../../../constants/dutch-text';

export function MemoryHUD({ moves, matchedPairs, totalPairs, score }) {
  const t = DUTCH_TEXT.memory.hud;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 mb-3 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-text-primary">
              {DUTCH_TEXT.game.score}:
            </span>
            <span className="font-display font-bold text-xl text-primary-blue-dark">
              {score}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display font-bold text-text-primary">
              {t.moves}:
            </span>
            <span className="font-display font-bold text-xl text-primary-coral-dark">
              {moves}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-display font-bold text-text-secondary">
            {matchedPairs}/{totalPairs}
          </span>
          <span className="text-xl">🧠</span>
        </div>
      </div>
    </div>
  );
}
