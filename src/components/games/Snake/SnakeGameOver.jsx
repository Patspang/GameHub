// Win/lose screen for Snake game
// Shows encouraging Dutch messages, score, round progress, and high score badge

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

export function SnakeGameOver({ status, score, currentRound, totalRounds, isNewHighScore, onRestart, onExit }) {
  const isWin = status === 'won';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-8xl mb-6">{isWin ? '🎉' : '💪'}</div>
      <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
        {isWin ? DUTCH_TEXT.snake.feedback.gameWon : DUTCH_TEXT.snake.feedback.gameOver}
      </h2>
      <p className="font-body text-xl text-text-secondary text-center mb-2">
        {isWin ? DUTCH_TEXT.feedback.wellDone : DUTCH_TEXT.snake.feedback.tryAgain}
      </p>

      {/* Round progress stars */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: totalRounds }, (_, i) => (
          <span key={i} className={`text-2xl ${i < currentRound ? '' : 'opacity-30'}`}>
            {i < currentRound ? '⭐' : '☆'}
          </span>
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
