import { Link, useParams, Navigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import SEO from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import { collections, getCollection } from "@/data/collections";

const SITE_URL = "https://toofixitt.lovable.app";

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = slug ? getCollection(slug) : undefined;

  if (!collection) {
    if (!slug) return <Navigate to="/tools" replace />;
    return <NotFound />;
  }

  const others = collections.filter((c) => c.slug !== collection.slug && c.items.length > 1);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collection.name} — Toofixitt`,
    url: `${SITE_URL}/collections/${collection.slug}`,
    description: collection.description,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title={`${collection.name} Tools — Toofixitt`}
        description={`${collection.name} collection: ${collection.description} ${collection.items.length} premium tools for Shopify store owners.`}
        path={`/collections/${collection.slug}`}
        jsonLd={jsonLd}
      />
      <Navbar />
      <section className="py-12">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/tools" className="transition-colors hover:text-foreground">Tools</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-foreground">{collection.name}</span>
          </nav>

          {/* Collection header */}
          <header className="mb-10 rounded-2xl border border-border bg-card/70 px-6 py-10 text-center shadow-card backdrop-blur-sm">
            <h1 className="mb-3 text-4xl font-extrabold text-foreground">{collection.name} Tools</h1>
            <p className="mx-auto mb-4 max-w-xl text-lg text-muted-foreground">{collection.description}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {collection.items.length} {collection.items.length === 1 ? "tool" : "tools"} in this collection
            </p>
          </header>

          {/* Products */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collection.items.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>

          {/* Other collections */}
          {others.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-4 text-lg font-bold text-foreground">Browse other collections</h2>
              <div className="flex flex-wrap gap-2">
                {others.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/collections/${c.slug}`}
                    className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-foreground"
                  >
                    {c.name} ({c.items.length})
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CollectionPage;
