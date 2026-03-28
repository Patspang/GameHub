// Feature flags — control visibility of beta/experimental games
// Enable via environment variable: VITE_ENABLE_BETA_GAMES=true
// Or via localStorage: localStorage.setItem('__GAMEHUB_BETA_ENABLED', 'true')

export function isBetaEnabled() {
  // Check environment variable first (set at build time or import.meta.env)
  if (import.meta.env.VITE_ENABLE_BETA_GAMES === 'true') {
    return true;
  }
  // Check localStorage for runtime toggle
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem('__GAMEHUB_BETA_ENABLED') === 'true';
  }
  return false;
}

// Convenience function to enable beta games at runtime (for testing)
export function enableBetaGames() {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('__GAMEHUB_BETA_ENABLED', 'true');
    window.location.reload();
  }
}

// Disable beta games
export function disableBetaGames() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('__GAMEHUB_BETA_ENABLED');
    window.location.reload();
  }
}
