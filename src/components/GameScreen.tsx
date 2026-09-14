import { useEffect, useState } from 'react';
import type { GameEvent, GameStats, OutcomeResult } from '@/game/types';
import HUD from './HUD';
import WorldVisual from './WorldVisual';
import EventPopup from './EventPopup';
import Particles from './Particles';

interface GameScreenProps {
  stats: GameStats;
  activeEvent: GameEvent | null;
  lastOutcome: OutcomeResult | null;
  shake: number;
  onChoose: (health: number, chaos: number, score: number, outcome: string, twistChance?: number) => void;
  onDismiss: () => void;
  onToggleMute: () => void;
  muted: boolean;
}

export default function GameScreen({
  stats,
  activeEvent,
  lastOutcome,
  shake,
  onChoose,
  onDismiss,
  onToggleMute,
  muted,
}: GameScreenProps) {
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [particleType, setParticleType] = useState<'confetti' | 'explosion' | 'rare'>('confetti');

  useEffect(() => {
    if (!lastOutcome) return;
    if (lastOutcome.twist) {
      setParticleType('rare');
    } else if (lastOutcome.good) {
      setParticleType('confetti');
    } else {
      setParticleType('explosion');
    }
    setParticleTrigger((t) => t + 1);
  }, [lastOutcome]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(244, 114, 182, 0.3) 0%, transparent 40%)',
          animation: 'bg-shift 10s ease-in-out infinite alternate',
        }}
      />

      <button
        onClick={onToggleMute}
        className="absolute right-4 top-4 z-40 rounded-full border border-white/15 bg-black/40 p-2.5 text-white/70 backdrop-blur-sm transition-all hover:scale-110 hover:text-white"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <HUD
        health={stats.health}
        chaos={stats.chaos}
        elapsedMs={stats.elapsedMs}
        score={stats.score}
        combo={stats.combo}
      />

      <div className="flex min-h-screen items-center justify-center px-4 pt-32 pb-20">
        <WorldVisual
          health={stats.health}
          chaos={stats.chaos}
          shake={shake}
          active={activeEvent !== null}
        />
      </div>

      <Particles trigger={particleTrigger} type={particleType} />

      {activeEvent && (
        <EventPopup
          event={activeEvent}
          outcome={lastOutcome}
          onChoose={onChoose}
          onDismiss={onDismiss}
        />
      )}
    </div>
  );
}
