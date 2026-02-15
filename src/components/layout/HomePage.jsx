// Game selection screen - the main landing page
// Renders a grid of game tiles from the games registry
// Shows top 3 most-played games in a featured row when available
// Shows a name popup on first visit, personalized greeting after

import { useState, useMemo } from 'react';
import { GAMES } from '../../games';
import { DUTCH_TEXT } from '../../constants/dutch-text';
import { GameTile } from './GameTile';
import { Button } from '../common/Button';

function isNewGame(game) {
  if (!game.createdAt) return false;
  const created = new Date(game.createdAt);
  const now = new Date();
  const diffDays = (now - created) / (1000 * 60 * 60 * 24);
  return diffDays <= 5;
}

export function HomePage({ onSelectGame, highScores, playCounts, playerName, onNameSet }) {
  const [nameInput, setNameInput] = useState('');
  const showNamePopup = !playerName;

  const handleSubmitName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      onNameSet(trimmed);
    }
  };

  // Compute top 3 most-played games (only when at least 3 games have been played)
  const { topGames, remainingGames } = useMemo(() => {
    const allGames = Object.values(GAMES);
    const gamesWithCounts = allGames
      .filter((g) => g.available && (playCounts?.[g.id] || 0) > 0)
      .sort((a, b) => (playCounts[b.id] || 0) - (playCounts[a.id] || 0));

    if (gamesWithCounts.length < 3) {
      return { topGames: [], remainingGames: allGames };
    }

    const top3Ids = new Set(gamesWithCounts.slice(0, 3).map((g) => g.id));
    return {
      topGames: gamesWithCounts.slice(0, 3),
      remainingGames: allGames.filter((g) => !top3Ids.has(g.id)),
    };
  }, [playCounts]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
      {/* Name popup overlay */}
      {showNamePopup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="font-display text-3xl font-bold text-text-primary text-center mb-6">
              {DUTCH_TEXT.home.namePrompt}
            </h2>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitName()}
              placeholder="..."
              autoFocus
              className="font-display text-2xl text-center text-text-primary
                w-full px-4 py-3 mb-6 rounded-2xl border-3 border-primary-blue
                focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
              maxLength={20}
            />
            <Button variant="success" onClick={handleSubmitName} className="w-full">
              {DUTCH_TEXT.home.nameButton}
            </Button>
          </div>
        </div>
      )}

      <h1 className="font-display text-5xl font-bold text-text-primary text-center mb-2">
        🎮 {playerName ? `${DUTCH_TEXT.home.greeting} ${playerName}, kies je spel` : DUTCH_TEXT.home.title} 🎮
      </h1>
      <p className="font-body text-lg text-text-secondary text-center mb-10">
        GameHub - Leren op een spelende wijze
      </p>

      {/* Top 3 favorites row */}
      {topGames.length === 3 && (
        <>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
            {DUTCH_TEXT.home.favorites}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-8">
            {topGames.map((game) => (
              <GameTile
                key={game.id}
                game={game}
                highScore={highScores?.[game.id]}
                isNew={isNewGame(game)}
                onClick={() => onSelectGame(game.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* All other games */}
      {topGames.length === 3 && (
        <h2 className="font-display text-2xl font-bold text-text-primary mb-4">
          {DUTCH_TEXT.home.otherGames}
        </h2>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
        {remainingGames.map((game) => (
          <GameTile
            key={game.id}
            game={game}
            highScore={highScores?.[game.id]}
            isNew={isNewGame(game)}
            onClick={() => onSelectGame(game.id)}
          />
        ))}
      </div>
    </div>
  );
}
