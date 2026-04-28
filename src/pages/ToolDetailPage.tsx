import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import ToolFAQ from "@/components/ToolFAQ";
import DownloadToolDialog from "@/components/DownloadToolDialog";
import { tools } from "@/data/tools";
import { AlertTriangle, CheckCircle2, CreditCard, Download, Mail, ShieldCheck, Sparkles } from "lucide-react";

const ToolDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find((t) => t.slug === slug);
  const [downloadOpen, setDownloadOpen] = useState(false);

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

           <div className="mt-6 grid gap-10 rounded-2xl border border-border bg-card/70 p-6 shadow-card backdrop-blur-sm md:grid-cols-2">
            {/* Image */}
            <div className="overflow-hidden rounded-xl border border-border bg-secondary shadow-card">
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
              <span className="mb-3 inline-block rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                {tool.category}
              </span>
              <h1 className="mb-3 text-3xl font-extrabold text-foreground">{tool.name}</h1>
              <p className="mb-6 text-muted-foreground">{tool.description}</p>

              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Benefits</h3>
                <ul className="space-y-2">
                  {tool.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 grid gap-4 rounded-xl border border-border bg-secondary/70 p-4 shadow-card backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order summary</p>
                    <p className="mt-1 font-bold text-foreground">{tool.name}</p>
                  </div>
                  <div className="text-right text-3xl font-extrabold text-accent">{tool.price}</div>
                </div>
                <div className="grid gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-accent" />
                    <span>Secure payment details are confirmed by email.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-accent" />
                    <span>Delivery and setup instructions included after confirmation.</span>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:smithmove0@gmail.com?subject=${encodeURIComponent(`Purchase: ${tool.name} (${tool.price})`)}&body=${encodeURIComponent(`Hi, I'd like to purchase ${tool.name} (${tool.price}). Please send me the details.`)}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-center text-base font-semibold text-accent-foreground shadow-card transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                <Mail className="h-4 w-4" />
                Start Checkout
              </a>

              <button
                type="button"
                onClick={() => setDownloadOpen(true)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-card px-8 py-3.5 text-center text-base font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent/10"
              >
                <Download className="h-4 w-4 text-accent" />
                Download Tool
              </button>

              <div className="mt-4 rounded-lg border border-accent/30 bg-card/80 p-4 shadow-card">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles className="h-4 w-4 text-accent" />
                  Confirmation preview
                </div>
                <p className="text-xs text-muted-foreground">
                  Once your order is confirmed, you’ll receive the tool files, setup notes, and support next steps in one premium delivery email.
                </p>
              </div>

              {/* Warning */}
              <div className="mt-6 flex gap-3 rounded-lg border border-accent/30 bg-accent-orange-light p-4">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                <p className="text-xs text-foreground">
                  This tool requires expert-level Shopify knowledge for proper implementation. Improper use may affect store performance.
                </p>
              </div>
            </div>
          </div>

          {/* Upsell */}
          <div className="mt-16 rounded-xl border border-border bg-secondary/80 p-8 text-center shadow-card">
            <h3 className="mb-2 text-xl font-bold text-foreground">Need help installing this tool?</h3>
            <p className="mb-4 text-muted-foreground">Get professional help from a certified Shopify expert.</p>
            <a
              href="mailto:smithmove0@gmail.com?subject=Shopify%20Expert%20Help&body=Hi%2C%20I%20need%20help%20installing%20a%20Shopify%20tool."
              className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90"
            >
              Hire a Shopify Expert
            </a>
          </div>

          {/* Reviews */}
          <ReviewSection toolSlug={tool.slug} />

          {/* FAQ */}
          <ToolFAQ tool={tool} />
        </div>
      </section>
      <Footer />
      <DownloadToolDialog
        open={downloadOpen}
        onOpenChange={setDownloadOpen}
        toolSlug={tool.slug}
        toolName={tool.name}
        toolPrice={tool.price}
      />
    </div>
  );
};

export default ToolDetailPage;
