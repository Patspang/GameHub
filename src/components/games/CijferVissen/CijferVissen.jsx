// Cijfer Vissen — educational fishing math game
// Top-down pond: boat shows math problem, 3 fish swim with answers
// Tap correct fish to catch it, wrong fish shakes and swims away
// 5 rounds per session, star-based reward (no lose condition)

import { useState, useCallback, useRef } from 'react';
import { CIJFER_VISSEN_CONFIG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { generateRoundProblems } from '../../../utils/fishingProblems';
import { PondCanvas } from './PondCanvas';
import { CijferVissenHUD } from './CijferVissenHUD';
import { CijferVissenReward } from './CijferVissenReward';
import { Confetti } from '../../common/Confetti';
import { FlashOverlay } from '../../common/FlashOverlay';

const {
  ROUNDS_PER_SESSION,
  CELEBRATION_DELAY,
  STAR_THRESHOLDS,
  SCORING,
} = CIJFER_VISSEN_CONFIG;

function calculateStars(totalMistakes) {
  if (totalMistakes <= STAR_THRESHOLDS.THREE_STARS) return 3;
  if (totalMistakes <= STAR_THRESHOLDS.TWO_STARS) return 2;
  return 1;
}

function calculateScore(roundMistakes) {
  let score = 0;
  for (const mistakes of roundMistakes) {
    score += SCORING.PER_ROUND;
    if (mistakes === 0) score += SCORING.PERFECT_ROUND_BONUS;
  }
  score += SCORING.SESSION_COMPLETE_BONUS;
  const totalMistakes = roundMistakes.reduce((a, b) => a + b, 0);
  if (totalMistakes <= STAR_THRESHOLDS.THREE_STARS) {
    score += SCORING.THREE_STAR_BONUS;
  }
  return score;
}

function initSession(difficulty) {
  const problems = generateRoundProblems(difficulty, ROUNDS_PER_SESSION);
  return {
    problems,
    currentRound: 0,
    roundMistakes: new Array(ROUNDS_PER_SESSION).fill(0),
    totalMistakes: 0,
    score: 0,
    gamePhase: 'playing', // 'playing' | 'catching' | 'correct-feedback' | 'wrong-feedback' | 'reward'
    wrongFlash: 0,
    feedbackMessage: null,
  };
}

export function CijferVissen({ difficulty, onExit, onChangeDifficulty }) {
  const [state, setState] = useState(() => initSession(difficulty));
  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const pondActionsRef = useRef(null);

  const currentProblem = state.problems[state.currentRound];

  // Fish clicked handler — called by PondCanvas
  const handleFishClick = useCallback((fishIndex, isCorrect) => {
    if (state.gamePhase !== 'playing') return;

    if (isCorrect) {
      // Correct fish — play catch animation
      playSound('collect');
      const correctMessages = DUTCH_TEXT.cijferVissen.feedback.correct;
      const correctMsg = correctMessages[Math.floor(Math.random() * correctMessages.length)];
      setState((prev) => ({ ...prev, gamePhase: 'catching', feedbackMessage: correctMsg }));

      // Trigger catch animation in PondCanvas
      if (pondActionsRef.current) {
        pondActionsRef.current.animateCatch(fishIndex);
      }

      // After animation: show feedback, then advance
      setTimeout(() => {
        setState((prev) => {
          const newRound = prev.currentRound + 1;

          if (newRound >= ROUNDS_PER_SESSION) {
            // Session complete
            const finalMistakes = [...prev.roundMistakes];
            const finalScore = calculateScore(finalMistakes);
            const stars = calculateStars(prev.totalMistakes);

            // Check high score
            const gameScores = scores['cijfer-vissen'] || {};
            const prevBest = gameScores[difficulty] || 0;
            if (finalScore > prevBest) {
              setScores((s) => ({
                ...s,
                'cijfer-vissen': { ...(s['cijfer-vissen'] || {}), [difficulty]: finalScore },
              }));
              setIsNewHighScore(true);
              playSound('highscore');
            } else {
              playSound('complete');
            }

            return {
              ...prev,
              currentRound: newRound,
              score: finalScore,
              gamePhase: 'reward',
              stars,
            };
          }

          // Advance to next round
          return {
            ...prev,
            currentRound: newRound,
            gamePhase: 'playing',
            feedbackMessage: null,
          };
        });
      }, CELEBRATION_DELAY);

    } else {
      // Wrong fish — shake + flee, show feedback
      playSound('wrong');

      if (pondActionsRef.current) {
        pondActionsRef.current.animateWrong(fishIndex);
      }

      // Pick a random "try again" message
      const messages = DUTCH_TEXT.cijferVissen.feedback.tryAgain;
      const msg = messages[Math.floor(Math.random() * messages.length)];

      setState((prev) => {
        const newRoundMistakes = [...prev.roundMistakes];
        newRoundMistakes[prev.currentRound]++;
        return {
          ...prev,
          roundMistakes: newRoundMistakes,
          totalMistakes: prev.totalMistakes + 1,
          wrongFlash: prev.wrongFlash + 1,
          feedbackMessage: msg,
          gamePhase: 'wrong-feedback',
        };
      });

      // Return to playing after brief delay
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          gamePhase: 'playing',
          feedbackMessage: null,
        }));
      }, 1200);
    }
  }, [state.gamePhase, difficulty, scores, setScores, playSound]);

  // Restart with fresh problems
  const handleRestart = useCallback(() => {
    setState(initSession(difficulty));
    setIsNewHighScore(false);
  }, [difficulty]);

  // --- Reward screen ---
  if (state.gamePhase === 'reward') {
    const stars = calculateStars(state.totalMistakes);
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        {stars === 3 && <Confetti />}
        <CijferVissenReward
          stars={stars}
          score={state.score}
          isNewHighScore={isNewHighScore}
          onRestart={handleRestart}
          onExit={onExit}
          onChangeDifficulty={onChangeDifficulty}
        />
      </div>
    );
  }

  // --- Playing screen ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4 no-select">
      <FlashOverlay trigger={state.wrongFlash} />

      <CijferVissenHUD
        difficulty={difficulty}
        currentRound={state.currentRound}
        totalRounds={ROUNDS_PER_SESSION}
        score={state.score}
      />

      <div className="flex flex-col items-center flex-1 justify-center w-full max-w-3xl relative">
        <PondCanvas
          problem={currentProblem}
          onFishClick={handleFishClick}
          gamePhase={state.gamePhase}
          actionsRef={pondActionsRef}
        />

        {/* Feedback message overlay */}
        {state.feedbackMessage && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
            <p className="font-display font-bold text-lg text-text-primary text-center">
              {state.feedbackMessage}
            </p>
          </div>
        )}

        {/* Correct feedback overlay */}
        {state.gamePhase === 'catching' && state.feedbackMessage && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-green/90 rounded-2xl px-8 py-4 shadow-lg">
            <p className="font-display font-bold text-2xl text-white text-center">
              {state.feedbackMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
