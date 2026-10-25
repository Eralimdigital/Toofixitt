import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import ToolSearch from "@/components/ToolSearch";
import { tools } from "@/data/tools";
import { ShieldCheck, Zap, Download, Mail, Send, CreditCard, Sparkles, PartyPopper, Store, Globe2, Users } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AnniversaryCountdown from "@/components/AnniversaryCountdown";
import { anniversaryConfig, isAnniversaryActive } from "@/config/anniversary";
import SEO from "@/components/SEO";

const homeFaqs = [
  {
    q: "How do I pay for a tool?",
    a: "Click \"Start Checkout\" on any tool page — this opens an email to our team. We'll reply with the exact payment amount and method (PayPal, bank transfer, crypto, etc.). Simply complete the payment using the instructions we provide.",
  },
  {
    q: "What is a Transaction ID and where do I find it?",
    a: "A Transaction ID is a unique reference code generated when you make a payment. You'll find it in your PayPal receipt, bank transfer confirmation, or crypto wallet history. It usually looks like a long string of letters and numbers.",
  },
  {
    q: "How do I submit my Transaction ID after paying?",
    a: "Go back to the tool page and click \"Download Tool\". A form will appear where you enter your name, your technician's email address, and the Transaction ID from your payment receipt. Then hit \"Submit & Send to Technician\".",
  },
  {
    q: "How long does approval take?",
    a: "We manually verify every transaction for your safety. Most orders are approved within 1–2 hours during business hours. Once approved, the tool is automatically delivered to your technician's email.",
  },
  {
    q: "How is the tool delivered?",
    a: "After we approve your Transaction ID, a ZIP package containing a PDF guide, setup instructions, usage docs, and a unique license key is automatically sent to the technician email you provided.",
  },
  {
    q: "What if my Transaction ID is rejected?",
    a: "If we can't verify your payment, we'll contact you via email with next steps. Make sure to double-check the Transaction ID before submitting — typos are the most common issue.",
  },
  {
    q: "Can I get a refund?",
    a: "Please review our Refund Policy page for full details. In general, we handle refund requests on a case-by-case basis — reach out to smithmove0@gmail.com if you have any concerns.",
  },
];

const featuredTools = tools.slice(0, 6);

const Index = () => {
  const anniversary = isAnniversaryActive();
  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Best Premium Shopify Tools Marketplace | Toofixitt"
        description="Toofixitt is the best premium Shopify tools marketplace — 40+ curated SEO, AI, marketing & conversion tools trusted by 12,000+ stores in 60+ countries."
        path="/"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Toofixitt",
          url: "https://toofixitt.lovable.app/",
          description: "Best premium Shopify tools marketplace — 40+ curated SEO, AI, marketing and conversion tools for Shopify merchants.",
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            reviewCount: "1284",
          },
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden border-b border-border py-24 md:py-32">
        {anniversary && (
          <>
            <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          </>
        )}
        <div className="container text-center">
          {anniversary ? (
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent shadow-card">
              <PartyPopper className="h-3.5 w-3.5" />
              Celebrating 5 Years of Toofixitt — Limited-Time Offer
            </span>
          ) : (
            <span className="mb-6 inline-block rounded-full border border-border bg-secondary/80 px-4 py-1.5 text-xs font-semibold text-secondary-foreground shadow-card">
              🚀 The #1 Shopify Tools Marketplace
            </span>
          )}
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
            {anniversary ? (
              <>
                5 Years of Powering{" "}
                <span className="text-gradient">Shopify Store Owners</span>
              </>
            ) : (
              <>
                Premium Shopify Tools for{" "}
                <span className="text-gradient">Serious Store Owners</span>
              </>
            )}
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            {anniversary
              ? `Thank you for 5 incredible years! Use code ${anniversaryConfig.promoCode} for ${anniversaryConfig.discountLabel} any tool this week only.`
              : "Automate, optimize, and scale your Shopify store with powerful ready-to-use tools."}
          </p>
          {anniversary && (
            <>
              <AnniversaryCountdown endsAt={anniversaryConfig.endsAt} />
              <div className="mx-auto mb-8 inline-flex items-center gap-3 rounded-xl border border-accent/40 bg-card/80 px-5 py-3 shadow-card backdrop-blur-sm">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  Promo Code:{" "}
                  <span className="rounded-md bg-accent/15 px-2 py-0.5 font-mono text-accent">
                    {anniversaryConfig.promoCode}
                  </span>
                </span>
                <span className="hidden text-xs text-muted-foreground sm:inline">
                  Save {anniversaryConfig.discountLabel}
                </span>
              </div>
            </>
          )}
          <div className="mx-auto mb-8 max-w-2xl">
            <ToolSearch />
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/70">Popular:</span>
              {["SEO", "Email Marketing", "Google Ads", "TikTok", "Speed"].map((tag) => (
                <Link
                  key={tag}
                  to={`/tools?q=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-border bg-card/70 px-3 py-1 font-medium text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/tools"
              className="rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground shadow-card transition-all hover:opacity-90"
            >
              Browse Tools
            </Link>
            <Link
              to="/tools"
              className="rounded-lg border border-border bg-card/80 px-8 py-3.5 text-base font-semibold text-foreground shadow-card transition-all hover:bg-secondary"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* 5-Year Milestone Stats (anniversary campaign) */}
      {anniversary && (
        <section className="border-b border-border bg-background/40 py-16">
          <div className="container">
            <div className="mb-10 text-center">
              <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
                Our Journey
              </span>
              <h2 className="mb-3 text-3xl font-bold text-foreground">5 Years. Countless Stores Scaled.</h2>
              <p className="mx-auto max-w-lg text-muted-foreground">
                A huge thank you to every store owner who trusted us along the way.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: PartyPopper, value: "5", label: "Years Serving Shopify" },
                { icon: Zap, value: `${tools.length}+`, label: "Premium Tools Launched" },
                { icon: Store, value: "12,000+", label: "Stores Helped" },
                { icon: Globe2, value: "60+", label: "Countries Served" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-border bg-card/90 p-6 text-center shadow-card backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-accent/60"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <s.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div className="mb-1 text-3xl font-extrabold text-gradient">{s.value}</div>
                  <div className="text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {/* How It Works */}
      <section className="border-b border-border bg-background/40 py-20">
        <div className="container">
          <div className="mb-4 text-center">
            <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
              Simple 4-Step Process
            </span>
            <h2 className="mb-3 text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mx-auto max-w-lg text-muted-foreground">
              New here? No worries — getting your tool is quick and straightforward.
            </p>
          </div>

          <div className="relative mt-12 grid gap-6 md:grid-cols-4">
            {/* Connector line */}
            <div className="absolute left-0 right-0 top-10 hidden h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent md:block" />

            {[
              {
                step: "1",
                icon: Zap,
                title: "Browse & Choose",
                desc: "Explore our collection of premium Shopify tools. Pick the one that fits your store's needs.",
              },
              {
                step: "2",
                icon: Mail,
                title: "Start Checkout",
                desc: "Click \"Start Checkout\" on the tool page. This opens an email to us — we'll reply with payment details (amount, method).",
              },
              {
                step: "3",
                icon: CreditCard,
                title: "Pay & Get Txn ID",
                desc: "Complete payment using the method we provide (PayPal, bank transfer, crypto, etc.). Save your Transaction ID from the receipt.",
              },
              {
                step: "4",
                icon: Send,
                title: "Request Delivery",
                desc: "Back on the tool page, click \"Download Tool\", enter your name, technician email, and Transaction ID. We verify & deliver the tool!",
              },
            ].map((s) => (
              <div key={s.step} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-accent/30 bg-card shadow-card backdrop-blur-sm">
                  <s.icon className="h-8 w-8 text-accent" />
                  <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground shadow-md">
                    {s.step}
                  </span>
                </div>
                <h3 className="mb-2 text-base font-bold text-foreground">{s.title}</h3>
                <p className="max-w-[220px] text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Every purchase is manually verified for your safety. Tools are delivered within <strong className="text-foreground">1–2 hours</strong> after approval.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Why Toofixitt */}
      <section className="border-b border-border py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Why Toofixitt?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { icon: Zap, title: "Instant Download", desc: "Get your tools immediately after purchase. No waiting." },
              { icon: ShieldCheck, title: "Expert-Grade Quality", desc: "Every tool is built for professional Shopify store owners." },
              { icon: Download, title: "Easy Integration", desc: "Simple setup guides included with every tool purchase." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card/90 p-8 text-center shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card-hover">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <f.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shopify-style Collections */}
      {showcaseCollections.map((col, index) => (
        <section
          key={col.slug}
          className={`border-b border-border py-16 ${index % 2 === 1 ? "bg-background/40" : ""}`}
        >
          <div className="container">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="mb-2 inline-block rounded-full border border-border bg-secondary/80 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {col.items.length} {col.items.length === 1 ? "Tool" : "Tools"}
                </span>
                <h2 className="text-3xl font-bold text-foreground">{col.name} Tools</h2>
                <p className="mt-1 max-w-xl text-sm text-muted-foreground">{col.description}</p>
              </div>
              <Link
                to={`/collections/${col.slug}`}
                className="rounded-lg border border-accent/50 bg-accent/10 px-6 py-2.5 text-sm font-semibold text-accent shadow-card transition-all hover:-translate-y-0.5 hover:bg-accent/20"
              >
                View All {col.name} Tools →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {col.items.slice(0, 3).map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* All collections */}
      <section className="border-b border-border py-16">
        <div className="container">
          <div className="mb-8 text-center">
            <h2 className="mb-2 text-3xl font-bold text-foreground">Shop All Collections</h2>
            <p className="text-muted-foreground">Pick a category and see every tool inside it</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {collections.map((c) => (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                className="rounded-xl border border-border bg-card/80 px-5 py-3 text-sm font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent"
              >
                {c.name} <span className="text-muted-foreground">({c.items.length})</span>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              to="/tools"
              className="rounded-lg bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90"
            >
              View All Tools
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      {/* FAQ */}
      <section className="border-b border-border bg-background/40 py-20">
        <div className="container max-w-3xl">
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
              Got Questions?
            </span>
            <h2 className="mb-3 text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about purchasing and receiving your tools.
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-3">
            {homeFaqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border border-border bg-card/80 px-5 shadow-card backdrop-blur-sm"
              >
                <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary border-y border-border py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">Ready to Scale Your Shopify Store?</h2>
          <p className="mx-auto mb-8 max-w-md text-primary-foreground/80">
            Join thousands of store owners who trust Toofixitt for premium Shopify tools.
          </p>
          <Link
            to="/tools"
            className="inline-block rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-accent-foreground transition-all hover:opacity-90"
          >
            Browse Tools Now
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
