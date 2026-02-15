// Memory — card matching game for kids
// Turn-based: no game loop, React state + event handlers
// Player flips two cards per move; matches stay face-up
// No lose condition — game ends when all pairs found

import { useState, useCallback, useRef } from 'react';
import { MEMORY_CONFIG } from '../../../constants/gameConfig';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { createDeck, calculateScore } from './memoryUtils';
import { MemoryGrid } from './MemoryGrid';
import { MemoryHUD } from './MemoryHUD';
import { MemoryGameOver } from './MemoryGameOver';
import { Confetti } from '../../common/Confetti';

const { GRID, FLIP_DELAY, CELEBRATION_DELAY } = MEMORY_CONFIG;

function initGame(difficulty) {
  const { rows, cols } = GRID[difficulty];
  const pairCount = (rows * cols) / 2;
  return {
    cards: createDeck(pairCount),
    cols,
    pairCount,
    flippedIds: [],       // currently face-up (max 2)
    matchedCount: 0,
    moves: 0,
    score: 0,
    isChecking: false,    // true while waiting for flip-back delay
    gameStatus: 'playing',
  };
}

export function Memory({ difficulty, onExit, onChangeDifficulty }) {
  const [state, setState] = useState(() => initGame(difficulty));
  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const timerRef = useRef(null);

  const handleCardClick = useCallback((cardId) => {
    setState((prev) => {
      if (prev.isChecking) return prev;
      if (prev.flippedIds.length >= 2) return prev;
      if (prev.flippedIds.includes(cardId)) return prev;

      const card = prev.cards.find((c) => c.id === cardId);
      if (!card || card.isMatched || card.isFlipped) return prev;

      // Flip the card
      const newCards = prev.cards.map((c) =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      );
      const newFlipped = [...prev.flippedIds, cardId];

      if (newFlipped.length === 2) {
        // Two cards flipped — check for match
        const [firstId, secondId] = newFlipped;
        const first = newCards.find((c) => c.id === firstId);
        const second = newCards.find((c) => c.id === secondId);
        const newMoves = prev.moves + 1;

        if (first.emoji === second.emoji) {
          // Match found
          const matchedCards = newCards.map((c) =>
            c.id === firstId || c.id === secondId
              ? { ...c, isMatched: true }
              : c
          );
          const newMatchedCount = prev.matchedCount + 1;
          playSound('collect');

          if (newMatchedCount === prev.pairCount) {
            // All pairs found — game won
            const finalScore = calculateScore(newMoves, prev.pairCount, difficulty);

            timerRef.current = setTimeout(() => {
              const gameScores = scores['memory'] || {};
              const prevBest = gameScores[difficulty] || 0;
              if (finalScore > prevBest) {
                setScores((s) => ({
                  ...s,
                  memory: { ...(s.memory || {}), [difficulty]: finalScore },
                }));
                setIsNewHighScore(true);
                playSound('highscore');
              } else {
                playSound('complete');
              }
              setState((p) => ({ ...p, gameStatus: 'won', isChecking: false }));
            }, CELEBRATION_DELAY);

            return {
              ...prev,
              cards: matchedCards,
              flippedIds: [],
              matchedCount: newMatchedCount,
              moves: newMoves,
              score: finalScore,
              isChecking: true,
            };
          }

          return {
            ...prev,
            cards: matchedCards,
            flippedIds: [],
            matchedCount: newMatchedCount,
            moves: newMoves,
          };
        } else {
          // No match — flip back after delay
          playSound('wrong');

          timerRef.current = setTimeout(() => {
            setState((p) => ({
              ...p,
              cards: p.cards.map((c) =>
                c.id === firstId || c.id === secondId
                  ? { ...c, isFlipped: false }
                  : c
              ),
              flippedIds: [],
              isChecking: false,
            }));
          }, FLIP_DELAY);

          return {
            ...prev,
            cards: newCards,
            flippedIds: newFlipped,
            moves: newMoves,
            isChecking: true,
          };
        }
      }

      // First card of a pair
      return {
        ...prev,
        cards: newCards,
        flippedIds: newFlipped,
      };
    });
  }, [difficulty, scores, setScores, playSound]);

  const handleRestart = useCallback(() => {
    clearTimeout(timerRef.current);
    setState(initGame(difficulty));
    setIsNewHighScore(false);
  }, [difficulty]);

  // Win screen
  if (state.gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <Confetti />
        <MemoryGameOver
          score={state.score}
          moves={state.moves}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onExit={onExit}
          onChangeDifficulty={onChangeDifficulty}
        />
      </div>
    );
  }

  // Playing screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4 no-select">
      <MemoryHUD
        moves={state.moves}
        matchedPairs={state.matchedCount}
        totalPairs={state.pairCount}
        score={state.score}
      />

      <div className="flex flex-col items-center flex-1 justify-center w-full max-w-2xl">
        <MemoryGrid
          cards={state.cards}
          cols={state.cols}
          onCardClick={handleCardClick}
        />
      </div>
    </div>
  );
}
