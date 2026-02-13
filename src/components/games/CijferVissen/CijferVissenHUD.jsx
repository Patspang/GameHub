// HUD for Cijfer Vissen — shows mode label, round progress, score

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { getModeLabel } from '../../../utils/fishingProblems';

export function CijferVissenHUD({ difficulty, currentRound, totalRounds, score }) {
  const modeLabel = getModeLabel(difficulty);

  // Fish emoji progress: filled for completed, outlined for remaining
  const progress = [];
  for (let i = 0; i < totalRounds; i++) {
    progress.push(i < currentRound ? '🐟' : '🐟');
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 mb-3 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-primary-blue-dark">
            {modeLabel}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-display font-bold text-md text-text-secondary">
            {DUTCH_TEXT.cijferVissen.hud.catch} {currentRound + 1} {DUTCH_TEXT.cijferVissen.hud.of} {totalRounds}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-text-primary">
            {DUTCH_TEXT.game.score}:
          </span>
          <span className="font-display font-bold text-2xl text-primary-blue-dark">
            {score}
          </span>
        </div>
      </div>

      {/* Fish progress bar */}
      <div className="flex justify-center gap-1 mt-1">
        {progress.map((emoji, i) => (
          <span
            key={i}
            className={`text-lg ${i < currentRound ? 'opacity-100' : 'opacity-30'}`}
          >
            {emoji}
          </span>
        ))}
      </div>
    </div>
  );
}
