import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { tools } from "@/data/tools";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const ToolDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-foreground">Tool not found</h1>
            <Link to="/tools" className="text-primary hover:underline">Browse all tools</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="py-16">
        <div className="container max-w-4xl">
          <Link to="/tools" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            ← Back to Tools
          </Link>

          <div className="mt-6 grid gap-10 md:grid-cols-2">
            {/* Image */}
            <div className="overflow-hidden rounded-xl border border-border bg-secondary">
              <img
                src={`/images/tools/${tool.slug}.jpg`}
                alt={tool.name}
                width={500}
                height={350}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Info */}
            <div>
              <span className="mb-3 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {tool.category}
              </span>
              <h1 className="mb-3 text-3xl font-extrabold text-foreground">{tool.name}</h1>
              <p className="mb-6 text-muted-foreground">{tool.description}</p>

              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Benefits</h3>
                <ul className="space-y-2">
                  {tool.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 text-3xl font-extrabold text-primary">{tool.price}</div>

              <a
                href={`https://wa.me/qr/LUQWRX5MSJSWN1?text=${encodeURIComponent(`Hi, I'd like to purchase ${tool.name} (${tool.price})`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-accent px-8 py-3.5 text-center text-base font-semibold text-accent-foreground transition-all hover:opacity-90"
              >
                Buy via WhatsApp
              </a>

              {/* Warning */}
              <div className="mt-6 flex gap-3 rounded-lg border border-border bg-accent-orange-light p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-xs text-foreground">
                  This tool requires expert-level Shopify knowledge for proper implementation. Improper use may affect store performance.
                </p>
              </div>
            </div>
          </div>

          {/* Upsell */}
          <div className="mt-16 rounded-xl border border-border bg-secondary p-8 text-center">
            <h3 className="mb-2 text-xl font-bold text-foreground">Need help installing this tool?</h3>
            <p className="mb-4 text-muted-foreground">Get professional help from a certified Shopify expert.</p>
            <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90">
              Hire a Shopify Expert
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ToolDetailPage;
