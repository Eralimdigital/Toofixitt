import { useEffect, useRef, useState } from "react";
import { Music, VolumeX } from "lucide-react";

/**
 * AmbientMusicPlayer
 * A floating toggle that plays a chill, robotic-cinematic ambient pad
 * generated with the Web Audio API. No external audio file required.
 *
 * Browsers block autoplay until a user gesture — so the button starts as
 * "off" and the first click both unlocks audio and starts the loop.
 */
const AmbientMusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ stop: () => void } | null>(null);

  const start = async () => {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = ctxRef.current ?? new AC();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") await ctx.resume();

    const now = ctx.currentTime;

    // Master chain: gentle low-pass + reverb-ish delay + master gain
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.18, now + 2.5); // slow fade-in

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1800;
    lowpass.Q.value = 0.7;

    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.35;
    const wet = ctx.createGain();
    wet.gain.value = 0.28;
    delay.connect(feedback).connect(delay);
    delay.connect(wet).connect(master);

    lowpass.connect(master);
    lowpass.connect(delay);
    master.connect(ctx.destination);

    // Cinematic pad chord (A minor 9-ish for that cool robotic feel)
    const chord = [110, 164.81, 220, 261.63, 329.63]; // A2, E3, A3, C4, E4
    const oscs: OscillatorNode[] = [];
    const gains: GainNode[] = [];

    chord.forEach((freq, i) => {
      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.type = "sawtooth";
      o2.type = "sine";
      o1.frequency.value = freq;
      o2.frequency.value = freq * 1.005; // slight detune → shimmer

      const g = ctx.createGain();
      g.gain.value = 0.06 / (i * 0.4 + 1);

      // Slow LFO on gain for breathing motion
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + i * 0.02;
      lfoGain.gain.value = 0.025;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start(now);

      o1.connect(g);
      o2.connect(g);
      g.connect(lowpass);
      o1.start(now);
      o2.start(now);

      oscs.push(o1, o2, lfo);
      gains.push(g);
    });

    // Occasional robotic "blip" arpeggio for cinematic sparkle
    const blipInterval = window.setInterval(() => {
      if (!ctxRef.current) return;
      const t = ctxRef.current.currentTime;
      const notes = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5
      const f = notes[Math.floor(Math.random() * notes.length)];
      const o = ctxRef.current.createOscillator();
      const g = ctxRef.current.createGain();
      o.type = "triangle";
      o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.05, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
      o.connect(g).connect(lowpass);
      o.start(t);
      o.stop(t + 1.3);
    }, 3800);

    nodesRef.current = {
      stop: () => {
        const c = ctxRef.current;
        if (!c) return;
        const t = c.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(0, t + 0.6);
        window.clearInterval(blipInterval);
        oscs.forEach((o) => {
          try {
            o.stop(t + 0.7);
          } catch {
            /* noop */
          }
        });
      },
    };
  };

  const stop = () => {
    nodesRef.current?.stop();
    nodesRef.current = null;
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
      title={playing ? "Mute music" : "Play chill cinematic music"}
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