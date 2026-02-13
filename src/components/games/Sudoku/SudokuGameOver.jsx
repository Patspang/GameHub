// Win screen for Sudoku — always a win (no lose condition)
// Shows completed puzzles, score, and optional high score badge

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

export function SudokuGameOver({ score, isNewHighScore, onRestart, onExit, onChangeDifficulty }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="text-6xl mb-4">🧩🧩🧩🧩🧩</div>

      <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
        {DUTCH_TEXT.sudoku.feedback.allComplete}
      </h2>

      <p className="font-body text-xl text-text-secondary text-center mb-4">
        {DUTCH_TEXT.feedback.wellDone}
      </p>

      {/* Score display */}
      <div className="bg-white/80 rounded-2xl px-8 py-4 mb-4 text-center">
        <p className="font-display text-lg text-text-secondary">{DUTCH_TEXT.game.score}</p>
        <p className="font-display text-4xl font-bold text-primary-blue">{score}</p>
      </div>

      {isNewHighScore && (
        <div className="bg-primary-yellow text-text-primary font-display font-bold text-lg px-6 py-3 rounded-full mb-6 animate-bounce shadow-lg">
          🧩 {DUTCH_TEXT.feedback.newHighScore} 🧩
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
