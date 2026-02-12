// On-screen D-pad for tablet/touch devices
// Large buttons positioned at bottom of screen for easy thumb access
// Fires direction callbacks on touch start (not touch end) for responsiveness

import { useCallback } from 'react';

export function TouchControls({ onDirection }) {
  // Use onTouchStart for instant response, prevent default to avoid scrolling
  const handleTouch = useCallback((direction) => (e) => {
    e.preventDefault();
    onDirection(direction);
  }, [onDirection]);

  return (
    <div className="flex justify-center mt-4 select-none" style={{ touchAction: 'none' }}>
      <div className="relative" style={{ width: 200, height: 200 }}>
        {/* Up */}
        <button
          onTouchStart={handleTouch('up')}
          onMouseDown={() => onDirection('up')}
          className="absolute top-0 left-1/2 -translate-x-1/2
            w-16 h-16 rounded-xl bg-primary-blue text-white text-3xl font-bold
            shadow-lg active:scale-90 active:bg-primary-blue/80
            flex items-center justify-center cursor-pointer"
          style={{ touchAction: 'none' }}
          aria-label="Omhoog"
        >
          ▲
        </button>

        {/* Down */}
        <button
          onTouchStart={handleTouch('down')}
          onMouseDown={() => onDirection('down')}
          className="absolute bottom-0 left-1/2 -translate-x-1/2
            w-16 h-16 rounded-xl bg-primary-blue text-white text-3xl font-bold
            shadow-lg active:scale-90 active:bg-primary-blue/80
            flex items-center justify-center cursor-pointer"
          style={{ touchAction: 'none' }}
          aria-label="Omlaag"
        >
          ▼
        </button>

        {/* Left */}
        <button
          onTouchStart={handleTouch('left')}
          onMouseDown={() => onDirection('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2
            w-16 h-16 rounded-xl bg-primary-blue text-white text-3xl font-bold
            shadow-lg active:scale-90 active:bg-primary-blue/80
            flex items-center justify-center cursor-pointer"
          style={{ touchAction: 'none' }}
          aria-label="Links"
        >
          ◀
        </button>

        {/* Right */}
        <button
          onTouchStart={handleTouch('right')}
          onMouseDown={() => onDirection('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2
            w-16 h-16 rounded-xl bg-primary-blue text-white text-3xl font-bold
            shadow-lg active:scale-90 active:bg-primary-blue/80
            flex items-center justify-center cursor-pointer"
          style={{ touchAction: 'none' }}
          aria-label="Rechts"
        >
          ▶
        </button>

        {/* Center indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center">
          <span className="text-lg">🎯</span>
        </div>
      </div>
    </div>
  );
}
