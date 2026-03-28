// Touch controls overlay
// Left 45% of screen: virtual joystick for walking
// Right 55% of screen: swipe to look around
// Action button: appears bottom-right when near an interactable

import { useEffect, useRef } from 'react';

export function TouchControls({ onJoystick, onLook, onInteract, actionLabel, onExit, joystickBottomOffset = 50 }) {
  const containerRef = useRef(null);
  const joystickRef = useRef(null); // { id, startX, startY }
  const lookRef = useRef(null);     // { id, lastX, lastY }

  // Keep callbacks in refs so event handlers stay stable
  const cbRef = useRef({ onJoystick, onLook });
  cbRef.current = { onJoystick, onLook };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const JOYSTICK_MAX = 55; // px radius

    const onTouchStart = (e) => {
      e.preventDefault();
      Array.from(e.changedTouches).forEach((t) => {
        const isLeft = t.clientX < window.innerWidth * 0.45;
        if (isLeft && !joystickRef.current) {
          joystickRef.current = { id: t.identifier, startX: t.clientX, startY: t.clientY };
        } else if (!isLeft && !lookRef.current) {
          lookRef.current = { id: t.identifier, lastX: t.clientX, lastY: t.clientY };
        }
      });
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      Array.from(e.changedTouches).forEach((t) => {
        // Joystick
        const joy = joystickRef.current;
        if (joy && t.identifier === joy.id) {
          let dx = t.clientX - joy.startX;
          let dy = t.clientY - joy.startY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > JOYSTICK_MAX) {
            dx = (dx / dist) * JOYSTICK_MAX;
            dy = (dy / dist) * JOYSTICK_MAX;
          }
          cbRef.current.onJoystick(dx / JOYSTICK_MAX, dy / JOYSTICK_MAX);
        }

        // Look (swipe delta)
        const look = lookRef.current;
        if (look && t.identifier === look.id) {
          const ddx = t.clientX - look.lastX;
          const ddy = t.clientY - look.lastY;
          look.lastX = t.clientX;
          look.lastY = t.clientY;
          cbRef.current.onLook(ddx, ddy);
        }
      });
    };

    const onTouchEnd = (e) => {
      e.preventDefault();
      Array.from(e.changedTouches).forEach((t) => {
        if (joystickRef.current?.id === t.identifier) {
          joystickRef.current = null;
          cbRef.current.onJoystick(0, 0);
        }
        if (lookRef.current?.id === t.identifier) {
          lookRef.current = null;
        }
      });
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });
    el.addEventListener('touchcancel', onTouchEnd, { passive: false });

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return (
    <>
      {/* Back button — outside touch capture div so clicks always fire */}
      <button
        onClick={onExit}
        style={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: 'rgba(0,0,0,0.55)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 10,
          padding: '8px 16px',
          fontSize: 15,
          fontFamily: 'system-ui, sans-serif',
          cursor: 'pointer',
          zIndex: 30,
          touchAction: 'auto',
        }}
      >
        ← Terug
      </button>

      {/* Action button — outside touch capture div */}
      {actionLabel && (
        <button
          onClick={onInteract}
          style={{
            position: 'absolute',
            bottom: 44,
            right: 44,
            background: '#f5a623',
            color: '#1a0a00',
            border: 'none',
            borderRadius: 40,
            padding: '16px 22px',
            fontSize: 17,
            fontWeight: 'bold',
            fontFamily: 'system-ui, sans-serif',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(245,166,35,0.5)',
            zIndex: 30,
            touchAction: 'auto',
            animation: 'gdp-pulse 1.2s ease-in-out infinite',
          }}
        >
          {actionLabel}
        </button>
      )}

      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0, touchAction: 'none', zIndex: 15 }}
      >

      {/* Joystick ring indicator (bottom-left, pointer-events none) */}
      <div
        style={{
          position: 'absolute',
          bottom: joystickBottomOffset,
          left: 50,
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '2px solid rgba(255,255,255,0.35)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'bottom 0.2s ease',
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.45)',
          }}
        />
      </div>

      {/* Look hint text (right side, fades) */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          right: 24,
          color: 'rgba(255,255,255,0.25)',
          fontSize: 12,
          fontFamily: 'system-ui, sans-serif',
          pointerEvents: 'none',
        }}
      >
        Veeg om te kijken
      </div>

      {/* CSS animation for action button */}
      <style>{`
        @keyframes gdp-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.07); }
        }
      `}</style>
      </div>
    </>
  );
}
