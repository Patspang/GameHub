// Wrapper that loads the correct game component based on the selected game

import { useRef, useCallback } from 'react';
import { GAMES } from '../../games';
import { DUTCH_TEXT } from '../../constants/dutch-text';
import { trackEvent } from '../../utils/analytics';
import { Button } from '../common/Button';

export function GameContainer({ gameId, difficulty, language, onExit, onChangeDifficulty }) {
  const game = GAMES[gameId];
  const GameComponent = game?.component;
  const startTimeRef = useRef(Date.now());

  const handleExit = useCallback(() => {
    const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    trackEvent('game_end', {
      game_id: gameId,
      game_name: game?.name,
      difficulty,
      duration_sec: durationSec,
    });
    onExit();
  }, [gameId, game, difficulty, onExit]);

  const handleChangeDifficulty = useCallback(() => {
    const durationSec = Math.round((Date.now() - startTimeRef.current) / 1000);
    trackEvent('game_end', {
      game_id: gameId,
      game_name: game?.name,
      difficulty,
      duration_sec: durationSec,
    });
    onChangeDifficulty();
  }, [gameId, game, difficulty, onChangeDifficulty]);

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
      language={language}
      onExit={handleExit}
      onChangeDifficulty={handleChangeDifficulty}
    />
  );
}
