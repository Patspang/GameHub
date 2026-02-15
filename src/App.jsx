import { useState } from 'react';
import { SCREENS, DIFFICULTY } from './constants/gameConfig';
import { GAMES } from './games';
import { useLocalStorage } from './hooks/useLocalStorage';
import { trackGameStart, trackDifficultySelect } from './utils/analytics';
import { Header } from './components/layout/Header';
import { HomePage } from './components/layout/HomePage';
import { GameMenu } from './components/common/GameMenu';
import { GameContainer } from './components/layout/GameContainer';

export function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.HOME);
  const [selectedGame, setSelectedGame] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [language, setLanguage] = useState('nl');
  const [playerName, setPlayerName] = useLocalStorage('gamehub-player-name', '');
  // eslint-disable-next-line no-unused-vars
  const [highScores, setHighScores, refreshHighScores] = useLocalStorage('gamehub-scores', {});
  const [playCounts, setPlayCounts] = useLocalStorage('gamehub-play-counts', {});

  const incrementPlayCount = (gameId) => {
    setPlayCounts((prev) => ({
      ...prev,
      [gameId]: (prev[gameId] || 0) + 1,
    }));
  };

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    const game = GAMES[gameId];
    if (game?.skipDifficulty) {
      setDifficulty(DIFFICULTY.EASY);
      setCurrentScreen(SCREENS.PLAYING);
      incrementPlayCount(gameId);
      trackGameStart(gameId, game.name, DIFFICULTY.EASY);
    } else {
      setCurrentScreen(SCREENS.GAME_MENU);
    }
  };

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setCurrentScreen(SCREENS.PLAYING);
    incrementPlayCount(selectedGame);
    const game = GAMES[selectedGame];
    trackDifficultySelect(selectedGame, game?.name, diff);
    trackGameStart(selectedGame, game?.name, diff);
  };

  const handleBackToHome = () => {
    refreshHighScores();
    setCurrentScreen(SCREENS.HOME);
    setSelectedGame(null);
    setDifficulty(null);
  };

  const handleBackToGameMenu = () => {
    refreshHighScores();
    setCurrentScreen(SCREENS.GAME_MENU);
    setDifficulty(null);
  };

  // Get high scores for the selected game (structured by difficulty)
  const gameHighScores = selectedGame ? (highScores[selectedGame] || {}) : {};

  // Compute the best score across all difficulties for a game (shown on home tiles)
  const getBestScore = (gameId) => {
    const scores = highScores[gameId];
    if (!scores) return 0;
    return Math.max(0, ...Object.values(scores));
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header
        onHomeClick={handleBackToHome}
        showHomeButton={currentScreen !== SCREENS.HOME}
      />

      {currentScreen === SCREENS.HOME && (
        <HomePage
          onSelectGame={handleGameSelect}
          highScores={Object.fromEntries(
            Object.keys(highScores).map((id) => [id, getBestScore(id)])
          )}
          playCounts={playCounts}
          playerName={playerName}
          onNameSet={setPlayerName}
        />
      )}

      {currentScreen === SCREENS.GAME_MENU && (
        <GameMenu
          gameId={selectedGame}
          onSelectDifficulty={handleDifficultySelect}
          onBack={handleBackToHome}
          highScores={gameHighScores}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      {currentScreen === SCREENS.PLAYING && (
        <GameContainer
          gameId={selectedGame}
          difficulty={difficulty}
          language={language}
          onExit={handleBackToHome}
          onChangeDifficulty={handleBackToGameMenu}
        />
      )}
    </div>
  );
}
