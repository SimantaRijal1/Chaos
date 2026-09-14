type SoundType = 'click' | 'event' | 'good' | 'bad' | 'rare' | 'gameover' | 'combo' | 'twist' | 'start';

let audioCtx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function setMuted(m: boolean) {
  muted = m;
}

export function isMuted() {
  return muted;
}

function tone(freq: number, duration: number, type: OscillatorType, volume: number, delay = 0) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, ctx.currentTime + delay);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + delay + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

function sweep(startFreq: number, endFreq: number, duration: number, type: OscillatorType, volume: number) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

function noise(duration: number, volume: number) {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}

export function playSound(type: SoundType) {
  switch (type) {
    case 'click':
      tone(600, 0.08, 'sine', 0.15);
      break;
    case 'start':
      sweep(200, 800, 0.3, 'sawtooth', 0.12);
      tone(400, 0.15, 'square', 0.08, 0.05);
      tone(600, 0.15, 'square', 0.08, 0.1);
      tone(800, 0.2, 'square', 0.08, 0.15);
      break;
    case 'event':
      sweep(300, 100, 0.4, 'sawtooth', 0.1);
      noise(0.2, 0.05);
      break;
    case 'rare':
      tone(523, 0.15, 'sine', 0.12);
      tone(659, 0.15, 'sine', 0.12, 0.1);
      tone(784, 0.15, 'sine', 0.12, 0.2);
      tone(1047, 0.3, 'sine', 0.12, 0.3);
      break;
    case 'good':
      tone(523, 0.1, 'sine', 0.12);
      tone(659, 0.1, 'sine', 0.12, 0.08);
      tone(784, 0.15, 'sine', 0.12, 0.16);
      break;
    case 'bad':
      sweep(400, 80, 0.3, 'sawtooth', 0.12);
      noise(0.15, 0.04);
      break;
    case 'twist':
      sweep(200, 1200, 0.3, 'square', 0.1);
      tone(800, 0.1, 'sine', 0.08, 0.3);
      break;
    case 'combo':
      tone(659, 0.08, 'sine', 0.12);
      tone(784, 0.08, 'sine', 0.12, 0.06);
      tone(988, 0.08, 'sine', 0.12, 0.12);
      tone(1319, 0.2, 'sine', 0.12, 0.18);
      break;
    case 'gameover':
      sweep(400, 50, 1.2, 'sawtooth', 0.15);
      tone(200, 0.5, 'sine', 0.1, 0.3);
      tone(150, 0.8, 'sine', 0.1, 0.6);
      break;
  }
}
