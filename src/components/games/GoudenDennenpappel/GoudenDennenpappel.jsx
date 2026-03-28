// De Gouden Dennenpappel — root game component
// Manages top-level state: intro → island map → playing an island

import { useState } from 'react';
import { IntroScreen } from './ui/IntroScreen';
import { IslandMap } from './ui/IslandMap';
import { ISLAND_REGISTRY } from './islands/island-registry';
import { useIslandProgress } from './hooks/useIslandProgress';

const NAME_KEY = 'gamehub-gouden-dennenpappel-name';

function loadSavedName() {
  try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; }
}

export function GoudenDennenpappel({ onExit }) {
  const savedName = loadSavedName();
  const [screen, setScreen] = useState(savedName ? 'map' : 'intro');
  const [playerName, setPlayerName] = useState(savedName);
  const [activeIslandId, setActiveIslandId] = useState(null);
  const { completedIslands, markComplete, isComplete } = useIslandProgress();

  // --- Intro ---
  if (screen === 'intro') {
    return (
      <IntroScreen
        onStart={(name) => {
          setPlayerName(name);
          try { localStorage.setItem(NAME_KEY, name); } catch {}
          setScreen('map');
        }}
        onExit={onExit}
      />
    );
  }

  // --- Island map ---
  if (screen === 'map') {
    return (
      <IslandMap
        islands={ISLAND_REGISTRY}
        playerName={playerName}
        isComplete={isComplete}
        onSelectIsland={(id) => {
          setActiveIslandId(id);
          setScreen('playing');
        }}
        onExit={onExit}
      />
    );
  }

  // --- Playing an island ---
  if (screen === 'playing' && activeIslandId) {
    const island = ISLAND_REGISTRY.find((i) => i.id === activeIslandId);
    if (!island) return null;

    const IslandComponent = island.component;
    return (
      <IslandComponent
        playerName={playerName}
        onComplete={() => {
          markComplete(activeIslandId);
          setScreen('map');
        }}
        onExit={() => setScreen('map')}
      />
    );
  }

  return null;
}
