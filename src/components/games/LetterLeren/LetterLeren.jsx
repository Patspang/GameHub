// Letter Leren — word learning game (Dutch + English)
// Turn-based: no game loop, standard React state + event handlers
// Three modes: word choices 3-letter (Easy), word choices 4-letter (Normal), letter tiles (Hard)
// 5 words per round, no lose condition, encouraging feedback only

import { useState, useCallback, useMemo } from 'react';
import { DIFFICULTY, LETTER_LEREN_CONFIG } from '../../../constants/gameConfig';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { getRandomEmojiWordsByLength, getWrongOptions, getScrambledLetters } from '../../../utils/emojiWords';
import { EmojiDisplay } from './EmojiDisplay';
import { WordChoices } from './WordChoices';
import { LetterTiles } from './LetterTiles';
import { LetterLerenHUD } from './LetterLerenHUD';
import { LetterLerenGameOver } from './LetterLerenGameOver';
import { Confetti } from '../../common/Confetti';
import { FlashOverlay } from '../../common/FlashOverlay';

const { WORDS_PER_ROUND, TILE_COUNT, CELEBRATION_DELAY, SCORING } = LETTER_LEREN_CONFIG;

// Pre-compute wrong options and tiles for all words in a round
function initRound(difficulty, language = 'nl') {
  // Easy: 3-letter words, Normal: 4-letter words, Hard: 4-letter words (with tiles)
  const wordLength = difficulty === DIFFICULTY.EASY ? 3 : 4;
  const words = getRandomEmojiWordsByLength(WORDS_PER_ROUND, wordLength, language);
  return {
    words,
    // Pre-compute per-word data so it's stable across renders
    wrongOptionsPerWord: words.map((entry) => getWrongOptions(entry.word, 2, language)),
    tilesPerWord: difficulty === DIFFICULTY.HARD
      ? words.map((entry) => getScrambledLetters(entry.word, TILE_COUNT, language))
      : [],
    currentWordIndex: 0,
    score: 0,
    selectedLetters: [],
    wrongFlash: 0,
    showCelebration: false,
    gameStatus: 'playing', // 'playing' | 'won'
  };
}

export function LetterLeren({ difficulty, language = 'nl', onExit, onChangeDifficulty }) {
  const [state, setState] = useState(() => initRound(difficulty, language));
  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const currentEntry = state.words[state.currentWordIndex];
  const isWordChoiceMode = difficulty === DIFFICULTY.EASY || difficulty === DIFFICULTY.NORMAL;
  const isHard = difficulty === DIFFICULTY.HARD;

  // Current tiles for Hard mode (letter tiles)
  const currentTiles = useMemo(() => {
    if (!isHard) return null;
    const baseTiles = state.tilesPerWord[state.currentWordIndex];
    if (!baseTiles) return null;
    // Apply "used" state from selectedLetters
    // Track which tile ids have been consumed
    const usedIds = new Set(state.usedTileIds || []);
    return baseTiles.map((t) => ({ ...t, used: usedIds.has(t.id) }));
  }, [isHard, state.tilesPerWord, state.currentWordIndex, state.usedTileIds]);

  // Advance to next word or finish the round
  const advanceWord = useCallback((currentScore) => {
    setState((prev) => ({ ...prev, showCelebration: true }));
    playSound('complete');

    setTimeout(() => {
      setState((prev) => {
        const nextIndex = prev.currentWordIndex + 1;
        if (nextIndex >= WORDS_PER_ROUND) {
          // Round complete — check high score
          const gameScores = scores['letter-leren'] || {};
          const prevBest = gameScores[difficulty] || 0;
          const newHigh = currentScore > prevBest;
          if (newHigh) {
            setScores((s) => ({
              ...s,
              'letter-leren': { ...(s['letter-leren'] || {}), [difficulty]: currentScore },
            }));
            setIsNewHighScore(true);
            playSound('highscore');
          }
          return { ...prev, showCelebration: false, gameStatus: 'won' };
        }
        return {
          ...prev,
          currentWordIndex: nextIndex,
          selectedLetters: [],
          usedTileIds: [],
          showCelebration: false,
        };
      });
    }, CELEBRATION_DELAY);
  }, [difficulty, scores, setScores, playSound]);

  // --- Word choice mode (Easy + Normal): tap a word ---
  const wordScore = difficulty === DIFFICULTY.EASY ? SCORING.EASY_WORD : SCORING.NORMAL_WORD;
  const handleWordChoice = useCallback((chosenWord) => {
    if (state.showCelebration) return;
    if (chosenWord === currentEntry.word) {
      const newScore = state.score + wordScore;
      setState((prev) => ({ ...prev, score: newScore }));
      playSound('collect');
      advanceWord(newScore);
    } else {
      setState((prev) => ({ ...prev, wrongFlash: prev.wrongFlash + 1 }));
      playSound('wrong');
    }
  }, [state.showCelebration, state.score, currentEntry, advanceWord, playSound, wordScore]);

  // --- Hard mode: tap a letter tile ---
  const handleTileSelect = useCallback((tile) => {
    if (state.showCelebration) return;
    const expectedLetter = currentEntry.word[state.selectedLetters.length];
    if (tile.letter === expectedLetter) {
      const newSelected = [...state.selectedLetters, tile.letter];
      const newScore = state.score + SCORING.HARD_LETTER;
      playSound('collect');

      setState((prev) => ({
        ...prev,
        score: newScore,
        selectedLetters: newSelected,
        usedTileIds: [...(prev.usedTileIds || []), tile.id],
      }));

      // Word complete?
      if (newSelected.length === currentEntry.word.length) {
        const finalScore = newScore + SCORING.HARD_WORD_BONUS;
        setState((prev) => ({ ...prev, score: finalScore }));
        advanceWord(finalScore);
      }
    } else {
      setState((prev) => ({ ...prev, wrongFlash: prev.wrongFlash + 1 }));
      playSound('wrong');
    }
  }, [state.showCelebration, state.selectedLetters, state.score, currentEntry, advanceWord, playSound]);

  // Restart with fresh round
  const handleRestart = useCallback(() => {
    setState(initRound(difficulty, language));
    setIsNewHighScore(false);
  }, [difficulty, language]);

  // --- Win screen ---
  if (state.gameStatus === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        <Confetti />
        <LetterLerenGameOver
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
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4">
      <FlashOverlay trigger={state.wrongFlash} />

      <LetterLerenHUD
        score={state.score}
        currentWord={state.currentWordIndex}
        totalWords={WORDS_PER_ROUND}
      />

      <div className="flex flex-col items-center flex-1 justify-center w-full max-w-2xl">
        <EmojiDisplay
          emoji={currentEntry.emoji}
          word={currentEntry.word}
          selectedLetters={state.selectedLetters}
          difficulty={difficulty}
          showCompleted={state.showCelebration}
        />

        {/* Mode-specific input — hidden during celebration so completed word stays visible */}
        {!state.showCelebration && isWordChoiceMode && (
          <WordChoices
            key={state.currentWordIndex}
            correctWord={currentEntry.word}
            wrongOptions={state.wrongOptionsPerWord[state.currentWordIndex]}
            onChoice={handleWordChoice}
          />
        )}

        {!state.showCelebration && isHard && currentTiles && (
          <LetterTiles
            tiles={currentTiles}
            onSelectTile={handleTileSelect}
          />
        )}
      </div>
    </div>
  );
}
