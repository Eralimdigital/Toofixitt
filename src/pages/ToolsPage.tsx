import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import { tools } from "@/data/tools";

const ToolsPage = () => {
  const categories = useMemo(() => {
    const cats = Array.from(new Set(tools.map((t) => t.category)));
    return ["All", ...cats.sort()];
  }, []);

  const [active, setActive] = useState("All");

  const filtered = active === "All" ? tools : tools.filter((t) => t.category === active);

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

          {/* Category Filter */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active === cat
                    ? "bg-accent text-accent-foreground shadow-card"
                    : "border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
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
