import { useCallback, useEffect, useState } from 'react';
import { useGame } from '@/game/useGame';
import { loadHighScores, saveHighScores } from '@/game/storage';
import { setMuted as setGlobalMuted } from '@/game/sound';
import type { HighScores } from '@/game/types';
import HomeScreen from '@/components/HomeScreen';
import GameScreen from '@/components/GameScreen';
import GameOverScreen from '@/components/GameOverScreen';

function App() {
  const game = useGame();
  const [highScores, setHighScores] = useState<HighScores>({ bestTime: 0, bestScore: 0 });
  const [muted, setMuted] = useState(false);
  const [isNewBest, setIsNewBest] = useState(false);

  useEffect(() => {
    setHighScores(loadHighScores());
  }, []);

  useEffect(() => {
    setGlobalMuted(muted);
  }, [muted]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const handleStart = useCallback(() => {
    game.startGame();
  }, [game]);

  const handlePlayAgain = useCallback(() => {
    game.startGame();
  }, [game]);

  const handleHome = useCallback(() => {
    game.resetToHome();
  }, [game]);

  // Save high scores when game ends
  useEffect(() => {
    if (game.phase === 'gameover') {
      const newBest = { ...highScores };
      let updated = false;
      if (game.stats.elapsedMs > highScores.bestTime) {
        newBest.bestTime = game.stats.elapsedMs;
        updated = true;
      }
      if (game.stats.score > highScores.bestScore) {
        newBest.bestScore = game.stats.score;
        updated = true;
      }
      setIsNewBest(updated);
      if (updated) {
        setHighScores(newBest);
        saveHighScores(newBest);
      }
    }
  }, [game.phase, game.stats, highScores]);

  if (game.phase === 'home') {
    return <HomeScreen highScores={highScores} onStart={handleStart} muted={muted} onToggleMute={toggleMute} />;
  }

  if (game.phase === 'playing') {
    return (
      <GameScreen
        stats={game.stats}
        activeEvent={game.activeEvent}
        lastOutcome={game.lastOutcome}
        shake={game.shake}
        onChoose={game.makeChoice}
        onDismiss={game.dismissEvent}
        onToggleMute={toggleMute}
        muted={muted}
      />
    );
  }

  return (
    <GameOverScreen
      stats={game.stats}
      highScores={highScores}
      isNewBest={isNewBest}
      onPlayAgain={handlePlayAgain}
      onHome={handleHome}
    />
  );
}

export default App;
