import type { HighScores } from './types';

const KEY = 'internet-chaos-highscores';

export function loadHighScores(): HighScores {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<HighScores>;
      return {
        bestTime: parsed.bestTime ?? 0,
        bestScore: parsed.bestScore ?? 0,
      };
    }
  } catch {
    // ignore
  }
  return { bestTime: 0, bestScore: 0 };
}

export function saveHighScores(scores: HighScores): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(scores));
  } catch {
    // ignore
  }
}
