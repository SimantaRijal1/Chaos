import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameEvent, GamePhase, GameStats, OutcomeResult } from './types';
import { getRandomEvent } from './events';
import { playSound } from './sound';

const INITIAL_STATS: GameStats = {
  health: 100,
  chaos: 0,
  score: 0,
  combo: 0,
  maxChaos: 0,
  eventsSurvived: 0,
  startTime: 0,
  elapsedMs: 0,
  decisionHistory: [],
};

const MAX_HISTORY = 5;
const BASE_INTERVAL = 6000;
const MIN_INTERVAL = 2200;

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function useGame() {
  const [phase, setPhase] = useState<GamePhase>('home');
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [lastOutcome, setLastOutcome] = useState<OutcomeResult | null>(null);
  const [shake, setShake] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const statsRef = useRef(stats);
  const phaseRef = useRef(phase);
  const eventActiveRef = useRef(false);

  useEffect(() => { statsRef.current = stats; }, [stats]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const triggerEvent = useCallback(() => {
    if (phaseRef.current !== 'playing' || eventActiveRef.current) return;
    const s = statsRef.current;
    const event = getRandomEvent(s.chaos, s.decisionHistory.slice(-MAX_HISTORY));
    eventActiveRef.current = true;
    setActiveEvent(event);
    setLastOutcome(null);
    setShake(event.shake ?? 1);
    playSound(event.rare ? 'rare' : 'event');
    setTimeout(() => setShake(0), 600);
  }, []);

  useEffect(() => {
    if (phase !== 'playing' || activeEvent) return;
    const chaosLevel = statsRef.current.chaos;
    const interval = Math.max(MIN_INTERVAL, BASE_INTERVAL - chaosLevel * 35);
    timerRef.current = setTimeout(triggerEvent, interval);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, activeEvent, triggerEvent]);

  useEffect(() => {
    if (phase !== 'playing') return;
    tickRef.current = setInterval(() => {
      setStats((prev) => ({ ...prev, elapsedMs: Date.now() - prev.startTime }));
    }, 100);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, [phase]);

  const startGame = useCallback(() => {
    playSound('start');
    setStats({ ...INITIAL_STATS, startTime: Date.now() });
    setActiveEvent(null);
    setLastOutcome(null);
    eventActiveRef.current = false;
    setPhase('playing');
  }, []);

  const endGame = useCallback(() => {
    playSound('gameover');
    setPhase('gameover');
    setActiveEvent(null);
    setLastOutcome(null);
    eventActiveRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
  }, []);

  const makeChoice = useCallback((healthDelta: number, chaosDelta: number, scoreDelta: number, outcomeMsg: string, twistChance?: number) => {
    let twist = false;
    let h = healthDelta;
    let c = chaosDelta;
    let s = scoreDelta;
    let msg = outcomeMsg;

    if (twistChance && Math.random() < twistChance) {
      twist = true;
      const twistType = Math.random();
      if (twistType < 0.4) {
        h = -Math.abs(h) || -10;
        c = Math.abs(c) + 5;
        msg = `PLOT TWIST! ${outcomeMsg} ...But it backfired spectacularly.`;
      } else if (twistType < 0.7) {
        h = Math.abs(h) + 5;
        c = -Math.abs(c);
        s = Math.abs(s) + 50;
        msg = `LUCKY TWIST! ${outcomeMsg} ...And it worked out even better than expected!`;
      } else {
        s = s * 2;
        msg = `CHAOS TWIST! ${outcomeMsg} ...And somehow you got DOUBLE points!`;
      }
      playSound('twist');
    }

    const good = h >= 0 && c <= 0;

    let newHealth = 0;
    let newCombo = 0;
    let comboBonus = 0;

    setStats((prev) => {
      newHealth = clamp(prev.health + h, 0, 100);
      const newChaos = clamp(prev.chaos + c, 0, 100);
      newCombo = good ? prev.combo + 1 : 0;
      comboBonus = newCombo >= 3 ? newCombo * 10 : 0;
      const finalScore = prev.score + Math.abs(s) + comboBonus;

      return {
        ...prev,
        health: newHealth,
        chaos: newChaos,
        score: finalScore,
        combo: newCombo,
        maxChaos: Math.max(prev.maxChaos, newChaos),
        eventsSurvived: prev.eventsSurvived + 1,
        decisionHistory: [...prev.decisionHistory, msg].slice(-20),
      };
    });

    const result: OutcomeResult = { health: h, chaos: c, score: s, message: msg, good, twist };
    setLastOutcome(result);

    if (good) {
      playSound('combo');
    } else {
      playSound('bad');
    }

    // Check game over after state update
    setTimeout(() => {
      if (newHealth <= 0) {
        endGame();
      }
    }, 100);
  }, [endGame]);

  const dismissEvent = useCallback(() => {
    setActiveEvent(null);
    setLastOutcome(null);
    eventActiveRef.current = false;
  }, []);

  const resetToHome = useCallback(() => {
    setPhase('home');
    setStats(INITIAL_STATS);
    setActiveEvent(null);
    setLastOutcome(null);
    eventActiveRef.current = false;
  }, []);

  return {
    phase,
    stats,
    activeEvent,
    lastOutcome,
    shake,
    startGame,
    endGame,
    makeChoice,
    dismissEvent,
    resetToHome,
  };
}
