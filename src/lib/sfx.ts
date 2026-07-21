// Lightweight Web Audio SFX + shopper voice/sfx settings.
// No external assets, no network calls. Safe to import anywhere.

type Setting = "sfx" | "voice";
type Listener = () => void;

const STORAGE = {
  sfx: "toofix.sfxEnabled",
  voice: "toofix.voiceEnabled",
};

const readBool = (key: string, fallback: boolean) => {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  if (v === null) return fallback;
  return v === "1";
};

const state = {
  sfx: readBool(STORAGE.sfx, true),
  voice: readBool(STORAGE.voice, true),
};

const listeners = new Set<Listener>();
const notify = () => listeners.forEach((l) => l());

export const soundSettings = {
  get: (k: Setting) => state[k],
  set: (k: Setting, v: boolean) => {
    state[k] = v;
    try {
      window.localStorage.setItem(STORAGE[k], v ? "1" : "0");
    } catch {
      /* noop */
    }
    notify();
  },
  subscribe: (l: Listener) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

// --- Web Audio SFX ---

let ctx: AudioContext | null = null;
const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
};

const beep = (
  freqs: number[],
  {
    duration = 0.12,
    type = "square" as OscillatorType,
    volume = 0.08,
    stagger = 0.06,
    slideTo,
  }: {
    duration?: number;
    type?: OscillatorType;
    volume?: number;
    stagger?: number;
    slideTo?: number;
  } = {}
) => {
  if (!state.sfx) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime;

  const bus = c.createGain();
  bus.gain.value = 1;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 4200;
  bus.connect(lp).connect(c.destination);

  freqs.forEach((f, i) => {
    const t = t0 + i * stagger;
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + duration + 0.02);
  });
};

/** Cheerful "added to cart" pop — two rising blips. */
export const playAddToCart = () =>
  beep([660, 990], { type: "triangle", duration: 0.14, volume: 0.09, stagger: 0.07 });

/** Robotic "confirm/success" — three ascending square blips. */
export const playConfirm = () =>
  beep([784, 988, 1319], { type: "square", duration: 0.12, volume: 0.07, stagger: 0.07 });

/** Soft click for minor interactions. */
export const playClick = () =>
  beep([1200], { type: "sine", duration: 0.06, volume: 0.05, slideTo: 700 });