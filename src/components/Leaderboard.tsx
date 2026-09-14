import { useEffect, useState } from 'react';
import { fetchLeaderboard, type LeaderboardEntry } from '@/game/leaderboard';

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

interface LeaderboardProps {
  refreshKey: number;
  compact?: boolean;
}

export default function Leaderboard({ refreshKey, compact }: LeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLeaderboard(10).then((data) => {
      if (!cancelled) {
        setEntries(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-white/40">
        <span className="text-sm">Loading leaderboard...</span>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-white/40">
        No scores yet. Be the first to make history!
      </div>
    );
  }

  const medalColors = ['#fbbf24', '#cbd5e1', '#d97706'];

  return (
    <div className="w-full">
      <div className="mb-3 text-center text-xs font-bold tracking-widest text-white/50">
        🏆 GLOBAL LEADERBOARD
      </div>
      <div className="space-y-1.5">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 ${
              i < 3
                ? 'border-yellow-400/30 bg-yellow-400/5'
                : 'border-white/10 bg-white/5'
            }`}
          >
            <div
              className="flex w-7 shrink-0 items-center justify-center text-sm font-bold"
              style={{ color: i < 3 ? medalColors[i] : 'rgba(255,255,255,0.4)' }}
            >
              {i < 3 ? ['🥇', '🥈', '🥉'][i] : `${i + 1}`}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-bold text-white">
                {entry.player_name}
              </div>
              {!compact && (
                <div className="text-[10px] text-white/40">
                  {entry.title} · {formatTime(entry.survival_time_ms)} · {entry.events_survived} events
                </div>
              )}
            </div>
            <div className="shrink-0 text-right">
              <div className="font-mono text-sm font-bold text-cyan-300">
                {entry.score.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
