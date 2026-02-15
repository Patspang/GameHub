// Top HUD bar for Bos Ritje
// Shows level name, stars progress, level counter

import { DUTCH_TEXT } from '../../../constants/dutch-text';

export function BosRitjeHUD({ levelData, earnedStars, totalLevels }) {
  const t = DUTCH_TEXT.bosRitje.game;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white/60 rounded-xl mb-2 max-w-[600px] mx-auto">
      {/* Level info */}
      <div className="flex items-center gap-2">
        <span className="font-display font-bold text-primary-blue-dark">
          {t.level} {levelData.id}
        </span>
        <span className="font-body text-text-secondary text-sm">
          {levelData.name}
        </span>
      </div>

      {/* Stars */}
      <div className="flex gap-1">
        {[1, 2, 3].map((star) => (
          <span key={star} className={`text-xl ${earnedStars >= star ? '' : 'opacity-30'}`}>
            ⭐
          </span>
        ))}
      </div>

      {/* Level counter */}
      <span className="font-display text-sm font-bold text-text-secondary">
        {levelData.id}/{totalLevels}
      </span>
    </div>
  );
}
