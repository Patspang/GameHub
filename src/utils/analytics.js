// Lightweight GA4 event tracking wrapper
// All events are anonymous — no PII is collected

function gtag(...args) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

export function trackEvent(eventName, params = {}) {
  gtag('event', eventName, params);
}

// --- Specific tracking functions ---

export function trackGameStart(gameId, gameName, difficulty) {
  trackEvent('game_start', {
    game_id: gameId,
    game_name: gameName,
    difficulty,
  });
}

export function trackGameComplete(gameId, gameName, difficulty, score) {
  trackEvent('game_complete', {
    game_id: gameId,
    game_name: gameName,
    difficulty,
    score,
  });
}

export function trackDifficultySelect(gameId, gameName, difficulty) {
  trackEvent('difficulty_select', {
    game_id: gameId,
    game_name: gameName,
    difficulty,
  });
}
