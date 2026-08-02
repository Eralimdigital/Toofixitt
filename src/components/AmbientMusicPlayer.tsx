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

    const lead = (t: number, f: number, dur = 0.25, vol = 0.09) => {
      const o = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o2.type = "sawtooth";
      o.frequency.setValueAtTime(f, t);
      o2.frequency.setValueAtTime(f * 1.005, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.02);
      g.gain.setValueAtTime(vol * 0.7, t + dur * 0.6);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 3200;
      o.connect(g);
      o2.connect(g);
      g.connect(lp);
      lp.connect(hp);
      g.connect(delay);
      o.start(t);
      o2.start(t);
      o.stop(t + dur + 0.05);
      o2.stop(t + dur + 0.05);
    };

    // Named notes for a singable hook (C major / A minor pentatonic-friendly).
    const N: Record<string, number> = {
      G3: 196.0, A3: 220.0, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.0,
    };

    // A real 4-bar melodic hook: [note, startStep(8ths), lengthSteps]
    type Step = [string, number, number];
    const hook: Step[][] = [
      // bar 1 over C
      [["E5", 0, 1], ["G5", 1, 1], ["E5", 2, 2], ["C5", 4, 2], ["D5", 6, 2]],
      // bar 2 over G
      [["D5", 0, 1], ["B4", 1, 1], ["D5", 2, 2], ["G5", 4, 3], ["F5", 7, 1]],
      // bar 3 over Am
      [["E5", 0, 2], ["C5", 2, 1], ["A4", 3, 1], ["C5", 4, 2], ["E5", 6, 2]],
      // bar 4 over F
      [["F5", 0, 1], ["E5", 1, 1], ["D5", 2, 2], ["C5", 4, 4]],
    ];

    // Counter-melody arpeggio that keeps the track moving between phrases.
    const arp = (t: number, notes: number[]) => {
      for (let i = 0; i < 8; i++) {
        const f = notes[i % notes.length] * (i >= 4 ? 2 : 1);
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, t + i * step);
        g.gain.setValueAtTime(0, t + i * step);
        g.gain.linearRampToValueAtTime(0.045, t + i * step + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * step + step * 0.9);
        o.connect(g);
        g.connect(hp);
        g.connect(delay);
        o.start(t + i * step);
        o.stop(t + i * step + step);
      }
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

      // 8-bar song form: bars 0-3 intro/arp, bars 4-7 melody hook, then repeat.
      const phrase = barIdx % 8;
      if (phrase < 4) {
        arp(startT, chord.notes);
        if (phrase === 3) {
          // pickup into the hook
          lead(startT + 3 * beat, N.G4, step * 0.9, 0.07);
          lead(startT + 3.5 * beat, N.B4, step * 0.9, 0.07);
        }
      } else {
        arp(startT, chord.notes);
        hook[phrase - 4].forEach(([name, s, len]) => {
          lead(startT + s * step, N[name], len * step * 0.95, 0.1);
        });
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