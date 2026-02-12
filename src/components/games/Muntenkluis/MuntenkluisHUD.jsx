// Score and progress display for Muntenkluis
// Shows score on left, coin progress indicators on right

import { DUTCH_TEXT } from '../../../constants/dutch-text';

export function MuntenkluisHUD({ score, currentProblem, totalProblems }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 mb-3 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-text-primary">
            {DUTCH_TEXT.game.score}:
          </span>
          <span className="font-display font-bold text-2xl text-primary-blue">
            {score}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalProblems }, (_, i) => (
            <span key={i} className={`text-xl ${i < currentProblem ? '' : 'opacity-30'}`}>
              {i < currentProblem ? '🪙' : '⚪'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
