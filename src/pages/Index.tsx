import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolCard from "@/components/ToolCard";
import ToolSearch from "@/components/ToolSearch";
import { tools } from "@/data/tools";
import { ShieldCheck, Zap, Download, Mail, FileCheck, Send, CreditCard } from "lucide-react";

const featuredTools = tools.slice(0, 6);

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      {/* Hero */}
      <section className="gradient-hero border-b border-border py-24 md:py-32">
        <div className="container text-center">
          <span className="mb-6 inline-block rounded-full border border-border bg-secondary/80 px-4 py-1.5 text-xs font-semibold text-secondary-foreground shadow-card">
            🚀 The #1 Shopify Tools Marketplace
          </span>
          <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Premium Shopify Tools for{" "}
            <span className="text-gradient">Serious Store Owners</span>
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Automate, optimize, and scale your Shopify store with powerful ready-to-use tools.
          </p>
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

      {/* Why ToolifyHQ */}
      <section className="border-b border-border py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">Why ToolifyHQ?</h2>
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

      {/* Featured Tools */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-foreground">Featured Tools</h2>
            <p className="text-muted-foreground">Top-rated tools loved by Shopify store owners</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          <div className="mt-12 text-center">
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
      <section className="gradient-primary border-y border-border py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-primary-foreground">Ready to Scale Your Shopify Store?</h2>
          <p className="mx-auto mb-8 max-w-md text-primary-foreground/80">
            Join thousands of store owners who trust ToolifyHQ for premium Shopify tools.
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
