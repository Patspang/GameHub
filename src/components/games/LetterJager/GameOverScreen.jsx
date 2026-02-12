// Shown when game ends (win or lose)
// Encouraging messages, score display, new high score badge, and play again / home buttons

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

export function GameOverScreen({ status, score, word, isNewHighScore, onRestart, onExit }) {
  const isWin = status === 'won';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      {/* Emoji celebration or encouragement */}
      <div className="text-8xl mb-6">
        {isWin ? '🎉' : '💪'}
      </div>

      {/* Title */}
      <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
        {isWin ? DUTCH_TEXT.feedback.wordComplete : DUTCH_TEXT.feedback.gameOver}
      </h2>

      {/* Subtitle */}
      <p className="font-body text-xl text-text-secondary text-center mb-2">
        {isWin ? DUTCH_TEXT.feedback.wellDone : DUTCH_TEXT.feedback.almostThere}
      </p>

      {/* Word completed */}
      {isWin && word && (
        <div className="flex gap-2 mb-6">
          {word.split('').map((letter, i) => (
            <span
              key={i}
              className="font-display font-bold text-3xl w-12 h-12 flex items-center justify-center rounded-lg bg-success text-white"
            >
              {letter}
            </span>
          ))}
        </div>
      )}

      {/* Score */}
      <div className="bg-white/80 rounded-2xl px-8 py-4 mb-4 text-center">
        <p className="font-display text-lg text-text-secondary">
          {DUTCH_TEXT.game.score}
        </p>
        <p className="font-display text-4xl font-bold text-primary-blue">
          {score}
        </p>
      </div>

      {/* New high score badge */}
      {isNewHighScore && (
        <div className="bg-primary-yellow text-text-primary font-display font-bold text-lg px-6 py-3 rounded-full mb-6 animate-bounce shadow-lg">
          ⭐ {DUTCH_TEXT.feedback.newHighScore} ⭐
        </div>
      )}

      {/* Action buttons */}
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
