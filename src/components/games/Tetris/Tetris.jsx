// Main Tetris game component
// Classic Tetris with kid-friendly adjustments: no hard drop, pastel colors, DAS input
// Uses rAF game loop with refs pattern (same architecture as Snake/LetterJager)

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { TETRIS_CONFIG } from '../../../constants/gameConfig';
import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { useLocalStorage } from '../../../hooks/useLocalStorage';
import { useSoundEffects } from '../../../hooks/useSoundEffects';
import { TetrisBoard } from './TetrisBoard';
import { TetrisHUD } from './TetrisHUD';
import { TetrisGameOver } from './TetrisGameOver';
import { TetrominoPreview } from './TetrominoPreview';
import { TouchControls } from '../../common/TouchControls';
import { Confetti } from '../../common/Confetti';
import { FlashOverlay } from '../../common/FlashOverlay';
import { Button } from '../../common/Button';

// === Tetromino definitions ===
// Each shape is an array of [row, col] offsets for each rotation state
const TETROMINOES = {
  I: {
    color: '#6B9BD1',
    shapes: [
      [[0, -1], [0, 0], [0, 1], [0, 2]],
      [[-1, 0], [0, 0], [1, 0], [2, 0]],
      [[0, -1], [0, 0], [0, 1], [0, 2]],
      [[-1, 0], [0, 0], [1, 0], [2, 0]],
    ],
  },
  O: {
    color: '#F4D35E',
    shapes: [
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
      [[0, 0], [0, 1], [1, 0], [1, 1]],
    ],
  },
  T: {
    color: '#A78BFA',
    shapes: [
      [[0, -1], [0, 0], [0, 1], [-1, 0]],
      [[-1, 0], [0, 0], [1, 0], [0, 1]],
      [[0, -1], [0, 0], [0, 1], [1, 0]],
      [[-1, 0], [0, 0], [1, 0], [0, -1]],
    ],
  },
  S: {
    color: '#48BB78',
    shapes: [
      [[0, 0], [0, 1], [-1, 1], [-1, 2]],
      [[-1, 0], [0, 0], [0, 1], [1, 1]],
      [[0, 0], [0, 1], [-1, 1], [-1, 2]],
      [[-1, 0], [0, 0], [0, 1], [1, 1]],
    ],
  },
  Z: {
    color: '#F19C79',
    shapes: [
      [[-1, 0], [-1, 1], [0, 1], [0, 2]],
      [[0, 0], [1, 0], [-1, 1], [0, 1]],
      [[-1, 0], [-1, 1], [0, 1], [0, 2]],
      [[0, 0], [1, 0], [-1, 1], [0, 1]],
    ],
  },
  J: {
    color: '#60A5FA',
    shapes: [
      [[-1, -1], [0, -1], [0, 0], [0, 1]],
      [[-1, 0], [0, 0], [1, 0], [-1, 1]],
      [[0, -1], [0, 0], [0, 1], [1, 1]],
      [[1, -1], [-1, 0], [0, 0], [1, 0]],
    ],
  },
  L: {
    color: '#F472B6',
    shapes: [
      [[0, -1], [0, 0], [0, 1], [-1, 1]],
      [[-1, 0], [0, 0], [1, 0], [1, 1]],
      [[1, -1], [0, -1], [0, 0], [0, 1]],
      [[-1, -1], [-1, 0], [0, 0], [1, 0]],
    ],
  },
};

// Piece bags per difficulty
const ALL_PIECE_KEYS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const EASY_PIECE_KEYS = ['I', 'O', 'T', 'J', 'L']; // No S/Z for easy mode

function getPieceKeys(difficulty) {
  return TETRIS_CONFIG.USE_ALL_PIECES[difficulty] ? ALL_PIECE_KEYS : EASY_PIECE_KEYS;
}

function randomPiece(difficulty) {
  const keys = getPieceKeys(difficulty);
  const key = keys[Math.floor(Math.random() * keys.length)];
  return TETROMINOES[key];
}

// Create empty board (2D array of null)
function createEmptyBoard(height, width) {
  return Array.from({ length: height }, () => Array(width).fill(null));
}

// Check if piece cells are all in valid, empty positions
function isValidPosition(board, piece, row, col, rotation) {
  const height = board.length;
  const width = board[0].length;
  const cells = piece.shapes[rotation];
  for (const [dr, dc] of cells) {
    const r = row + dr;
    const c = col + dc;
    if (c < 0 || c >= width || r >= height) return false;
    // Allow cells above the board (r < 0)
    if (r >= 0 && board[r][c] !== null) return false;
  }
  return true;
}

// Compute drop speed for a given level
function getSpeed(difficulty, level) {
  const baseSpeed = TETRIS_CONFIG.BASE_SPEED[difficulty];
  const startLevel = TETRIS_CONFIG.START_LEVEL[difficulty];
  const levelsAbove = Math.max(0, level - startLevel);
  return Math.max(
    TETRIS_CONFIG.MIN_SPEED,
    Math.floor(baseSpeed * Math.pow(TETRIS_CONFIG.SPEED_DECAY, levelsAbove))
  );
}

export function Tetris({ difficulty, onExit }) {
  const boardHeight = TETRIS_CONFIG.BOARD_HEIGHT[difficulty];
  const boardWidth = TETRIS_CONFIG.BOARD_WIDTH;
  const startLevel = TETRIS_CONFIG.START_LEVEL[difficulty];

  const [gameStatus, setGameStatus] = useState('ready');
  const [board, setBoard] = useState(() => createEmptyBoard(boardHeight, boardWidth));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(startLevel);
  const [linesCleared, setLinesCleared] = useState(0);
  const [lineClearCount, setLineClearCount] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const [highScores, setHighScores] = useLocalStorage('gamehub-scores', {});
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  useEffect(() => { playSoundRef.current = playSound; }, [playSound]);

  // Refs for game loop (avoid stale closures)
  const boardRef = useRef(board);
  const currentPieceRef = useRef(currentPiece);
  const nextPieceRef = useRef(nextPiece);
  const scoreRef = useRef(score);
  const levelRef = useRef(level);
  const linesClearedRef = useRef(linesCleared);
  const gameStatusRef = useRef(gameStatus);

  useEffect(() => { boardRef.current = board; }, [board]);
  useEffect(() => { currentPieceRef.current = currentPiece; }, [currentPiece]);
  useEffect(() => { nextPieceRef.current = nextPiece; }, [nextPiece]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { levelRef.current = level; }, [level]);
  useEffect(() => { linesClearedRef.current = linesCleared; }, [linesCleared]);
  useEffect(() => { gameStatusRef.current = gameStatus; }, [gameStatus]);

  // Memoize the next piece preview data for the sidebar
  const nextPieceData = useMemo(() => nextPiece, [nextPiece]);

  // Ref to break circular dep between lockPiece and spawnPiece
  const spawnPieceRef = useRef(null);

  // Lock the current piece onto the board, clear lines, spawn next
  const lockPiece = useCallback(() => {
    const cp = currentPieceRef.current;
    if (!cp) return;

    const { piece, row, col, rotation } = cp;
    const newBoard = boardRef.current.map((r) => [...r]);
    const cells = piece.shapes[rotation];

    // Place piece on board
    for (const [dr, dc] of cells) {
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < boardHeight && c >= 0 && c < boardWidth) {
        newBoard[r][c] = piece.color;
      }
    }

    // Check for game over: any placed cell above the visible board
    for (const [dr] of cells) {
      if (row + dr < 0) {
        setBoard(newBoard);
        boardRef.current = newBoard;
        setGameStatus('lost');
        gameStatusRef.current = 'lost';
        playSoundRef.current('hit');
        return;
      }
    }

    // Check for completed lines
    const completedRows = [];
    for (let r = 0; r < boardHeight; r++) {
      if (newBoard[r].every((cell) => cell !== null)) {
        completedRows.push(r);
      }
    }

    if (completedRows.length > 0) {
      // Remove completed rows and add empty rows at top
      const remainingRows = newBoard.filter((_, i) => !completedRows.includes(i));
      const emptyRows = Array.from({ length: completedRows.length }, () =>
        Array(boardWidth).fill(null)
      );
      const clearedBoard = [...emptyRows, ...remainingRows];

      setBoard(clearedBoard);
      boardRef.current = clearedBoard;

      // Update score
      const lineScore = TETRIS_CONFIG.LINE_SCORES[completedRows.length] || 0;
      const newScore = scoreRef.current + lineScore * levelRef.current;
      setScore(newScore);
      scoreRef.current = newScore;

      // Update lines and level
      const newTotalLines = linesClearedRef.current + completedRows.length;
      setLinesCleared(newTotalLines);
      linesClearedRef.current = newTotalLines;
      setLineClearCount((c) => c + 1);

      const newLevel = startLevel + Math.floor(newTotalLines / TETRIS_CONFIG.LINES_PER_LEVEL);
      setLevel(newLevel);
      levelRef.current = newLevel;

      // Sound
      if (completedRows.length >= 4) {
        playSoundRef.current('complete');
      } else {
        playSoundRef.current('collect');
      }
    } else {
      setBoard(newBoard);
      boardRef.current = newBoard;
    }

    // Spawn next piece
    spawnPieceRef.current();
  }, [boardHeight, boardWidth, startLevel]);

  // Spawn a new piece at the top
  const spawnPiece = useCallback(() => {
    const piece = nextPieceRef.current || randomPiece(difficulty);
    const next = randomPiece(difficulty);

    const spawnRow = 0;
    const spawnCol = Math.floor(boardWidth / 2);

    // Check if spawn position is valid
    if (!isValidPosition(boardRef.current, piece, spawnRow, spawnCol, 0)) {
      setGameStatus('lost');
      gameStatusRef.current = 'lost';
      playSoundRef.current('hit');
      return;
    }

    const newPiece = { piece, row: spawnRow, col: spawnCol, rotation: 0 };
    setCurrentPiece(newPiece);
    currentPieceRef.current = newPiece;
    setNextPiece(next);
    nextPieceRef.current = next;
  }, [difficulty, boardWidth]);

  // Keep spawnPiece ref in sync
  useEffect(() => { spawnPieceRef.current = spawnPiece; }, [spawnPiece]);

  // Move piece: returns true if successful
  const movePiece = useCallback((dRow, dCol) => {
    const cp = currentPieceRef.current;
    if (!cp) return false;

    const newRow = cp.row + dRow;
    const newCol = cp.col + dCol;

    if (isValidPosition(boardRef.current, cp.piece, newRow, newCol, cp.rotation)) {
      const updated = { ...cp, row: newRow, col: newCol };
      setCurrentPiece(updated);
      currentPieceRef.current = updated;
      return true;
    }
    return false;
  }, []);

  // Rotate piece with basic wall kick
  const rotatePiece = useCallback(() => {
    const cp = currentPieceRef.current;
    if (!cp) return;

    const newRotation = (cp.rotation + 1) % 4;

    // Try normal position
    if (isValidPosition(boardRef.current, cp.piece, cp.row, cp.col, newRotation)) {
      const updated = { ...cp, rotation: newRotation };
      setCurrentPiece(updated);
      currentPieceRef.current = updated;
      return;
    }

    // Wall kick: try shifting left by 1
    if (isValidPosition(boardRef.current, cp.piece, cp.row, cp.col - 1, newRotation)) {
      const updated = { ...cp, col: cp.col - 1, rotation: newRotation };
      setCurrentPiece(updated);
      currentPieceRef.current = updated;
      return;
    }

    // Wall kick: try shifting right by 1
    if (isValidPosition(boardRef.current, cp.piece, cp.row, cp.col + 1, newRotation)) {
      const updated = { ...cp, col: cp.col + 1, rotation: newRotation };
      setCurrentPiece(updated);
      currentPieceRef.current = updated;
    }
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    const emptyBoard = createEmptyBoard(boardHeight, boardWidth);
    setBoard(emptyBoard);
    boardRef.current = emptyBoard;

    const first = randomPiece(difficulty);
    const next = randomPiece(difficulty);

    const spawnRow = 0;
    const spawnCol = Math.floor(boardWidth / 2);
    const newPiece = { piece: first, row: spawnRow, col: spawnCol, rotation: 0 };

    setCurrentPiece(newPiece);
    currentPieceRef.current = newPiece;
    setNextPiece(next);
    nextPieceRef.current = next;

    setScore(0);
    scoreRef.current = 0;
    setLevel(startLevel);
    levelRef.current = startLevel;
    setLinesCleared(0);
    linesClearedRef.current = 0;
    setLineClearCount(0);
    setIsNewHighScore(false);
    setGameStatus('playing');
    gameStatusRef.current = 'playing';
  }, [boardHeight, boardWidth, difficulty, startLevel]);

  // Direction handler for TouchControls
  const handleDirection = useCallback((dir) => {
    if (gameStatusRef.current !== 'playing') return;

    switch (dir) {
      case 'left':
        movePiece(0, -1);
        break;
      case 'right':
        movePiece(0, 1);
        break;
      case 'down':
        if (!movePiece(1, 0)) {
          lockPiece();
        }
        break;
      case 'up':
        rotatePiece();
        break;
    }
  }, [movePiece, rotatePiece, lockPiece]);

  // Keyboard input with DAS (Delayed Auto Shift)
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    let dasTimer = null;
    let dasInterval = null;
    let activeKey = null;

    const executeAction = (key) => {
      if (gameStatusRef.current !== 'playing') return;
      switch (key) {
        case 'ArrowLeft':
          movePiece(0, -1);
          break;
        case 'ArrowRight':
          movePiece(0, 1);
          break;
        case 'ArrowDown':
          if (!movePiece(1, 0)) {
            lockPiece();
          }
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    const handleKeyDown = (e) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();

      // Immediate first action
      if (activeKey !== e.key) {
        clearTimeout(dasTimer);
        clearInterval(dasInterval);
        activeKey = e.key;
        executeAction(e.key);

        // Don't repeat rotation
        if (e.key !== 'ArrowUp') {
          dasTimer = setTimeout(() => {
            dasInterval = setInterval(() => {
              executeAction(e.key);
            }, TETRIS_CONFIG.DAS_REPEAT);
          }, TETRIS_CONFIG.DAS_INITIAL);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === activeKey) {
        activeKey = null;
        clearTimeout(dasTimer);
        clearInterval(dasInterval);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearTimeout(dasTimer);
      clearInterval(dasInterval);
    };
  }, [gameStatus, movePiece, rotatePiece, lockPiece]);

  // Gravity game loop (piece drops on timer)
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    let lastDrop = 0;
    let animFrameId;

    const tick = (timestamp) => {
      if (gameStatusRef.current !== 'playing') return;

      const speed = getSpeed(difficulty, levelRef.current);
      if (timestamp - lastDrop >= speed) {
        lastDrop = timestamp;

        // Try to move piece down
        const cp = currentPieceRef.current;
        if (cp) {
          const newRow = cp.row + 1;
          if (isValidPosition(boardRef.current, cp.piece, newRow, cp.col, cp.rotation)) {
            const updated = { ...cp, row: newRow };
            setCurrentPiece(updated);
            currentPieceRef.current = updated;
          } else {
            // Piece can't move down — lock it
            lockPiece();
          }
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameStatus, difficulty, lockPiece]);

  // Save high score on game end
  useEffect(() => {
    if (gameStatus === 'lost') {
      const currentBest = highScores?.['tetris']?.[difficulty] || 0;
      if (score > currentBest) {
        setHighScores((prev) => ({
          ...prev,
          'tetris': {
            ...(prev['tetris'] || {}),
            [difficulty]: score,
          },
        }));
        setIsNewHighScore(true);
        playSound('highscore');
      }
    }
  }, [gameStatus, score, difficulty, highScores, setHighScores, playSound]);

  // Ready screen
  if (gameStatus === 'ready') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="text-8xl mb-6">🧱</div>
        <h2 className="font-display text-4xl font-bold text-text-primary text-center mb-4">
          {DUTCH_TEXT.tetris.name}
        </h2>
        <p className="font-body text-lg text-text-secondary text-center mb-2">
          {DUTCH_TEXT.tetris.instructions.howToPlay}
        </p>
        <p className="font-body text-md text-text-secondary text-center mb-8">
          {DUTCH_TEXT.tetris.instructions.useArrows}
        </p>
        <Button variant="success" onClick={initGame}>
          🎮 {DUTCH_TEXT.menu.startGame}
        </Button>
      </div>
    );
  }

  // Game over screen
  if (gameStatus === 'lost') {
    return (
      <>
        {isNewHighScore && <Confetti />}
        <TetrisGameOver
          score={score}
          level={level}
          linesCleared={linesCleared}
          isNewHighScore={isNewHighScore}
          onRestart={initGame}
          onExit={onExit}
        />
      </>
    );
  }

  // Playing
  return (
    <div className="flex flex-col items-center px-2 py-2 no-select" style={{ touchAction: 'none' }}>
      <FlashOverlay trigger={lineClearCount} />

      <TetrisHUD
        score={score}
        level={level}
        linesCleared={linesCleared}
      />

      <div className="flex items-start gap-4">
        <TetrisBoard
          board={board}
          currentPiece={currentPiece}
          boardWidth={boardWidth}
          boardHeight={boardHeight}
        />

        <TetrominoPreview
          piece={nextPieceData}
          tileSize={28}
        />
      </div>

      <TouchControls onDirection={handleDirection} />

      <div className="mt-2">
        <Button variant="accent" size="md" onClick={onExit}>
          {DUTCH_TEXT.game.quit}
        </Button>
      </div>
    </div>
  );
}
