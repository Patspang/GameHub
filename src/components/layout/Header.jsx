// Top header bar with home navigation and sound toggle
// Always visible, provides a way back to the home screen

import { DUTCH_TEXT } from '../../constants/dutch-text';
import { useSoundEffects } from '../../hooks/useSoundEffects';

export function Header({ onHomeClick, showHomeButton = false }) {
  const { soundEnabled, setSoundEnabled } = useSoundEffects();

  return (
    <header className="bg-white/60 backdrop-blur-sm shadow-sm px-4 py-3 flex items-center justify-between">
      <h1
        className="font-display text-2xl font-bold text-text-primary cursor-pointer"
        onClick={onHomeClick}
      >
        🎮 Game Hub
      </h1>

      <div className="flex items-center gap-3">
        {/* Sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="text-2xl w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer"
          aria-label={soundEnabled ? 'Geluid uit' : 'Geluid aan'}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>

        {showHomeButton && (
          <button
            onClick={onHomeClick}
            className="game-interactive font-display font-bold text-md
              bg-primary-yellow text-text-primary min-h-[44px]
              px-5 py-2 rounded-xl shadow-sm cursor-pointer"
          >
            🏠 {DUTCH_TEXT.menu.backHome}
          </button>
        )}
      </div>
    </header>
  );
}
