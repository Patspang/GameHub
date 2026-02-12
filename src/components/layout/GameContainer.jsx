// Wrapper that loads the correct game component based on the selected game
// Phase 2: placeholder with back button; Phase 3: actual game rendering

import { GAMES } from '../../games';
import { DUTCH_TEXT } from '../../constants/dutch-text';
import { Button } from '../common/Button';

export function GameContainer({ gameId, difficulty, onExit }) {
  const game = GAMES[gameId];
  const GameComponent = game?.component;

  // Phase 3 will replace this with the actual game component
  if (!GameComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="text-8xl mb-6">{game?.icon || '🎮'}</div>
        <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
          {game?.name || 'Spel'}
        </h2>
        <p className="font-body text-lg text-text-secondary mb-2">
          {DUTCH_TEXT.menu.difficulty[difficulty === 'makkelijk' ? 'easy' : difficulty === 'normaal' ? 'normal' : 'hard']}
        </p>
        <p className="font-body text-md text-text-secondary mb-8">
          Spel wordt geladen in Fase 3...
        </p>
        <Button variant="accent" onClick={onExit}>
          🏠 {DUTCH_TEXT.menu.backHome}
        </Button>
      </div>
    );
  }

  return (
    <GameComponent
      difficulty={difficulty}
      onExit={onExit}
    />
  );
}
