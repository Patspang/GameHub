// Detects swipe gestures on touch devices and returns the direction
// Minimum swipe distance threshold prevents accidental triggers

import { useRef, useCallback } from 'react';

const MIN_SWIPE_DISTANCE = 30;

export function useSwipeGesture(onSwipe) {
  const touchStart = useRef(null);

  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart.current) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStart.current.x;
    const dy = touch.clientY - touchStart.current.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // Only register if the swipe was long enough
    if (Math.max(absDx, absDy) < MIN_SWIPE_DISTANCE) {
      touchStart.current = null;
      return;
    }

    // Determine direction based on the dominant axis
    let direction;
    if (absDx > absDy) {
      direction = dx > 0 ? 'right' : 'left';
    } else {
      direction = dy > 0 ? 'down' : 'up';
    }

    onSwipe(direction);
    touchStart.current = null;
  }, [onSwipe]);

  return { handleTouchStart, handleTouchEnd };
}
