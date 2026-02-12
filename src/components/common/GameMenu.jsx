// Difficulty selection screen shown after picking a game
// Shows 3 large difficulty buttons and the current high score

import { GAMES } from '../../games';
import { DUTCH_TEXT } from '../../constants/dutch-text';
import { DIFFICULTY } from '../../constants/gameConfig';
import { Button } from './Button';
import { ScoreDisplay } from './ScoreDisplay';

function getDifficultyOptions(gameId) {
  const descriptions = DUTCH_TEXT.menu.difficultyDescription[gameId]
    || DUTCH_TEXT.menu.difficultyDescription['letter-jager'];
  return [
    { key: DIFFICULTY.EASY, label: DUTCH_TEXT.menu.difficulty.easy, description: descriptions.easy, variant: 'success' },
    { key: DIFFICULTY.NORMAL, label: DUTCH_TEXT.menu.difficulty.normal, description: descriptions.normal, variant: 'primary' },
    { key: DIFFICULTY.HARD, label: DUTCH_TEXT.menu.difficulty.hard, description: descriptions.hard, variant: 'warning' },
  ];
}

export function GameMenu({ gameId, onSelectDifficulty, onBack, highScores }) {
  const game = GAMES[gameId];
  if (!game) return null;
  const difficultyOptions = getDifficultyOptions(gameId);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      {/* Game title */}
      <div className="text-6xl mb-4">{game.icon}</div>
      <h1 className="font-display text-4xl font-bold text-text-primary text-center mb-8">
        {game.name}
      </h1>

      {/* Difficulty buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md mb-8">
        {difficultyOptions.map((option) => (
          <Button
            key={option.key}
            variant={option.variant}
            onClick={() => onSelectDifficulty(option.key)}
            className="w-full text-left flex flex-col items-center"
          >
            <span className="text-xl">{option.label}</span>
            <span className="text-sm font-normal opacity-80">{option.description}</span>
          </Button>
        ))}
      </div>

      {/* High scores */}
      <div className="bg-white/60 rounded-2xl p-6 w-full max-w-md mb-6">
        <h3 className="font-display text-lg font-bold text-text-primary mb-3 text-center">
          ⭐ {DUTCH_TEXT.menu.highScore}
        </h3>
        <div className="space-y-2">
          {difficultyOptions.map((option) => (
            <div key={option.key} className="flex justify-between font-body text-text-secondary">
              <span>{option.label}</span>
              <span className="font-bold">{highScores?.[option.key] || 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Back button */}
      <Button variant="accent" size="md" onClick={onBack}>
        🏠 {DUTCH_TEXT.menu.backHome}
      </Button>
    </div>
  );
}
