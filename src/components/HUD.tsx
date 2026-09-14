interface HUDProps {
  health: number;
  chaos: number;
  elapsedMs: number;
  score: number;
  combo: number;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function StatBar({ value, icon, label, color }: { value: number; icon: string; label: string; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <span className="font-bold tracking-wider text-white/80">
          {icon} {label}
        </span>
        <span className="font-mono font-bold text-white">{Math.round(value)}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${Math.max(0, Math.min(100, value))}%`,
            background: color,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      </div>
    </div>
  );
}

export default function HUD({ health, chaos, elapsedMs, score, combo }: HUDProps) {
  const healthColor = health > 60 ? '#34d399' : health > 30 ? '#fbbf24' : '#ef4444';
  const chaosColor = chaos < 30 ? '#22d3ee' : chaos < 60 ? '#fbbf24' : '#f472b6';

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-5">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2.5">
            <StatBar value={health} icon="❤️" label="WORLD HEALTH" color={healthColor} />
            <StatBar value={chaos} icon="🌪️" label="CHAOS LEVEL" color={chaosColor} />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2.5">
              <div className="text-[10px] font-bold tracking-widest text-white/50">⏱️ TIME</div>
              <div className="font-mono text-lg font-bold text-white sm:text-2xl">{formatTime(elapsedMs)}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-2.5">
              <div className="text-[10px] font-bold tracking-widest text-white/50">⭐ SCORE</div>
              <div className="font-mono text-lg font-bold text-cyan-300 sm:text-2xl">{score.toLocaleString()}</div>
            </div>
            {combo >= 2 && (
              <div
                className="rounded-lg border border-yellow-400/40 bg-yellow-400/10 px-3 py-1.5"
                style={{ animation: 'combo-pop 0.3s ease-out' }}
              >
                <span className="text-sm font-bold text-yellow-300">
                  🔥 {combo}x COMBO
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
