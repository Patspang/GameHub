// Brief screen flash effect when the player gets hit by a creature
// Red tint that fades out quickly
// Uses a dismissed counter to track when the flash should hide,
// avoiding synchronous setState in effects (React 19 rule)

import { useEffect, useRef, useState } from 'react';

export function FlashOverlay({ trigger }) {
  const [dismissed, setDismissed] = useState(0);
  const timerRef = useRef(null);

  // The flash is visible when trigger has been incremented but not yet dismissed
  const visible = trigger > 0 && trigger > dismissed;

  useEffect(() => {
    if (visible) {
      timerRef.current = setTimeout(() => setDismissed(trigger), 300);
      return () => clearTimeout(timerRef.current);
    }
  }, [visible, trigger]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300"
      style={{ backgroundColor: 'rgba(252, 129, 129, 0.3)' }}
    />
  );
}
