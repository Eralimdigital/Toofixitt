import { useEffect, useState } from "react";

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number; done: boolean };

const getTimeLeft = (target: Date): TimeLeft => {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
};

const pad = (n: number) => n.toString().padStart(2, "0");

const AnniversaryCountdown = ({ endsAt }: { endsAt: Date }) => {
  const [t, setT] = useState<TimeLeft>(() => getTimeLeft(endsAt));

  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (t.done) return null;

  const units: [string, number][] = [
    ["Days", t.days],
    ["Hours", t.hours],
    ["Minutes", t.minutes],
    ["Seconds", t.seconds],
  ];

  return (
    <div className="mx-auto mb-8 max-w-md">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Offer ends in
      </p>
      <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-live="polite">
        {units.map(([label, val]) => (
          <div
            key={label}
            className="rounded-xl border border-accent/30 bg-card/80 px-2 py-3 shadow-card backdrop-blur-sm"
          >
            <div className="text-2xl font-extrabold tabular-nums text-gradient sm:text-3xl">
              {pad(val)}
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-xs">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnniversaryCountdown;