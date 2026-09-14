export type GamePhase = 'home' | 'playing' | 'gameover';

export interface Choice {
  label: string;
  emoji?: string;
  health: number;
  chaos: number;
  score: number;
  /** Short outcome message shown after picking */
  outcome: string;
  /** Rare twist chance 0-1 — reverses or amplifies effects */
  twistChance?: number;
}

export interface GameEvent {
  id: string;
  emoji: string;
  title: string;
  description: string;
  choices: Choice[];
  rare?: boolean;
  /** Screen shake intensity 0-3 */
  shake?: number;
}

export interface OutcomeResult {
  health: number;
  chaos: number;
  score: number;
  message: string;
  good: boolean;
  twist: boolean;
}

export interface GameStats {
  health: number;
  chaos: number;
  score: number;
  combo: number;
  maxChaos: number;
  eventsSurvived: number;
  startTime: number;
  elapsedMs: number;
  decisionHistory: string[];
}

export interface HighScores {
  bestTime: number;
  bestScore: number;
}
