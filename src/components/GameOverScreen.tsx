import { useEffect, useState } from 'react';
import type { GameStats, HighScores } from '@/game/types';
import { getTitle, getShareText } from '@/game/titles';
import { playSound } from '@/game/sound';
import { submitScore } from '@/game/leaderboard';
import Leaderboard from './Leaderboard';

interface GameOverScreenProps {
  stats: GameStats;
  highScores: HighScores;
  isNewBest: boolean;
  onPlayAgain: () => void;
  onHome: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function GameOverScreen({ stats, highScores, isNewBest, onPlayAgain, onHome }: GameOverScreenProps) {
  const title = getTitle(stats.score, stats.eventsSurvived, stats.maxChaos);
  const shareText = getShareText(stats.score, stats.elapsedMs, title);
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [leaderboardKey, setLeaderboardKey] = useState(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const handleSubmit = async () => {
    if (submitted || submitting) return;
    setSubmitting(true);
    const name = playerName.trim().slice(0, 20) || 'Anonymous';
    const ok = await submitScore({
      player_name: name,
      score: stats.score,
      survival_time_ms: stats.elapsedMs,
      max_chaos: Math.round(stats.maxChaos),
      events_survived: stats.eventsSurvived,
      title,
    });
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
      setLeaderboardKey((k) => k + 1);
      setShowLeaderboard(true);
    }
  };

  const handleShare = async () => {
    playSound('click');
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText, title: 'INTERNET CHAOS' });
      } catch {
        // user cancelled
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Score copied to clipboard!');
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/30 via-slate-950 to-black" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.3) 0%, transparent 60%)',
          animation: 'bg-shift 8s ease-in-out infinite alternate',
        }}
      />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div
          className="mb-1 text-4xl font-black tracking-tighter sm:text-6xl"
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'title-glow 3s ease-in-out infinite alternate',
          }}
        >
          🌎 THE WORLD
        </div>
        <div
          className="mb-6 text-4xl font-black tracking-tighter sm:text-6xl"
          style={{
            background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'title-glow 3s ease-in-out infinite alternate',
          }}
        >
          HAS FALLEN
        </div>

        <div
          className="mb-6 rounded-2xl border-2 border-yellow-400/40 bg-yellow-400/5 px-6 py-4"
          style={{ animation: 'popup-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        >
          <div className="text-xs font-bold tracking-widest text-yellow-400/60">YOUR TITLE</div>
          <div className="text-xl font-extrabold text-yellow-300 sm:text-2xl">{title}</div>
        </div>

        <div className="mb-6 grid w-full grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="text-[10px] font-bold tracking-widest text-white/40">⏱️ SURVIVAL</div>
            <div className="font-mono text-lg font-bold text-cyan-300 sm:text-xl">
              {formatTime(stats.elapsedMs)}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="text-[10px] font-bold tracking-widest text-white/40">⭐ SCORE</div>
            <div className="font-mono text-lg font-bold text-pink-300 sm:text-xl">
              {stats.score.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="text-[10px] font-bold tracking-widest text-white/40">🌪️ MAX CHAOS</div>
            <div className="font-mono text-lg font-bold text-orange-300 sm:text-xl">
              {Math.round(stats.maxChaos)}%
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 p-4">
            <div className="text-[10px] font-bold tracking-widest text-white/40">📊 EVENTS SURVIVED</div>
            <div className="font-mono text-lg font-bold text-green-300 sm:text-xl">
              {stats.eventsSurvived}
            </div>
          </div>
        </div>

        {isNewBest && (
          <div
            className="mb-4 rounded-full border border-yellow-400/50 bg-yellow-400/10 px-4 py-2 text-sm font-bold text-yellow-300"
            style={{ animation: 'combo-pop 0.4s ease-out' }}
          >
            🏆 NEW HIGH SCORE!
          </div>
        )}

        {/* Score submission */}
        {!submitted ? (
          <div className="mb-4 w-full">
            <div className="mb-2 text-xs font-bold tracking-widest text-white/50">
              SUBMIT TO LEADERBOARD
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={20}
                placeholder="Your name..."
                className="flex-1 rounded-xl border-2 border-white/15 bg-black/40 px-4 py-3 text-sm font-bold text-white placeholder-white/30 outline-none transition-colors focus:border-cyan-400/60"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
              />
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl border-2 border-cyan-400/40 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-300 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {submitting ? '...' : 'SUBMIT'}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="mb-4 rounded-xl border border-green-400/40 bg-green-500/10 px-4 py-2 text-sm font-bold text-green-300"
            style={{ animation: 'combo-pop 0.3s ease-out' }}
          >
            ✓ Score submitted to leaderboard!
          </div>
        )}

        {/* Leaderboard toggle */}
        <button
          onClick={() => { playSound('click'); setShowLeaderboard((s) => !s); }}
          className="mb-3 text-sm font-medium text-cyan-400/70 transition-colors hover:text-cyan-300"
        >
          {showLeaderboard ? '▼ Hide Leaderboard' : '▶ View Global Leaderboard'}
        </button>

        {showLeaderboard && (
          <div className="mb-6 w-full rounded-xl border border-white/10 bg-black/30 p-4" style={{ animation: 'fade-in 0.3s ease-out' }}>
            <Leaderboard refreshKey={leaderboardKey} />
          </div>
        )}

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <button
            onClick={() => { playSound('start'); onPlayAgain(); }}
            className="flex-1 rounded-full px-8 py-4 text-lg font-black tracking-wide text-white shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
              boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)',
            }}
          >
            🔄 PLAY AGAIN
          </button>
          <button
            onClick={handleShare}
            className="flex-1 rounded-full border-2 border-white/20 bg-white/5 px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:border-white/40 active:scale-95"
          >
            📤 SHARE
          </button>
        </div>

        <button
          onClick={() => { playSound('click'); onHome(); }}
          className="mt-4 text-sm font-medium text-white/40 transition-colors hover:text-white/70"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
