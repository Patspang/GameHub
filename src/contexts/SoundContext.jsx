// Shared sound state — single source of truth for soundEnabled
// Solves the problem where Header and game components each had their
// own independent copy of soundEnabled via useLocalStorage

import { createContext, useContext, useCallback, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useLocalStorage('sound-enabled', true);
  const audioCtxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled, getCtx }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSoundContext must be used within SoundProvider');
  return ctx;
}
