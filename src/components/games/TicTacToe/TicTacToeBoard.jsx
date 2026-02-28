// 3x3 game board with large touch-friendly cells

import { TICTACTOE_CONFIG } from '../../../constants/gameConfig';

export function TicTacToeBoard({ board, winningCells, onCellClick, disabled }) {
  const { SYMBOLS } = TICTACTOE_CONFIG;

  return (
    <div className="grid grid-cols-3 gap-2 w-fit">
      {board.map((cell, index) => {
        const isWinning = winningCells?.includes(index);
        const isEmpty = cell === null;

        return (
          <button
            key={index}
            className={`
              w-24 h-24 sm:w-28 sm:h-28 rounded-2xl
              flex items-center justify-center
              text-5xl sm:text-6xl
              font-bold transition-all duration-200
              ${isEmpty && !disabled
                ? 'bg-white/80 active:scale-95 active:bg-white cursor-pointer'
                : 'bg-white/60 cursor-default'
              }
              ${isWinning ? 'ring-4 ring-success bg-success/20 scale-105' : ''}
              ${cell && !isWinning ? 'animate-[popIn_0.2s_ease-out]' : ''}
            `}
            onClick={() => isEmpty && !disabled && onCellClick(index)}
            disabled={disabled || !isEmpty}
            aria-label={`Cel ${index + 1}${cell ? `: ${cell}` : ''}`}
          >
            {cell && (
              <span className={cell === 'X' ? 'drop-shadow-md' : 'drop-shadow-md'}>
                {SYMBOLS[cell]}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
