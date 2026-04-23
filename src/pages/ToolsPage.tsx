import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/data/tools";
import { Search } from "lucide-react";

const ToolsPage = () => {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map((t) => t.category)));
    return ["All", ...cats.sort()];
  }, []);

  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = tools.filter((tool) => {
    const matchesCategory = active === "All" || tool.category === active;
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      tool.name.toLowerCase().includes(query) ||
      tool.description.toLowerCase().includes(query) ||
      tool.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
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
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search premium Shopify tools"
                className="h-12 w-full rounded-xl border border-border bg-secondary/80 pl-11 pr-4 text-sm font-medium text-foreground shadow-card outline-none transition-all placeholder:text-muted-foreground focus:border-accent/70 focus:ring-2 focus:ring-ring/30"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
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
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ToolsPage;
