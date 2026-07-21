import { useEffect, useState } from "react";
import { Settings2, Volume2, VolumeX, Megaphone, MicOff } from "lucide-react";
import { soundSettings } from "@/lib/sfx";

/**
 * Floating sound settings panel — lets shoppers toggle the click/confirm SFX
 * and the welcome voice on every page. Sits next to the ambient music button.
 */
const SoundSettings = () => {
  const [open, setOpen] = useState(false);
  const [sfx, setSfx] = useState(soundSettings.get("sfx"));
  const [voice, setVoice] = useState(soundSettings.get("voice"));

  useEffect(() => {
    return soundSettings.subscribe(() => {
      setSfx(soundSettings.get("sfx"));
      setVoice(soundSettings.get("voice"));
    });
  }, []);

  return (
    <div className="fixed bottom-6 left-24 z-40">
      {open && (
        <div className="absolute bottom-14 left-0 w-60 rounded-xl border border-accent/40 bg-card/95 p-3 shadow-card-hover backdrop-blur-md">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sound
          </p>
          <button
            type="button"
            onClick={() => soundSettings.set("sfx", !sfx)}
            className="mb-1 flex w-full items-center justify-between rounded-lg border border-border bg-secondary/70 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50"
          >
            <span className="flex items-center gap-2">
              {sfx ? (
                <Volume2 className="h-4 w-4 text-accent" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
              Action sounds
            </span>
            <span className={`text-xs font-bold ${sfx ? "text-accent" : "text-muted-foreground"}`}>
              {sfx ? "ON" : "OFF"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => soundSettings.set("voice", !voice)}
            className="flex w-full items-center justify-between rounded-lg border border-border bg-secondary/70 px-3 py-2 text-sm text-foreground transition-colors hover:border-accent/50"
          >
            <span className="flex items-center gap-2">
              {voice ? (
                <Megaphone className="h-4 w-4 text-accent" />
              ) : (
                <MicOff className="h-4 w-4 text-muted-foreground" />
              )}
              Welcome voice
            </span>
            <span className={`text-xs font-bold ${voice ? "text-accent" : "text-muted-foreground"}`}>
              {voice ? "ON" : "OFF"}
            </span>
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Sound settings"
        title="Sound settings"
        className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-card/90 text-accent shadow-card backdrop-blur-md transition-all hover:scale-105 hover:border-accent hover:shadow-card-hover"
      >
        <Settings2 className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SoundSettings;