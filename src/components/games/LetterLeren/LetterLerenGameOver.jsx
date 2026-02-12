// Win screen for Letter Leren — always a win (no lose condition)
// Shows 5 filled stars, score, optional high score badge, and action buttons

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

export function LetterLerenGameOver({ score, isNewHighScore, onRestart, onExit }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-8xl mb-6">🎉</div>

      <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
        {DUTCH_TEXT.letterLeren.feedback.allComplete}
      </h2>

      <p className="font-body text-xl text-text-secondary text-center mb-2">
        {DUTCH_TEXT.feedback.wellDone}
      </p>

      {/* 5 filled stars */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className="text-3xl">⭐</span>
        ))}
      </div>

      {/* Score display */}
      <div className="bg-white/80 rounded-2xl px-8 py-4 mb-4 text-center">
        <p className="font-display text-lg text-text-secondary">{DUTCH_TEXT.game.score}</p>
        <p className="font-display text-4xl font-bold text-primary-blue">{score}</p>
      </div>

      {isNewHighScore && (
        <div className="bg-primary-yellow text-text-primary font-display font-bold text-lg px-6 py-3 rounded-full mb-6 animate-bounce shadow-lg">
          ⭐ {DUTCH_TEXT.feedback.newHighScore} ⭐
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="success" onClick={onRestart}>
          🔄 {DUTCH_TEXT.feedback.playAgain}
        </Button>
        <Button variant="accent" onClick={onExit}>
          🏠 {DUTCH_TEXT.menu.backHome}
        </Button>
      </div>
    </div>
  );
}
