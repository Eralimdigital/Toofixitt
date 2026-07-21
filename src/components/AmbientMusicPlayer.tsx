import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

/**
 * AmbientMusicPlayer
 * Upbeat, happy pop-style groove synthesized in the browser.
 * Four-on-the-floor kick, off-beat hats, bouncy bass, bright chord stabs,
 * and a pentatonic lead sprinkle. Feel-good shopping vibe, no copyright risk.
 */
const AmbientMusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const stopRef = useRef<null | (() => void)>(null);

  const start = async () => {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.25, now + 0.8);

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 40;
    hp.connect(master);
    master.connect(ctx.destination);

    const delay = ctx.createDelay(0.5);
    delay.delayTime.value = 0.18;
    const fb = ctx.createGain();
    fb.gain.value = 0.18;
    const wet = ctx.createGain();
    wet.gain.value = 0.18;
    delay.connect(fb).connect(delay);
    delay.connect(wet).connect(hp);

    const bpm = 118;
    const beat = 60 / bpm;
    const step = beat / 2;

    type Chord = { root: number; notes: number[] };
    const C: Chord = { root: 130.81, notes: [261.63, 329.63, 392.0] };
    const G: Chord = { root: 98.0, notes: [246.94, 293.66, 392.0] };
    const Am: Chord = { root: 110.0, notes: [261.63, 329.63, 440.0] };
    const F: Chord = { root: 87.31, notes: [261.63, 349.23, 440.0] };
    const progression: Chord[] = [C, G, Am, F];

    const kick = (t: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(140, t);
      o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      o.connect(g).connect(hp);
      o.start(t);
      o.stop(t + 0.3);
    };

    const noiseBuf = (() => {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return buf;
    })();
    const hat = (t: number, open = false) => {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = "highpass";
      bp.frequency.value = 7000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(open ? 0.12 : 0.06, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.18 : 0.05));
      src.connect(bp).connect(g).connect(hp);
      src.start(t);
      src.stop(t + 0.2);
    };

    const bass = (t: number, freq: number, dur: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.28, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(hp);
      o.start(t);
      o.stop(t + dur + 0.05);
    };

    const stab = (t: number, notes: number[]) => {
      notes.forEach((f) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(f, t);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.09, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 2400;
        o.connect(lp).connect(g);
        g.connect(hp);
        g.connect(delay);
        o.start(t);
        o.stop(t + 0.4);
      });
    };

    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const lead = (t: number, f: number) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      o.connect(g);
      g.connect(hp);
      g.connect(delay);
      o.start(t);
      o.stop(t + 0.3);
    };

    let bar = 0;
    const barLen = beat * 4;
    const scheduleBar = (startT: number, chord: Chord, barIdx: number) => {
      for (let b = 0; b < 4; b++) kick(startT + b * beat);
      for (let s = 0; s < 8; s++) {
        if (s % 2 === 1) hat(startT + s * step, s === 7);
      }
      for (let s = 0; s < 8; s++) {
        const f = s % 2 === 0 ? chord.root : chord.root * 2;
        bass(startT + s * step, f, step * 0.9);
      }
      stab(startT + beat, chord.notes);
      stab(startT + 3 * beat, chord.notes);
      if (barIdx % 2 === 1) {
        for (let i = 0; i < 4; i++) {
          lead(startT + (1 + i * 0.5) * beat, scale[Math.floor(Math.random() * scale.length)]);
        }
      }
    };

    let nextBarTime = ctx.currentTime + 0.1;
    for (let i = 0; i < 2; i++) {
      scheduleBar(nextBarTime + i * barLen, progression[(bar + i) % progression.length], bar + i);
    }
    bar += 2;
    nextBarTime += 2 * barLen;

    const tick = window.setInterval(() => {
      const c = ctxRef.current;
      if (!c) return;
      while (nextBarTime < c.currentTime + 1.5) {
        scheduleBar(nextBarTime, progression[bar % progression.length], bar);
        nextBarTime += barLen;
        bar += 1;
      }
    }, 250);

    stopRef.current = () => {
      const c = ctxRef.current;
      if (!c) return;
      const t = c.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.linearRampToValueAtTime(0, t + 0.4);
      window.clearInterval(tick);
    };
  };

  const stop = () => {
    stopRef.current?.();
    stopRef.current = null;
  };

  const toggle = async () => {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      await start();
      setPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stop();
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return (
    <button
      onClick={toggle}
      aria-label={playing ? "Mute background music" : "Play background music"}
      title={playing ? "Mute music" : "Play happy shopping music"}
      className="fixed bottom-6 left-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-card/90 text-accent shadow-card backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:shadow-card-hover"
    >
      {playing ? (
        <>
          <Music className="h-5 w-5 animate-pulse" />
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
          </span>
        </>
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </button>
  );
};

export default AmbientMusicPlayer;