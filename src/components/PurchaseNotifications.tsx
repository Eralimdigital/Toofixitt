import { useEffect, useState } from "react";
import { ShoppingBag, X, CheckCircle2 } from "lucide-react";
import { tools } from "@/data/tools";

const NAMES = [
  { name: "James W.", country: "us", flag: "🇺🇸" },
  { name: "Olivia M.", country: "gb", flag: "🇬🇧" },
  { name: "Adebayo O.", country: "ng", flag: "🇳🇬" },
  { name: "Sophie L.", country: "fr", flag: "🇫🇷" },
  { name: "Lucas K.", country: "de", flag: "🇩🇪" },
  { name: "Priya S.", country: "in", flag: "🇮🇳" },
  { name: "Mateo R.", country: "es", flag: "🇪🇸" },
  { name: "Chen W.", country: "cn", flag: "🇨🇳" },
  { name: "Yuki T.", country: "jp", flag: "🇯🇵" },
  { name: "Aaliyah B.", country: "ca", flag: "🇨🇦" },
  { name: "Liam H.", country: "au", flag: "🇦🇺" },
  { name: "Noah P.", country: "br", flag: "🇧🇷" },
  { name: "Emma G.", country: "nl", flag: "🇳🇱" },
  { name: "Hassan K.", country: "ae", flag: "🇦🇪" },
  { name: "Isabella F.", country: "it", flag: "🇮🇹" },
  { name: "Kwame A.", country: "gh", flag: "🇬🇭" },
  { name: "Mia J.", country: "se", flag: "🇸🇪" },
  { name: "Daniel V.", country: "mx", flag: "🇲🇽" },
];

const TIME_PHRASES = [
  "just now",
  "1 minute ago",
  "2 minutes ago",
  "4 minutes ago",
  "7 minutes ago",
  "12 minutes ago",
  "18 minutes ago",
  "25 minutes ago",
  "32 minutes ago",
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

type Notification = {
  id: number;
  buyer: string;
  flag: string;
  country: string;
  toolName: string;
  price: string;
  timeAgo: string;
};

const PurchaseNotifications = () => {
  const [current, setCurrent] = useState<Notification | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    let counter = 0;

    const buildNotification = (): Notification => {
      const person = pick(NAMES);
      const tool = pick(tools);
      counter += 1;
      return {
        id: counter,
        buyer: person.name,
        flag: person.flag,
        country: person.country,
        toolName: tool.name,
        price: tool.price,
        timeAgo: pick(TIME_PHRASES),
      };
    };

    const showNext = () => {
      setCurrent(buildNotification());
      setVisible(true);
      // hide after ~6s
      timeoutId = setTimeout(() => {
        setVisible(false);
        // schedule next after gap
        timeoutId = setTimeout(showNext, 8000 + Math.random() * 7000);
      }, 6000);
    };

    // first appears after small delay
    timeoutId = setTimeout(showNext, 5000);

    return () => clearTimeout(timeoutId);
  }, []);

  if (!current) return null;

  return (
    <div
      className={`pointer-events-none fixed bottom-5 left-5 z-40 max-w-[320px] transition-all duration-500 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-card/95 p-3 pr-8 shadow-card-hover backdrop-blur-md">
        <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl gradient-primary">
          <ShoppingBag className="h-5 w-5 text-white" />
          <img
            src={`https://flagcdn.com/w40/${current.country}.png`}
            alt=""
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-card object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <span className="truncate">{current.buyer}</span>
            <span aria-hidden="true">{current.flag}</span>
          </div>
          <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            purchased <span className="font-medium text-foreground">{current.toolName}</span>
          </div>
          <div className="mt-1 flex items-center justify-between gap-2 text-[11px]">
            <span className="font-bold text-accent">{current.price}</span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              {current.timeAgo}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="absolute right-2 top-2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseNotifications;