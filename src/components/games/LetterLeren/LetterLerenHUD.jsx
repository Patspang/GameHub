// Score and word progress display for Letter Leren
// Shows score on left, 5 star progress indicators on right

import { DUTCH_TEXT } from '../../../constants/dutch-text';

export function LetterLerenHUD({ score, currentWord, totalWords }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm px-4 py-3 mb-3 w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-lg text-text-primary">
            {DUTCH_TEXT.game.score}:
          </span>
          <span className="font-display font-bold text-2xl text-primary-blue-dark">
            {score}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalWords }, (_, i) => (
            <span key={i} className={`text-2xl ${i < currentWord ? '' : 'opacity-30'}`}>
              {i < currentWord ? '⭐' : '☆'}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
