// Domino — Classic domino game, player vs computer
// Multi-round: score accumulates, saved as high score per difficulty

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { DOMINO_CONFIG as CFG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Confetti } from '../../common/Confetti';
import { FlashOverlay } from '../../common/FlashOverlay';
import { Button } from '../../common/Button';
import { DominoBoard } from './DominoBoard';
import { DominoHand } from './DominoHand';
import { DominoHUD } from './DominoHUD';
import { DominoGameOver } from './DominoGameOver';
import {
  dealTiles,
  canPlace,
  getValidMoves,
  getPlayableTileIds,
  placeTile,
  getAIMove,
  checkRoundEnd,
  calculateRoundScore,
} from './dominoUtils';

const T = DUTCH_TEXT.domino;

function initRound(difficulty) {
  const maxPips = CFG.MAX_PIPS[difficulty] || 6;
  const handSize = CFG.HAND_SIZE[difficulty] || 7;
  const { playerHand, computerHand, boneyard } = dealTiles(maxPips, handSize);
  return {
    playerHand,
    computerHand,
    boneyard,
    chain: [],
    isPlayerTurn: true,
    selectedTileId: null,
    awaitingEndChoice: false,
    feedback: null,
  };
}

export function Domino({ difficulty, onExit, onChangeDifficulty }) {
  const [round, setRound] = useState(() => initRound(difficulty));
  const [totalScore, setTotalScore] = useState(0);
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); // playing | roundOver | gameOver
  const [roundResult, setRoundResult] = useState(null); // { winner, reason, points }
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [flashCount, setFlashCount] = useState(0);
  const hideHints = difficulty !== 'makkelijk';
  // Monotonic counter: bumped when computer should take a turn.
  // A useEffect watches this and safely runs the AI logic outside state updaters.
  const [computerTurnSignal, setComputerTurnSignal] = useState(0);

  const [scores, setScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const timerRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const playableTileIds = getPlayableTileIds(round.playerHand, round.chain);

  // --- PLAYER ACTIONS ---

  // Player taps a tile in their hand
  const handleSelectTile = useCallback((tileId) => {
    if (!round.isPlayerTurn || gameStatus !== 'playing') return;

    const tile = round.playerHand.find((t) => t.id === tileId);
    if (!tile) return;

    const { canPlaceLeft, canPlaceRight } = canPlace(tile, round.chain);

    if (!canPlaceLeft && !canPlaceRight) {
      playSound('wrong');
      setFlashCount((c) => c + 1);
      return;
    }

    // First tile of the game — auto-place (no end choice needed)
    if (round.chain.length === 0) {
      handlePlaceTile(tile, 'right');
      return;
    }

    // Can place on only one end — auto-place
    if (canPlaceLeft && !canPlaceRight) {
      handlePlaceTile(tile, 'left');
      return;
    }
    if (!canPlaceLeft && canPlaceRight) {
      handlePlaceTile(tile, 'right');
      return;
    }

    // Can place on both ends — ask player to choose
    setRound((prev) => ({
      ...prev,
      selectedTileId: tileId,
      awaitingEndChoice: true,
      feedback: T.feedback.selectEnd,
    }));
  }, [round, gameStatus, playSound]); // eslint-disable-line react-hooks/exhaustive-deps

  // Player places tile at a specific end
  const handlePlaceTile = useCallback((tile, end) => {
    playSound('collect');

    setRound((prev) => {
      const newChain = placeTile(prev.chain, tile, end);
      const newHand = prev.playerHand.filter((t) => t.id !== tile.id);

      return {
        ...prev,
        chain: newChain,
        playerHand: newHand,
        selectedTileId: null,
        awaitingEndChoice: false,
        feedback: null,
        isPlayerTurn: false,
      };
    });

    // Signal: after player moves, check round end then trigger computer turn
    // This runs OUTSIDE the state updater — safe from StrictMode double-invocation
    setTimeout(() => {
      setRound((prev) => {
        const result = checkRoundEnd(prev.playerHand, prev.computerHand, prev.boneyard, prev.chain);
        if (result.over) {
          const points = calculateRoundScore(result.winner, prev.playerHand, prev.computerHand);
          setRoundResult({ ...result, points });
          setTotalScore((s) => s + points);
          setRoundsPlayed((s) => s + 1);
          setGameStatus('roundOver');
          playSound(result.winner === 'player' ? 'complete' : 'hit');
        } else {
          // Trigger computer turn via signal
          setComputerTurnSignal((s) => s + 1);
        }
        return prev;
      });
    }, 50);
  }, [playSound]); // eslint-disable-line react-hooks/exhaustive-deps

  // Player chooses an end for their selected tile
  const handlePlaceLeft = useCallback(() => {
    const tile = round.playerHand.find((t) => t.id === round.selectedTileId);
    if (tile) handlePlaceTile(tile, 'left');
  }, [round.playerHand, round.selectedTileId, handlePlaceTile]);

  const handlePlaceRight = useCallback(() => {
    const tile = round.playerHand.find((t) => t.id === round.selectedTileId);
    if (tile) handlePlaceTile(tile, 'right');
  }, [round.playerHand, round.selectedTileId, handlePlaceTile]);

  // --- COMPUTER TURN — driven by useEffect, no side effects in state updaters ---
  useEffect(() => {
    if (computerTurnSignal === 0) return; // skip initial render
    if (gameStatus !== 'playing') return;

    // Clear any pending timer
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setRound((prev) => {
        if (prev.isPlayerTurn) return prev; // safety: already player's turn

        const validMoves = getValidMoves(prev.computerHand, prev.chain);

        if (validMoves.length > 0) {
          // Computer can play — pick one tile and place it
          const move = getAIMove(prev.computerHand, prev.chain, difficulty);
          if (move) {
            const newChain = placeTile(prev.chain, move.tile, move.end);
            const newHand = prev.computerHand.filter((t) => t.id !== move.tile.id);
            playSound('hit');

            // Check round end after this play (in next tick, outside updater)
            setTimeout(() => {
              setRound((cur) => {
                const result = checkRoundEnd(cur.playerHand, cur.computerHand, cur.boneyard, cur.chain);
                if (result.over) {
                  const points = calculateRoundScore(result.winner, cur.playerHand, cur.computerHand);
                  setRoundResult({ ...result, points });
                  setTotalScore((s) => s + points);
                  setRoundsPlayed((s) => s + 1);
                  setGameStatus('roundOver');
                  playSound(result.winner === 'player' ? 'complete' : 'hit');
                }
                return cur;
              });
            }, 50);

            return {
              ...prev,
              chain: newChain,
              computerHand: newHand,
              isPlayerTurn: true,
              feedback: null,
            };
          }
        }

        // No valid move — try to draw ONE tile from boneyard
        if (prev.boneyard.length > 0) {
          const [drawn, ...restBoneyard] = prev.boneyard;

          // After drawing, re-signal to retry after a delay
          setTimeout(() => {
            setComputerTurnSignal((s) => s + 1);
          }, CFG.DRAW_DELAY);

          return {
            ...prev,
            computerHand: [...prev.computerHand, drawn],
            boneyard: restBoneyard,
            isPlayerTurn: false,
            feedback: null,
          };
        }

        // No boneyard left, can't play — pass back to player
        // Check if game is blocked
        setTimeout(() => {
          setRound((cur) => {
            const result = checkRoundEnd(cur.playerHand, cur.computerHand, cur.boneyard, cur.chain);
            if (result.over) {
              const points = calculateRoundScore(result.winner, cur.playerHand, cur.computerHand);
              setRoundResult({ ...result, points });
              setTotalScore((s) => s + points);
              setRoundsPlayed((s) => s + 1);
              setGameStatus('roundOver');
              playSound(result.winner === 'player' ? 'complete' : 'hit');
            }
            return cur;
          });
        }, 50);

        return {
          ...prev,
          isPlayerTurn: true,
          feedback: null,
        };
      });
    }, CFG.AI_DELAY);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [computerTurnSignal, gameStatus, difficulty, playSound]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- AUTO-DRAW for player ---
  useEffect(() => {
    if (gameStatus !== 'playing' || !round.isPlayerTurn) return;
    if (round.playerHand.length === 0) return;

    const canPlay = getValidMoves(round.playerHand, round.chain).length > 0;
    if (canPlay) return;

    // No valid moves — need to draw or pass
    if (round.boneyard.length === 0) {
      // Must pass
      setRound((prev) => ({
        ...prev,
        feedback: T.feedback.mustPass,
        isPlayerTurn: false,
      }));
      setTimeout(() => {
        // Check if game is blocked, if not trigger computer turn
        setRound((prev) => {
          const result = checkRoundEnd(prev.playerHand, prev.computerHand, prev.boneyard, prev.chain);
          if (result.over) {
            const points = calculateRoundScore(result.winner, prev.playerHand, prev.computerHand);
            setRoundResult({ ...result, points });
            setTotalScore((s) => s + points);
            setRoundsPlayed((s) => s + 1);
            setGameStatus('roundOver');
            playSound(result.winner === 'player' ? 'complete' : 'hit');
          } else {
            setComputerTurnSignal((s) => s + 1);
          }
          return prev;
        });
      }, 1000);
      return;
    }

    // Auto-draw one tile
    setRound((prev) => ({
      ...prev,
      feedback: T.feedback.mustDraw,
    }));
    const drawTimer = setTimeout(() => {
      setRound((prev) => {
        if (prev.boneyard.length === 0) return prev;
        const [drawn, ...restBoneyard] = prev.boneyard;
        return {
          ...prev,
          playerHand: [...prev.playerHand, drawn],
          boneyard: restBoneyard,
          feedback: null,
        };
      });
    }, CFG.DRAW_DELAY);
    return () => clearTimeout(drawTimer);
  }, [round.isPlayerTurn, round.playerHand, round.boneyard, round.chain, gameStatus, playSound]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- ROUND/GAME MANAGEMENT ---

  const startNewRound = useCallback(() => {
    setRound(initRound(difficulty));
    setRoundResult(null);
    setGameStatus('playing');
  }, [difficulty]);

  const endGame = useCallback(() => {
    setGameStatus('gameOver');
    const gameScores = scores['domino'] || {};
    if (totalScore > (gameScores[difficulty] || 0)) {
      setScores((s) => ({
        ...s,
        'domino': { ...(s['domino'] || {}), [difficulty]: totalScore },
      }));
      setIsNewHighScore(true);
      playSound('highscore');
    }
  }, [scores, setScores, difficulty, totalScore, playSound]);

  const restart = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setRound(initRound(difficulty));
    setComputerTurnSignal(0);
    setFlashCount(0);
    setTotalScore(0);
    setRoundsPlayed(0);
    setRoundResult(null);
    setGameStatus('playing');
    setIsNewHighScore(false);
  };

  // --- GAME OVER SCREEN ---
  if (gameStatus === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        {isNewHighScore && <Confetti />}
        <DominoGameOver
          totalScore={totalScore}
          roundsPlayed={roundsPlayed}
          isNewHighScore={isNewHighScore}
          onRestart={restart}
          onExit={onExit}
          onChangeDifficulty={onChangeDifficulty}
        />
      </div>
    );
  }

  // --- ROUND OVER SCREEN ---
  if (gameStatus === 'roundOver' && roundResult) {
    const feedbackText = roundResult.winner === 'player'
      ? T.feedback.youWin
      : roundResult.reason === 'blocked'
        ? T.feedback.blocked
        : T.feedback.computerWins;

    return (
      <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center justify-center p-4">
        {roundResult.winner === 'player' && <Confetti />}
        <div className="bg-white/90 backdrop-blur rounded-3xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="text-6xl mb-4">
            {roundResult.winner === 'player' ? '🎉' : '🤝'}
          </div>
          <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
            {feedbackText}
          </h2>
          <p className="font-display text-3xl font-bold text-primary-blue-dark mb-1">
            +{roundResult.points}
          </p>
          <p className="font-body text-text-secondary mb-6">
            {T.hud.totalScore}: {totalScore}
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="success" onClick={startNewRound}>
              Volgende ronde
            </Button>
            <Button variant="ghost" onClick={endGame}>
              Stoppen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- PLAYING SCREEN ---
  return (
    <div
      className="bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-3 no-select overflow-hidden"
      style={{ height: 'calc(100vh - 52px)' }}
    >
      <FlashOverlay trigger={flashCount} />
      {/* HUD + Stoppen button */}
      <div className="flex-none w-full max-w-2xl flex items-center gap-2">
        <div className="flex-1">
          <DominoHUD
            isPlayerTurn={round.isPlayerTurn}
            totalScore={totalScore}
            boneyardCount={round.boneyard.length}
            computerTileCount={round.computerHand.length}
          />
        </div>
        <Button variant="ghost" size="md" onClick={endGame}>
          Stoppen
        </Button>
      </div>

      {/* Computer hand indicator */}
      <div className="flex-none flex items-center gap-1 mt-2 mb-1">
        {round.computerHand.slice(0, 10).map((_, i) => (
          <div key={i} className="w-7 h-5 rounded bg-primary-blue-dark/70 border border-primary-blue-dark/30" />
        ))}
        {round.computerHand.length > 10 && (
          <span className="text-xs text-text-secondary font-body">+{round.computerHand.length - 10}</span>
        )}
      </div>

      {/* Board — takes remaining vertical space */}
      <DominoBoard
        chain={round.chain}
        showLeftZone={round.awaitingEndChoice && round.chain.length > 0}
        showRightZone={round.awaitingEndChoice && round.chain.length > 0}
        onPlaceLeft={handlePlaceLeft}
        onPlaceRight={handlePlaceRight}
      />

      {/* Feedback message */}
      {round.feedback && (
        <div className="flex-none bg-white/70 backdrop-blur rounded-xl px-4 py-2 mb-1">
          <p className="font-display text-sm font-bold text-text-primary">
            {round.feedback}
          </p>
        </div>
      )}

      {/* Player hand */}
      <div className="flex-none w-full max-w-2xl bg-white/60 backdrop-blur rounded-2xl shadow-md mb-1">
        <DominoHand
          tiles={round.playerHand}
          selectedTileId={round.selectedTileId}
          playableTileIds={playableTileIds}
          onSelectTile={handleSelectTile}
          disabled={!round.isPlayerTurn || round.awaitingEndChoice}
          hideHints={hideHints}
        />
      </div>
    </div>
  );
}
