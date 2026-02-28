// Boter Kaas & Eieren (Tic Tac Toe)
// Supports 3 AI difficulty levels + local 2-player mode

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { TICTACTOE_CONFIG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Confetti } from '../../common/Confetti';
import { Button } from '../../common/Button';
import { createBoard, checkResult, getAIMove } from './ticTacToeUtils';
import { TicTacToeBoard } from './TicTacToeBoard';
import { TicTacToeHUD } from './TicTacToeHUD';

const T = DUTCH_TEXT.boterKaasEieren;

export function TicTacToe({ difficulty, onExit, onChangeDifficulty }) {
  const isTwoPlayer = difficulty === '2spelers';
  const [board, setBoard] = useState(createBoard);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [result, setResult] = useState(null); // { winner, winningCells }
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [scores_, setScores_] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const aiTimeoutRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  const isComputerTurn = !isTwoPlayer && currentPlayer === 'O' && !result;

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  const handleRoundEnd = useCallback((winner, winningCells) => {
    setResult({ winner, winningCells });

    let feedbackText;
    if (winner === 'draw') {
      feedbackText = T.feedback.draw;
      playSound('hit');
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
    } else if (isTwoPlayer) {
      feedbackText = winner === 'X' ? T.feedback.player1Wins : T.feedback.player2Wins;
      playSound('complete');
      setShowConfetti(true);
      setScores((prev) => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else {
      if (winner === 'X') {
        feedbackText = T.feedback.youWin;
        playSound('complete');
        setShowConfetti(true);
        setScores((prev) => ({ ...prev, X: prev.X + 1 }));
      } else {
        feedbackText = T.feedback.computerWins;
        playSound('wrong');
        setScores((prev) => ({ ...prev, O: prev.O + 1 }));
      }
    }
    setFeedback(feedbackText);

    // Auto-start next round
    resetTimeoutRef.current = setTimeout(() => {
      setBoard(createBoard());
      setCurrentPlayer('X');
      setResult(null);
      setFeedback(null);
      setShowConfetti(false);
    }, TICTACTOE_CONFIG.ROUND_RESET_DELAY);
  }, [isTwoPlayer, playSound]);

  const makeMove = useCallback((index, player) => {
    setBoard((prev) => {
      const newBoard = [...prev];
      if (newBoard[index] !== null) return prev;
      newBoard[index] = player;

      // Check result after move
      const { winner, winningCells } = checkResult(newBoard);
      if (winner) {
        // Defer to avoid setState during render
        setTimeout(() => handleRoundEnd(winner, winningCells), 0);
      } else {
        setCurrentPlayer(player === 'X' ? 'O' : 'X');
      }

      return newBoard;
    });
  }, [handleRoundEnd]);

  // AI move
  useEffect(() => {
    if (isComputerTurn) {
      aiTimeoutRef.current = setTimeout(() => {
        const move = getAIMove(board, difficulty);
        if (move !== undefined) {
          makeMove(move, 'O');
        }
      }, TICTACTOE_CONFIG.AI_DELAY);
    }
    return () => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [isComputerTurn, board, difficulty, makeMove]);

  const handleCellClick = (index) => {
    if (result || isComputerTurn) return;
    if (board[index] !== null) return;
    playSound('collect');
    makeMove(index, currentPlayer);
  };

  // Save best score (total wins) on exit — handled via scores state
  const handleExit = () => {
    const totalWins = isTwoPlayer ? Math.max(scores.X, scores.O) : scores.X;
    if (totalWins > 0) {
      const gameScores = scores_['boter-kaas-eieren'] || {};
      const key = difficulty;
      if (totalWins > (gameScores[key] || 0)) {
        setScores_((s) => ({
          ...s,
          'boter-kaas-eieren': { ...(s['boter-kaas-eieren'] || {}), [key]: totalWins },
        }));
      }
    }
    onExit();
  };

  const handleChangeDifficulty = () => {
    const totalWins = isTwoPlayer ? Math.max(scores.X, scores.O) : scores.X;
    if (totalWins > 0) {
      const gameScores = scores_['boter-kaas-eieren'] || {};
      const key = difficulty;
      if (totalWins > (gameScores[key] || 0)) {
        setScores_((s) => ({
          ...s,
          'boter-kaas-eieren': { ...(s['boter-kaas-eieren'] || {}), [key]: totalWins },
        }));
      }
    }
    onChangeDifficulty();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary flex flex-col items-center p-4 no-select">
      {showConfetti && <Confetti />}

      <TicTacToeHUD
        currentPlayer={currentPlayer}
        isTwoPlayer={isTwoPlayer}
        isComputerTurn={isComputerTurn}
        scores={scores}
      />

      {/* Feedback message */}
      <div className="h-10 flex items-center justify-center mb-2">
        {feedback && (
          <p className="font-display text-xl font-bold text-text-primary animate-[popIn_0.3s_ease-out]">
            {feedback}
          </p>
        )}
      </div>

      <TicTacToeBoard
        board={board}
        winningCells={result?.winningCells}
        onCellClick={handleCellClick}
        disabled={!!result || isComputerTurn}
      />

      {/* Action buttons */}
      <div className="mt-8 flex gap-3">
        <Button variant="ghost" size="md" onClick={handleChangeDifficulty}>
          {DUTCH_TEXT.feedback.changeDifficulty}
        </Button>
        <Button variant="accent" size="md" onClick={handleExit}>
          {DUTCH_TEXT.menu.backHome}
        </Button>
      </div>
    </div>
  );
}
