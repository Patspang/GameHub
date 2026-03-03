// Game over screen for Domino

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

const T = DUTCH_TEXT.domino;

export function DominoGameOver({
  totalScore,
  roundsPlayed,
  isNewHighScore,
  onRestart,
  onExit,
  onChangeDifficulty,
}) {
  return (
    <div className="bg-white/90 backdrop-blur rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
      <div className="text-6xl mb-4">🎲</div>
      <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
        {T.feedback.gameOver}
      </h2>
      <p className="font-body text-text-secondary mb-1">
        {T.feedback.roundsPlayed}: {roundsPlayed}
      </p>
      <p className="font-display text-4xl font-bold text-primary-blue-dark mb-2">
        {totalScore}
      </p>
      {isNewHighScore && (
        <p className="font-display text-lg font-bold text-success mb-4 animate-bounce">
          {DUTCH_TEXT.feedback.newHighScore}
        </p>
      )}
      <div className="flex flex-col gap-3 mt-4">
        <Button variant="success" onClick={onRestart}>
          {DUTCH_TEXT.feedback.playAgain}
        </Button>
        <Button variant="ghost" onClick={onChangeDifficulty}>
          {DUTCH_TEXT.feedback.changeDifficulty}
        </Button>
        <Button variant="accent" onClick={onExit}>
          {DUTCH_TEXT.menu.backHome}
        </Button>
      </div>
    </div>
  );
}
