// Displays a high score with label, used on game tiles and menu screens

import { DUTCH_TEXT } from '../../constants/dutch-text';

export function ScoreDisplay({ score, className = '' }) {
  if (score == null || score === 0) return null;

  return (
    <div className={`font-body text-sm ${className}`}>
      {DUTCH_TEXT.menu.highScore}: {score}
    </div>
  );
}
