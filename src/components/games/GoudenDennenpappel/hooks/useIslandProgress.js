// Tracks which islands the player has completed, stored in localStorage

import { useState } from 'react';

const KEY = 'gamehub-gouden-dennenpappel-progress';

export function useIslandProgress() {
  const [completedIslands, setCompleted] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const markComplete = (islandId) => {
    setCompleted((prev) => {
      if (prev.includes(islandId)) return prev;
      const next = [...prev, islandId];
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isComplete = (islandId) => completedIslands.includes(islandId);

  return { completedIslands, markComplete, isComplete };
}
