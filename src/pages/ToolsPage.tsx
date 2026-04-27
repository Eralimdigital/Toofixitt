import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/data/tools";
import { Search, X } from "lucide-react";

const ToolsPage = () => {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map((t) => t.category)));
    return ["All", ...cats.sort()];
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [active, setActive] = useState(
    initialCategory && categories.includes(initialCategory) ? initialCategory : "All",
  );
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [maxPrice, setMaxPrice] = useState<number | null>(() => {
    const raw = searchParams.get("maxPrice");
    const n = raw ? Number(raw) : NaN;
    return Number.isFinite(n) && n > 0 ? n : null;
  });

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setSearch(q);
    const cat = searchParams.get("category");
    if (cat && categories.includes(cat)) setActive(cat);
    else if (!cat) setActive("All");
    const rawMax = searchParams.get("maxPrice");
    const n = rawMax ? Number(rawMax) : NaN;
    setMaxPrice(Number.isFinite(n) && n > 0 ? n : null);
  }, [searchParams, categories]);

  const updateParams = (updates: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateParams({ q: value.trim() || null });
  };

  const handleCategoryChange = (cat: string) => {
    setActive(cat);
    updateParams({ category: cat === "All" ? null : cat });
  };

  const clearMaxPrice = () => {
    setMaxPrice(null);
    updateParams({ maxPrice: null });
  };

  const filtered = tools.filter((tool) => {
    const matchesCategory = active === "All" || tool.category === active;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query);
    const matchesPrice = maxPrice === null || tool.priceValue <= maxPrice;

    return matchesCategory && matchesSearch && matchesPrice;
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="py-16">
        <div className="container">
          <div className="mb-12 rounded-2xl border border-border bg-card/70 px-6 py-12 text-center shadow-card backdrop-blur-sm">
            <h1 className="mb-3 text-4xl font-extrabold text-foreground">All Shopify Tools</h1>
            <p className="text-lg text-muted-foreground">
              Browse our complete collection of premium Shopify tools
            </p>
          </div>

          {/* Search and Category Filter */}
          <div className="mb-10 rounded-2xl border border-border bg-card/80 p-4 shadow-card backdrop-blur-sm md:p-5">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" />
              <input
                type="search"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Search premium Shopify tools"
                className="h-12 w-full rounded-xl border border-border bg-secondary/80 pl-11 pr-4 text-sm font-medium text-foreground shadow-card outline-none transition-all placeholder:text-muted-foreground focus:border-accent/70 focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-card transition-all hover:-translate-y-0.5 ${
                    active === cat
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border bg-secondary/80 text-secondary-foreground hover:border-primary/70 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {maxPrice !== null && (
              <div className="mt-4 flex items-center justify-center">
                <button
                  type="button"
                  onClick={clearMaxPrice}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  Max price: ${maxPrice}
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length > 0 ? (
              filtered.map((tool) => <ToolCard key={tool.id} tool={tool} />)
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
                <p className="text-lg font-semibold text-foreground">No tools found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term or category.
                </p>
                <button
                  onClick={() => {
                    handleSearchChange("");
                    handleCategoryChange("All");
                    clearMaxPrice();
                  }}
                  className="mt-4 rounded-lg gradient-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>

          {filtered.length > 0 && (
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Showing {filtered.length} of {tools.length} tools
            </p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ToolsPage;
