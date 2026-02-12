// Dagobert's Muntenkluis — Dutch addition math game
// Turn-based: no game loop, React state + event handlers
// A duck uncle's vault fills with coins as the child solves addition problems
// No lose condition — wrong answers get encouraging feedback

import { useState, useCallback } from 'react';
import { DIFFICULTY, MUNTENKLUIS_CONFIG } from '../../../constants/gameConfig';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { generateProblems, getWrongAnswers } from '../../../utils/mathProblems';
import { CoinVault } from './CoinVault';
import { CoinDisplay } from './CoinDisplay';
import { AnswerButtons } from './AnswerButtons';
import { MuntenkluisHUD } from './MuntenkluisHUD';
import { MuntenkluisGameOver } from './MuntenkluisGameOver';
import { Confetti } from '../../common/Confetti';
import { FlashOverlay } from '../../common/FlashOverlay';

const { SUMS_PER_ROUND, CELEBRATION_DELAY, SCORING, MAX_SUM } = MUNTENKLUIS_CONFIG;

function initRound(difficulty) {
  const problems = generateProblems(difficulty, SUMS_PER_ROUND);
  const maxSum = MAX_SUM[difficulty];
  return {
    problems,
    wrongOptionsPerProblem: difficulty === DIFFICULTY.EASY
      ? problems.map((p) => getWrongAnswers(p.answer, 2, maxSum))
      : [],
    currentProblemIndex: 0,
    score: 0,
    wrongFlash: 0,
    showCelebration: false,
    gameStatus: 'playing',
  };
}

export function Muntenkluis({ difficulty, onExit }) {
  const [state, setState] = useState(() => initRound(difficulty));
  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const currentProblem = state.problems[state.currentProblemIndex];

  // Advance to next problem or finish the round
  const advanceProblem = useCallback((currentScore) => {
    setState((prev) => ({ ...prev, showCelebration: true }));
    playSound('complete');

    setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentProblemIndex + 1;
        if (nextIndex >= SUMS_PER_ROUND) {
          // Round complete — check high score
          const gameScores = scores['muntenkluis'] || {};
          const prevBest = gameScores[difficulty] || 0;
          const newHigh = currentScore > prevBest;
          if (newHigh) {
            setScores((s) => ({
              ...s,
              'muntenkluis': { ...(s['muntenkluis'] || {}), [difficulty]: currentScore },
            }));
            setIsNewHighScore(true);
            playSound('highscore');
          }
          return { ...prev, showCelebration: false, gameStatus: 'won' };
        }
        return {
          ...prev,
          currentProblemIndex: nextIndex,
          showCelebration: false,
        };
      });
    }, CELEBRATION_DELAY);
  }, [difficulty, scores, setScores, playSound]);

  // Handle answer for all difficulty modes
  const handleAnswer = useCallback((chosenAnswer) => {
    if (state.showCelebration) return;

    if (chosenAnswer === currentProblem.answer) {
      const points = SCORING[difficulty];
      const newScore = state.score + points;
      setState((prev) => ({ ...prev, score: newScore }));
      playSound('collect');
      advanceProblem(newScore);
    } else {
      setState((prev) => ({
        ...prev,
        wrongFlash: prev.wrongFlash + 1,
      }));
      playSound('wrong');
    }
  }, [state.showCelebration, state.score, currentProblem, difficulty, advanceProblem, playSound]);

  // Restart with fresh round
  const handleRestart = useCallback(() => {
    setState(initRound(difficulty));
    setIsNewHighScore(false);
  }, [difficulty]);

  // --- Win screen ---
  if (state.gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <Confetti />
        <MuntenkluisGameOver
          score={state.score}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onExit={onExit}
        />
      </div>
    );
  }

  // --- Playing screen ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4">
      <FlashOverlay trigger={state.wrongFlash} />

      <MuntenkluisHUD
        score={state.score}
        currentProblem={state.currentProblemIndex}
        totalProblems={SUMS_PER_ROUND}
      />

      <div className="flex flex-col items-center flex-1 justify-center w-full max-w-2xl">
        <CoinVault
          fillLevel={state.currentProblemIndex}
          totalSlots={SUMS_PER_ROUND}
          showCoinDrop={state.showCelebration}
        />

        {/* Coin display + answer buttons — hidden during celebration */}
        {!state.showCelebration && (
          <>
            <CoinDisplay a={currentProblem.a} b={currentProblem.b} />

            <AnswerButtons
              key={state.currentProblemIndex}
              difficulty={difficulty}
              correctAnswer={currentProblem.answer}
              wrongOptions={state.wrongOptionsPerProblem[state.currentProblemIndex]}
              onAnswer={handleAnswer}
            />
          </>
        )}
      </div>
    </div>
  );
}
