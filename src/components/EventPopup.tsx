import { useEffect, useState } from 'react';
import type { GameEvent, OutcomeResult } from '@/game/types';
import { playSound } from '@/game/sound';

interface EventPopupProps {
  event: GameEvent;
  outcome: OutcomeResult | null;
  onChoose: (health: number, chaos: number, score: number, outcome: string, twistChance?: number) => void;
  onDismiss: () => void;
}

export default function EventPopup({ event, outcome, onChoose, onDismiss }: EventPopupProps) {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [event.id]);

  useEffect(() => {
    if (outcome) {
      const t = setTimeout(onDismiss, 2500);
      return () => clearTimeout(t);
    }
  }, [outcome, onDismiss]);

  const handleChoose = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    playSound('click');
    const choice = event.choices[idx];
    setTimeout(() => {
      onChoose(choice.health, choice.chaos, choice.score, choice.outcome, choice.twistChance);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        style={{ animation: 'fade-in 0.3s ease-out' }}
      />

      <div
        className={`relative w-full max-w-md rounded-2xl border-2 p-5 sm:p-7 ${
          event.rare
            ? 'border-yellow-400/60 bg-gradient-to-b from-yellow-900/30 to-black/80'
            : 'border-cyan-400/40 bg-gradient-to-b from-slate-900/90 to-black/90'
        }`}
        style={{ animation: 'popup-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        {event.rare && (
          <div
            className="pointer-events-none absolute -inset-px overflow-hidden rounded-2xl"
            style={{
              background: 'linear-gradient(45deg, transparent, rgba(251, 191, 36, 0.2), transparent)',
              animation: 'shimmer 2s linear infinite',
            }}
          />
        )}

        <div className="relative text-center">
          <div
            className="mb-2 text-6xl sm:text-7xl"
            style={{ animation: 'event-emoji 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            {event.emoji}
          </div>
          <div
            className={`mb-1 text-xs font-bold tracking-[0.3em] ${
              event.rare ? 'text-yellow-400' : 'text-cyan-400'
            }`}
          >
            {event.rare ? '✨ RARE EVENT ✨' : 'EVENT DETECTED!'}
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            {event.title}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-white/70">
            {event.description}
          </p>
        </div>

        {outcome && selected !== null ? (
          <div
            className={`mt-5 rounded-xl border p-4 text-center ${
              outcome.good
                ? 'border-green-400/40 bg-green-500/10'
                : 'border-red-400/40 bg-red-500/10'
            }`}
            style={{ animation: 'fade-in 0.3s ease-out' }}
          >
            {outcome.twist && (
              <div className="mb-1 text-sm font-bold text-yellow-400" style={{ animation: 'combo-pop 0.3s ease-out' }}>
                ⚡ TWIST!
              </div>
            )}
            <p className="text-sm font-medium text-white/90">{outcome.message}</p>
            <div className="mt-3 flex justify-center gap-4 text-sm font-bold">
              <span className={outcome.health >= 0 ? 'text-green-400' : 'text-red-400'}>
                {outcome.health >= 0 ? '+' : ''}{outcome.health} HP
              </span>
              <span className={outcome.chaos <= 0 ? 'text-green-400' : 'text-red-400'}>
                {outcome.chaos >= 0 ? '+' : ''}{outcome.chaos} Chaos
              </span>
              <span className="text-cyan-300">
                +{Math.abs(outcome.score)} pts
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            {event.choices.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoose(idx)}
                disabled={selected !== null}
                className={`group flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 ${
                  selected === idx
                    ? 'scale-[0.98] border-cyan-400 bg-cyan-400/20'
                    : selected !== null
                    ? 'border-white/10 bg-white/5 opacity-40'
                    : 'border-white/15 bg-white/5 hover:scale-[1.02] hover:border-cyan-400/60 hover:bg-cyan-400/10 active:scale-[0.98]'
                }`}
              >
                {choice.emoji && (
                  <span className="text-2xl transition-transform group-hover:scale-125">
                    {choice.emoji}
                  </span>
                )}
                <span className="flex-1 text-base font-bold text-white">
                  {choice.label}
                </span>
                <span className="text-lg text-white/30 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
