import { useState } from 'react';
import type { HighScores } from '@/game/types';
import { playSound } from '@/game/sound';
import Leaderboard from './Leaderboard';

interface HomeScreenProps {
  highScores: HighScores;
  onStart: () => void;
  muted: boolean;
  onToggleMute: () => void;
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function HomeScreen({ highScores, onStart, muted, onToggleMute }: HomeScreenProps) {
  const [hovering, setHovering] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.15) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'grid-move 20s linear infinite',
      }} />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {['☄️', '👽', '🐸', '🦆', '🌪️', '🍕', '🤖', '🐉'].map((emoji, i) => (
          <div
            key={i}
            className="absolute text-3xl opacity-20 sm:text-4xl"
            style={{
              left: `${(i * 13 + 5) % 90}%`,
              top: `${(i * 17 + 10) % 80}%`,
              animation: `float ${8 + i * 1.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {emoji}
          </div>
        ))}
      </div>

      <button
        onClick={onToggleMute}
        className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/40 p-2.5 text-white/70 backdrop-blur-sm transition-all hover:scale-110 hover:text-white"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div
          className="mb-1 text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl"
          style={{
            background: 'linear-gradient(135deg, #22d3ee 0%, #f472b6 50%, #fbbf24 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'title-glow 3s ease-in-out infinite alternate',
            filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))',
          }}
        >
          🌎 INTERNET
        </div>
        <div
          className="mb-3 text-5xl font-black tracking-tighter sm:text-7xl md:text-8xl"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #22d3ee 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'title-glow 3s ease-in-out infinite alternate',
            filter: 'drop-shadow(0 0 20px rgba(244, 114, 182, 0.3))',
          }}
        >
          CHAOS
        </div>

        <p className="mb-8 text-lg font-medium text-white/60 sm:text-xl">
          One click can change everything.
        </p>

        <button
          onClick={() => { playSound('start'); onStart(); }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="group relative overflow-hidden rounded-full px-10 py-5 text-xl font-black tracking-wider text-white shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 sm:px-14 sm:py-6 sm:text-2xl"
          style={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)',
            boxShadow: '0 0 30px rgba(34, 211, 238, 0.4), 0 0 60px rgba(236, 72, 153, 0.2)',
            animation: 'btn-pulse 2s ease-in-out infinite',
          }}
        >
          <span className="relative z-10 flex items-center gap-2">
            ⚡ START CHAOS
            <span className="text-2xl transition-transform group-hover:translate-x-1">→</span>
          </span>
          <div
            className="absolute inset-0 -translate-x-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: hovering ? 'shine 0.8s ease-out' : 'none',
            }}
          />
        </button>

        <div className="mt-10 flex gap-4 sm:gap-8">
          <div className="rounded-xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-sm">
            <div className="text-[10px] font-bold tracking-widest text-white/40">🏆 BEST TIME</div>
            <div className="font-mono text-xl font-bold text-cyan-300 sm:text-2xl">
              {highScores.bestTime > 0 ? formatTime(highScores.bestTime) : '--:--'}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/40 px-5 py-3 backdrop-blur-sm">
            <div className="text-[10px] font-bold tracking-widest text-white/40">⭐ HIGH SCORE</div>
            <div className="font-mono text-xl font-bold text-pink-300 sm:text-2xl">
              {highScores.bestScore > 0 ? highScores.bestScore.toLocaleString() : '0'}
            </div>
          </div>
        </div>

        {/* Leaderboard toggle */}
        <button
          onClick={() => { playSound('click'); setShowLeaderboard((s) => !s); }}
          className="mt-6 text-sm font-medium text-cyan-400/70 transition-colors hover:text-cyan-300"
        >
          {showLeaderboard ? '▼ Hide Leaderboard' : '▶ View Global Leaderboard'}
        </button>

        {showLeaderboard && (
          <div className="mt-3 w-full max-w-md rounded-xl border border-white/10 bg-black/30 p-4" style={{ animation: 'fade-in 0.3s ease-out' }}>
            <Leaderboard refreshKey={0} compact />
          </div>
        )}
      </div>

      <div className="absolute bottom-4 text-center text-xs text-white/30">
        Keep the world alive. Survive the chaos. Make terrible decisions.
      </div>
    </div>
  );
}
