import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import ToolFAQ from "@/components/ToolFAQ";
import DownloadToolDialog from "@/components/DownloadToolDialog";
import { tools } from "@/data/tools";
import type { ToolPackage } from "@/data/tools";
import { AlertTriangle, CheckCircle2, CreditCard, Download, Mail, ShieldCheck, ShoppingCart, Check, Sparkles } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const ToolDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = tools.find((t) => t.slug === slug);
  const [downloadOpen, setDownloadOpen] = useState(false);
  const { add, has } = useCart();
  const packages = tool?.packages;
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(
    packages ? (packages.find((p) => p.popular)?.id ?? packages[0].id) : null,
  );
  const selectedPkg: ToolPackage | undefined = packages?.find((p) => p.id === selectedPkgId);
  const cartSlug = tool ? (selectedPkg ? `${tool.slug}--${selectedPkg.id}` : tool.slug) : "";
  const displayName = tool ? (selectedPkg ? `${tool.name} — ${selectedPkg.name}` : tool.name) : "";
  const displayPrice = selectedPkg ? selectedPkg.price : tool?.price ?? "";
  const displayPriceValue = selectedPkg ? selectedPkg.priceValue : tool?.priceValue ?? 0;
  const inCart = tool ? has(cartSlug) : false;
  const packagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!packages) return;
    const t = window.setTimeout(() => {
      packagesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 250);
    return () => window.clearTimeout(t);
  }, [packages, slug]);

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

           <div className="mt-6 rounded-2xl border border-border bg-card/70 p-6 shadow-card backdrop-blur-sm">
            {/* Image */}
            <div className="mb-8 overflow-hidden rounded-xl border border-border bg-secondary shadow-card">
              <div className="aspect-[16/9] w-full">
                <img
                  src={`/images/tools/${tool.slug}.webp`}
                  alt={tool.name}
                  width={1280}
                  height={720}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                  sizes="(min-width: 768px) 768px, 100vw"
                  className="h-full w-full object-contain"
                />
              </div>
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

              {packages && (
                <div ref={packagesRef} className="mb-8 scroll-mt-24">
                  <h2 className="mb-1 text-xl font-extrabold text-foreground">Choose your package</h2>
                  <p className="mb-5 text-sm text-muted-foreground">
                     Choose the package that fits your store. One-time purchase, no subscription.
                  </p>
                  <div className="grid gap-4 md:grid-cols-3">
                    {packages.map((pkg) => {
                      const active = pkg.id === selectedPkgId;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => {
                            setSelectedPkgId(pkg.id);
                          }}
                          aria-pressed={active}
                          className={`relative flex h-full flex-col rounded-2xl border p-5 text-left shadow-card transition-all ${
                            active
                              ? "border-accent bg-accent/10 ring-2 ring-accent/40"
                              : "border-border bg-card/80 hover:-translate-y-0.5 hover:border-accent/60"
                          }`}
                        >
                          {pkg.popular && (
                            <span className="absolute -top-2.5 right-4 rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent-foreground">
                              Most popular
                            </span>
                          )}
                          <span
                            className={`mb-3 h-2.5 w-2.5 rounded-full ${
                              pkg.accent === "basic"
                                ? "bg-emerald-500"
                                : pkg.accent === "pro"
                                ? "bg-sky-500"
                                : "bg-primary"
                            }`}
                          />
                          <p className="text-base font-bold text-foreground">{pkg.name}</p>
                          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {pkg.tagline}
                          </p>
                          <p className="text-3xl font-extrabold text-accent">{pkg.price}</p>
                           <p className="mb-4 text-xs text-muted-foreground">One-time purchase</p>
                          <p className="mb-4 text-xs text-muted-foreground">{pkg.bestFor}</p>

                          <p className="mb-2 text-xs font-semibold text-foreground">What's included</p>
                          <ul className="mb-4 space-y-1.5">
                            {pkg.features.map((f) => (
                              <li key={f} className="flex gap-2 text-xs text-muted-foreground">
                                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>

                          <p className="mb-2 text-xs font-semibold text-foreground">Benefits</p>
                          <ul className="mb-5 space-y-1.5">
                            {pkg.benefits.map((b) => (
                              <li key={b} className="flex gap-2 text-xs text-muted-foreground">
                                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>

                          <span
                            className={`mt-auto block rounded-lg px-4 py-2.5 text-center text-sm font-semibold ${
                              active
                                ? "bg-accent text-accent-foreground"
                                : "border border-border bg-secondary text-secondary-foreground"
                            }`}
                          >
                            {active ? "Selected" : "Select package"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 rounded-xl border border-dashed border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">Recommended for: </span>
                    {tool.packagesRecommendedFor ??
                      "Shopify stores experiencing sold-out inventory issues due to catalog growth. These resource upgrades ensure your inventory system can properly support your product catalog, maintain accurate stock availability, and scale with your business as it continues to grow."}
                  </p>
                </div>
              )}

              <div className="mb-6 grid gap-4 rounded-xl border border-border bg-secondary/70 p-4 shadow-card backdrop-blur-sm">
                <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Order summary</p>
                    <p className="mt-1 font-bold text-foreground">{displayName}</p>
                  </div>
                  <div className="text-right text-3xl font-extrabold text-accent">{displayPrice}</div>
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
                href={`mailto:smithmove0@gmail.com?subject=${encodeURIComponent(`Purchase: ${displayName} (${displayPrice})`)}&body=${encodeURIComponent(`Hi, I'd like to purchase ${displayName} (${displayPrice}). Please send me the details.`)}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-8 py-3.5 text-center text-base font-semibold text-accent-foreground shadow-card transition-all hover:-translate-y-0.5 hover:opacity-90"
              >
                <Mail className="h-4 w-4" />
                Start Checkout
              </a>

              <button
                type="button"
                onClick={() => {
                  setDownloadOpen(true);
                }}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-accent/40 bg-card px-8 py-3.5 text-center text-base font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent/10"
              >
                <Download className="h-4 w-4 text-accent" />
                Download Tool
              </button>

              <button
                type="button"
                onClick={() => {
                  if (inCart) return;
                  add({ ...tool, slug: cartSlug, name: displayName, price: displayPrice, priceValue: displayPriceValue });
                  toast.success(`${displayName} added to cart`);
                }}
                disabled={inCart}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary/70 px-8 py-3.5 text-center text-base font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:bg-accent/10 disabled:cursor-default disabled:opacity-80 disabled:hover:translate-y-0"
              >
                {inCart ? (
                  <><Check className="h-4 w-4 text-accent" /> Added to cart</>
                ) : (
                  <><ShoppingCart className="h-4 w-4 text-accent" /> Add to cart</>
                )}
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
         toolSlug={cartSlug}
         toolName={displayName}
         toolPrice={displayPrice}
      />
    </div>
  );
};

export default ToolDetailPage;
