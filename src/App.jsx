import { useState } from 'react';
import { SCREENS } from './constants/gameConfig';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Header } from './components/layout/Header';
import { HomePage } from './components/layout/HomePage';
import { GameMenu } from './components/common/GameMenu';
import { GameContainer } from './components/layout/GameContainer';

export function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.HOME);
  const [selectedGame, setSelectedGame] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [language, setLanguage] = useState('nl');
  // eslint-disable-next-line no-unused-vars
  const [highScores, setHighScores] = useLocalStorage('gamehub-scores', {});

  const handleGameSelect = (gameId) => {
    setSelectedGame(gameId);
    setCurrentScreen(SCREENS.GAME_MENU);
  };

  const handleDifficultySelect = (diff) => {
    setDifficulty(diff);
    setCurrentScreen(SCREENS.PLAYING);
  };

  const handleBackToHome = () => {
    setCurrentScreen(SCREENS.HOME);
    setSelectedGame(null);
    setDifficulty(null);
  };

  const handleBackToGameMenu = () => {
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
