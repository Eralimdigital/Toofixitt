import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Tag, CornerDownLeft } from "lucide-react";
import { tools } from "@/data/tools";

interface ToolSearchProps {
  variant?: "hero" | "compact";
  placeholder?: string;
  autoFocus?: boolean;
  onClose?: () => void;
}

const ToolSearch = ({
  variant = "hero",
  placeholder = "Search 39+ premium Shopify tools...",
  autoFocus = false,
  onClose,
}: ToolSearchProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return tools
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    itemRefs.current[activeIdx]?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const goToTool = (slug: string) => {
    setOpen(false);
    setQuery("");
    onClose?.();
    navigate(`/tools/${slug}`);
  };

  const submitSearch = () => {
    if (results[activeIdx]) {
      goToTool(results[activeIdx].slug);
    } else if (query.trim()) {
      onClose?.();
      navigate(`/tools?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submitSearch();
    } else if (e.key === "Escape") {
      setOpen(false);
      onClose?.();
    }
  };

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={
          isHero
            ? "flex items-center gap-2 rounded-2xl border border-border bg-card/90 p-2 shadow-card-hover backdrop-blur-md"
            : "flex items-center gap-2 rounded-xl border border-border bg-card/90 p-1.5 shadow-card backdrop-blur-md"
        }
      >
        <Search
          className={
            isHero
              ? "ml-3 h-5 w-5 shrink-0 text-accent"
              : "ml-2 h-4 w-4 shrink-0 text-accent"
          }
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className={
            isHero
              ? "h-12 flex-1 bg-transparent px-2 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground"
              : "h-9 flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          }
        />
        <button
          onClick={submitSearch}
          className={
            isHero
              ? "flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90"
              : "flex items-center gap-1.5 rounded-lg gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90"
          }
        >
          Search
          <ArrowRight className={isHero ? "h-4 w-4" : "h-3 w-3"} />
        </button>
      </div>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-card/95 shadow-card-hover backdrop-blur-xl">
          {results.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto py-2" role="listbox">
              {results.map((tool, i) => (
                <li key={tool.id}>
                  <button
                    ref={(el) => (itemRefs.current[i] = el)}
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseEnter={() => setActiveIdx(i)}
                    onClick={() => goToTool(tool.slug)}
                    className={`flex w-full items-start gap-3 border-l-2 px-4 py-3 text-left transition-colors ${
                      i === activeIdx
                        ? "border-accent bg-accent/10"
                        : "border-transparent hover:bg-accent/5"
                    }`}
                  >
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-card">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {tool.name}
                        </p>
                        <span className="shrink-0 text-sm font-bold text-accent">
                          {tool.price}
                        </span>
                      </div>
                      <p className="line-clamp-1 text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                        <Tag className="h-2.5 w-2.5" />
                        {tool.category}
                      </span>
                    </div>
                    {i === activeIdx && (
                      <CornerDownLeft className="mt-2 h-4 w-4 shrink-0 text-accent" />
                    )}
                  </button>
                </li>
              ))}
              <li className="border-t border-border">
                <button
                  onClick={submitSearch}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/5"
                >
                  See all results for "{query}"
                  <ArrowRight className="h-3 w-3" />
                </button>
              </li>
              <li className="flex items-center justify-center gap-3 border-t border-border bg-secondary/40 px-4 py-2 text-[10px] font-medium text-muted-foreground">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-semibold">↑</kbd>
                  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-semibold">↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-semibold">Enter</kbd>
                  open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border bg-card px-1.5 py-0.5 font-semibold">Esc</kbd>
                  close
                </span>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No tools match <span className="font-semibold text-foreground">"{query}"</span>.
              <br />
              Try a different keyword or category.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolSearch;
