// Individual game card for the home page grid
// Active games are clickable with gradient backgrounds
// Coming soon games are grayed out with a badge

import { DUTCH_TEXT } from '../../constants/dutch-text';
import { ScoreDisplay } from '../common/ScoreDisplay';

export function GameTile({ game, highScore, onClick }) {
  const isAvailable = game.available;

  return (
    <div
      className={`
        relative rounded-3xl p-8 text-center
        min-h-[250px] flex flex-col items-center justify-center
        transition-all duration-200 shadow-lg
        ${isAvailable
          ? `bg-gradient-to-br ${game.color} cursor-pointer active:scale-95`
          : 'bg-bg-secondary opacity-60 border-2 border-dashed border-primary-coral cursor-default'
        }
      `}
      onClick={isAvailable ? onClick : undefined}
      role={isAvailable ? 'button' : undefined}
      tabIndex={isAvailable ? 0 : undefined}
      onKeyDown={isAvailable ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
    >
      {/* Game icon */}
      <div className="text-6xl mb-4">{game.icon}</div>

      {/* Game name */}
      <h2
        className={`font-display text-2xl font-bold ${isAvailable ? 'text-white' : 'text-text-primary'}`}
        style={isAvailable ? { textShadow: '0 1px 3px rgba(0,0,0,0.3)' } : undefined}
      >
        {game.name}
      </h2>

      {/* Available: show click prompt and optional high score */}
      {isAvailable && (
        <div style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}>
          <ScoreDisplay score={highScore} className="mt-2 text-white" />
          <p className="mt-2 text-sm text-white">
            {DUTCH_TEXT.home.clickToPlay} →
          </p>
        </div>
      )}

      {/* Coming soon badge */}
      {!isAvailable && (
        <div className="mt-4 inline-block bg-white/80 px-4 py-2 rounded-full">
          <span className="text-sm font-bold text-text-secondary">
            🔒 {DUTCH_TEXT.home.comingSoon}
          </span>
        </div>
      )}
    </div>
  );
}
