// Game selection screen - the main landing page
// Renders a grid of game tiles from the games registry

import { GAMES } from '../../games';
import { DUTCH_TEXT } from '../../constants/dutch-text';
import { GameTile } from './GameTile';

export function HomePage({ onSelectGame, highScores }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      <h1 className="font-display text-5xl font-bold text-text-primary text-center mb-2">
        🎮 {DUTCH_TEXT.home.title} 🎮
      </h1>
      <p className="font-body text-lg text-text-secondary text-center mb-10">
        Letter Jager - Spellen voor Kinderen
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        {Object.values(GAMES).map((game) => (
          <GameTile
            key={game.id}
            game={game}
            highScore={highScores?.[game.id]}
            onClick={() => onSelectGame(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
