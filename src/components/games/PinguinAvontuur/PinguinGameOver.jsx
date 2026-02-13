// Win screen for Pinguïn Avontuur — no lose condition, always a win

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

const T = DUTCH_TEXT.pinguinAvontuur;

export function PinguinGameOver({ score, isNewHighScore, onRestart, onExit, onChangeDifficulty }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-8xl mb-4">🎉</div>
      <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-3">
        {T.feedback.gameWon}
      </h2>
      <p className="font-body text-xl text-text-secondary text-center mb-2">
        {DUTCH_TEXT.feedback.wellDone}
      </p>

      {/* Penguin + ocean */}
      <div className="flex gap-2 mb-6 text-5xl">
        <span>🐧</span><span>🌊</span>
      </div>

      {/* Score */}
      <div className="bg-white/80 rounded-2xl px-8 py-4 mb-4 text-center">
        <p className="font-display text-lg text-text-secondary">{DUTCH_TEXT.game.score}</p>
        <p className="font-display text-4xl font-bold text-primary-blue-dark">{score}</p>
      </div>

      {isNewHighScore && (
        <div className="bg-primary-yellow text-text-primary font-display font-bold text-lg px-6 py-3 rounded-full mb-6 animate-bounce shadow-lg">
          ⭐ {DUTCH_TEXT.feedback.newHighScore} ⭐
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button variant="success" size="lg" onClick={onRestart}>
          🔄 {DUTCH_TEXT.feedback.playAgain}
        </Button>
        <Button variant="ghost" size="lg" onClick={onChangeDifficulty}>
          🎚️ {DUTCH_TEXT.feedback.changeDifficulty}
        </Button>
        <Button variant="accent" size="lg" onClick={onExit}>
          🏠 {DUTCH_TEXT.menu.backHome}
        </Button>
      </div>
    </div>
  );
}
