// Tic Tac Toe game logic and AI

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export function createBoard() {
  return Array(9).fill(null);
}

// Returns { winner: 'X'|'O'|'draw'|null, winningCells: number[]|null }
export function checkResult(board) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], winningCells: line };
    }
  }
  if (board.every((cell) => cell !== null)) {
    return { winner: 'draw', winningCells: null };
  }
  return { winner: null, winningCells: null };
}

function getEmptyCells(board) {
  return board.reduce((acc, cell, i) => (cell === null ? [...acc, i] : acc), []);
}

// Easy: random move
function getEasyMove(board) {
  const empty = getEmptyCells(board);
  return empty[Math.floor(Math.random() * empty.length)];
}

// Normal: win if possible, block opponent win, otherwise random
function getNormalMove(board, aiSymbol) {
  const opponent = aiSymbol === 'X' ? 'O' : 'X';
  const empty = getEmptyCells(board);

  // Try to win
  for (const cell of empty) {
    const test = [...board];
    test[cell] = aiSymbol;
    if (checkResult(test).winner === aiSymbol) return cell;
  }

  // Block opponent win
  for (const cell of empty) {
    const test = [...board];
    test[cell] = opponent;
    if (checkResult(test).winner === opponent) return cell;
  }

  // Take center if available
  if (board[4] === null) return 4;

  // Random
  return empty[Math.floor(Math.random() * empty.length)];
}

// Hard: minimax (unbeatable)
function minimax(board, isMaximizing, aiSymbol) {
  const opponent = aiSymbol === 'X' ? 'O' : 'X';
  const result = checkResult(board);

  if (result.winner === aiSymbol) return 10;
  if (result.winner === opponent) return -10;
  if (result.winner === 'draw') return 0;

  const empty = getEmptyCells(board);

  if (isMaximizing) {
    let best = -Infinity;
    for (const cell of empty) {
      board[cell] = aiSymbol;
      best = Math.max(best, minimax(board, false, aiSymbol));
      board[cell] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const cell of empty) {
      board[cell] = opponent;
      best = Math.min(best, minimax(board, true, aiSymbol));
      board[cell] = null;
    }
    return best;
  }
}

function getHardMove(board, aiSymbol) {
  const empty = getEmptyCells(board);
  let bestScore = -Infinity;
  let bestMove = empty[0];

  for (const cell of empty) {
    board[cell] = aiSymbol;
    const score = minimax(board, false, aiSymbol);
    board[cell] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = cell;
    }
  }
  return bestMove;
}

export function getAIMove(board, difficulty) {
  switch (difficulty) {
    case 'makkelijk': return getEasyMove(board);
    case 'normaal': return getNormalMove(board, 'O');
    case 'moeilijk': return getHardMove(board, 'O');
    default: return getEasyMove(board);
  }
}
