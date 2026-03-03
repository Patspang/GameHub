// HUD bar for Domino: turn indicator, boneyard count, score, computer tiles

import { DUTCH_TEXT } from '../../../constants/dutch-text';

const T = DUTCH_TEXT.domino;

export function DominoHUD({
  isPlayerTurn,
  totalScore,
  boneyardCount,
  computerTileCount,
}) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-md">
      {/* Turn indicator */}
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${isPlayerTurn ? 'bg-success animate-pulse' : 'bg-primary-blue-dark animate-pulse'}`} />
        <span className="font-display text-sm font-bold text-text-primary">
          {isPlayerTurn ? T.hud.yourTurn : T.hud.computerThinking}
        </span>
      </div>

      {/* Center: boneyard + computer tiles */}
      <div className="flex items-center gap-3 text-sm text-text-secondary font-body">
        <span>{T.hud.pot}: {boneyardCount}</span>
        <span className="text-text-tertiary">|</span>
        <span>🤖 {computerTileCount}</span>
      </div>

      {/* Score */}
      <div className="font-display font-bold text-primary-blue-dark text-lg">
        {totalScore}
      </div>
    </div>
  );
}
