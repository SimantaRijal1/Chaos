interface WorldVisualProps {
  health: number;
  chaos: number;
  shake: number;
  active: boolean;
}

export default function WorldVisual({ health, chaos, shake, active }: WorldVisualProps) {
  const healthRatio = health / 100;
  const chaosRatio = chaos / 100;

  const worldColor =
    healthRatio > 0.6 ? '#34d399' : healthRatio > 0.3 ? '#fbbf24' : '#ef4444';
  const glowIntensity = 20 + healthRatio * 40;

  const chaosRotation = active ? chaosRatio * 10 : 0;
  const shakeStyle = shake > 0
    ? { animation: `world-shake ${0.15 * shake}s ease-in-out ${shake * 2}` }
    : {};

  return (
    <div className="relative flex items-center justify-center" style={shakeStyle}>
      {/* Chaos rings */}
      <div
        className="absolute rounded-full border-2 border-dashed"
        style={{
          width: '320px',
          height: '320px',
          borderColor: `rgba(244, 114, 182, ${0.2 + chaosRatio * 0.4})`,
          animation: `spin ${10 - chaosRatio * 6}s linear infinite`,
        }}
      />
      <div
        className="absolute rounded-full border border-dashed"
        style={{
          width: '260px',
          height: '260px',
          borderColor: `rgba(251, 191, 36, ${0.15 + chaosRatio * 0.3})`,
          animation: `spin-reverse ${8 - chaosRatio * 4}s linear infinite`,
        }}
      />

      {/* Orbiting chaos elements */}
      {chaos > 10 && (
        <div
          className="absolute"
          style={{
            width: '280px',
            height: '280px',
            animation: `spin ${6}s linear infinite`,
          }}
        >
          <div
            className="absolute text-2xl"
            style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}
          >
            {['☄️', '🐸', '🦆', '🌪️'][Math.floor(chaos / 25) % 4]}
          </div>
        </div>
      )}

      {/* Glow */}
      <div
        className="absolute rounded-full blur-2xl"
        style={{
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${worldColor}40, transparent 70%)`,
          opacity: 0.6 + chaosRatio * 0.3,
        }}
      />

      {/* World sphere */}
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          width: '180px',
          height: '180px',
          background: `radial-gradient(circle at 35% 35%, ${worldColor}, ${worldColor}80 60%, #0a0e1a 100%)`,
          boxShadow: `0 0 ${glowIntensity}px ${worldColor}80, inset -20px -20px 40px rgba(0,0,0,0.5)`,
          transform: `rotate(${chaosRotation}deg)`,
          transition: 'transform 0.5s ease',
        }}
      >
        {/* Surface texture */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `repeating-radial-gradient(circle at 30% 40%, transparent 0, transparent 8px, rgba(255,255,255,0.1) 8px, rgba(255,255,255,0.1) 10px)`,
          }}
        />
        {/* Health indicator dots */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: healthRatio > 0.3 ? 0.4 : 0.7 }}
        >
          <span className="text-5xl" style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}>
            {healthRatio > 0.6 ? '🌍' : healthRatio > 0.3 ? '🌍' : '💔'}
          </span>
        </div>
        {/* Chaos overlay */}
        {chaosRatio > 0.5 && (
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(239, 68, 68, ${chaosRatio * 0.3}) 100%)`,
            }}
          />
        )}
      </div>

      {/* Pulse ring on low health */}
      {healthRatio < 0.3 && (
        <div
          className="absolute rounded-full border-2 border-red-500"
          style={{
            width: '200px',
            height: '200px',
            animation: 'pulse-ring 1s ease-out infinite',
          }}
        />
      )}
    </div>
  );
}
