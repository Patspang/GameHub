// Game over screen for Tetris
// Shows score, level reached, lines cleared, encouraging Dutch messages

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

export function TetrisGameOver({ score, level, linesCleared, isNewHighScore, onRestart, onExit, onChangeDifficulty }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-8xl mb-6">💪</div>
      <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
        {DUTCH_TEXT.tetris.feedback.gameOver}
      </h2>
      <p className="font-body text-xl text-text-secondary text-center mb-6">
        {linesCleared >= 10 ? DUTCH_TEXT.tetris.feedback.greatJob : DUTCH_TEXT.tetris.feedback.tryAgain}
      </p>

      {/* Stats */}
      <div className="bg-white/80 rounded-2xl px-8 py-4 mb-4 text-center space-y-2">
        <div>
          <p className="font-display text-lg text-text-secondary">{DUTCH_TEXT.game.score}</p>
          <p className="font-display text-4xl font-bold text-primary-blue-dark">{score}</p>
        </div>
        <div className="flex gap-8 justify-center">
          <div>
            <p className="font-display text-sm text-text-secondary">{DUTCH_TEXT.tetris.hud.level}</p>
            <p className="font-display text-2xl font-bold text-text-primary">{level}</p>
          </div>
          <div>
            <p className="font-display text-sm text-text-secondary">{DUTCH_TEXT.tetris.hud.lines}</p>
            <p className="font-display text-2xl font-bold text-text-primary">{linesCleared}</p>
          </div>
        </div>
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
        <Button variant="ghost" onClick={onChangeDifficulty}>
          🎚️ {DUTCH_TEXT.feedback.changeDifficulty}
        </Button>
        <Button variant="accent" onClick={onExit}>
          🏠 {DUTCH_TEXT.menu.backHome}
        </Button>
      </div>
    </div>
  );
}
