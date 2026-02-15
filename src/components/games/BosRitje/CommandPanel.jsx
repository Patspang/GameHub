// Route planning UI for Bos Ritje
// Fixed empty slots that fill with command arrows as the child taps them
// All interaction via taps — no drag-and-drop

import { DUTCH_TEXT } from '../../../constants/dutch-text';
import { Button } from '../../common/Button';

const CMD_ICONS = {
  forward: '⬆️',
  left: '⬅️',
  right: '➡️',
};

export function CommandPanel({
  commands,
  maxCommands,
  onAddCommand,
  onRemoveCommand,
  onClear,
  onStart,
  executing,
  executionIndex,
}) {
  const t = DUTCH_TEXT.bosRitje.game;
  const canAdd = commands.length < maxCommands;
  const hasCommands = commands.length > 0;
  const isFull = commands.length >= maxCommands;

  // Build array of slots: filled commands + empty remaining
  const slots = [];
  for (let i = 0; i < maxCommands; i++) {
    slots.push(i < commands.length ? commands[i] : null);
  }

  return (
    <div className="w-full max-w-[600px] mx-auto px-2 flex flex-col items-center">
      {/* Route label */}
      <div className="mb-1">
        <span className="font-display font-bold text-text-primary">
          {t.yourRoute}
        </span>
      </div>

      {/* Fixed slot grid — dynamic width based on step count */}
      <div className="inline-flex flex-wrap gap-1.5 min-h-[44px] p-2 bg-white/60 rounded-xl border-2 border-primary-blue-dark/20 mb-3">
        {slots.map((cmd, i) => {
          const isFilled = cmd !== null;
          const isExecuted = executing && i < executionIndex;
          const isActive = executing && i === executionIndex;

          return (
            <button
              key={i}
              onClick={() => isFilled && !executing && onRemoveCommand(i)}
              disabled={!isFilled || executing}
              className={`
                flex items-center justify-center w-10 h-10 rounded-lg text-lg
                transition-all
                ${isActive
                  ? 'bg-primary-yellow ring-2 ring-primary-yellow scale-110'
                  : isExecuted
                    ? 'bg-primary-green-dark/20 opacity-60'
                    : isFilled
                      ? 'bg-white shadow-sm cursor-pointer active:scale-90 active:bg-error/20'
                      : 'bg-gray-100 border-2 border-dashed border-gray-300'
                }
                ${executing ? 'cursor-default' : ''}
              `}
              aria-label={isFilled
                ? `${t[cmd] || cmd} - stap ${i + 1}`
                : `Leeg vakje ${i + 1}`
              }
            >
              {isFilled ? CMD_ICONS[cmd] : ''}
            </button>
          );
        })}
      </div>

      {/* Command buttons */}
      {!executing && (
        <>
          <div className="flex justify-center gap-3 mb-3">
            <button
              onClick={() => canAdd && onAddCommand('forward')}
              disabled={!canAdd}
              className={`
                flex flex-col items-center justify-center
                w-[72px] h-[72px] rounded-2xl font-display font-bold
                shadow-md transition-all
                ${canAdd
                  ? 'bg-primary-blue-dark text-white active:scale-90 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span className="text-2xl">⬆️</span>
              <span className="text-xs mt-0.5">{t.forward}</span>
            </button>
            <button
              onClick={() => canAdd && onAddCommand('left')}
              disabled={!canAdd}
              className={`
                flex flex-col items-center justify-center
                w-[72px] h-[72px] rounded-2xl font-display font-bold
                shadow-md transition-all
                ${canAdd
                  ? 'bg-primary-coral-dark text-white active:scale-90 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span className="text-2xl">⬅️</span>
              <span className="text-xs mt-0.5">{t.left}</span>
            </button>
            <button
              onClick={() => canAdd && onAddCommand('right')}
              disabled={!canAdd}
              className={`
                flex flex-col items-center justify-center
                w-[72px] h-[72px] rounded-2xl font-display font-bold
                shadow-md transition-all
                ${canAdd
                  ? 'bg-primary-coral-dark text-white active:scale-90 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <span className="text-2xl">➡️</span>
              <span className="text-xs mt-0.5">{t.right}</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex justify-center gap-3">
            <Button
              variant="success"
              size="md"
              onClick={onStart}
              disabled={!isFull}
            >
              ▶️ {t.start}
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={onClear}
              disabled={!hasCommands}
            >
              🗑️ {t.clear}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
