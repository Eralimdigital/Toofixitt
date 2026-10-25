import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Sparkles, Target, Users, ShieldCheck, Building2, Mail, Globe } from "lucide-react";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="gradient-hero border-b border-border py-20">
        <div className="container max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-accent/40 bg-secondary/70 px-4 py-1.5 text-xs font-semibold text-accent shadow-card backdrop-blur-md">
            About Toofixitt
          </span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Built for store owners who want to <span className="text-gradient">scale faster</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Toofixitt is a premium marketplace of battle-tested Shopify tools, plugins, and growth assets — handpicked to help serious merchants automate, optimize, and scale.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: Target, title: "Our Mission", desc: "Give every Shopify owner access to expert-grade tools that used to be locked behind agencies and 5-figure retainers." },
              { icon: Sparkles, title: "What We Sell", desc: "Premium SEO, marketing, conversion, AI, and analytics tools — each one curated, tested, and ready to deploy." },
              { icon: Users, title: "Who We Serve", desc: "From new dropshippers to 7-figure brands, our customers are operators who care about ROI, speed, and quality." },
              { icon: ShieldCheck, title: "Our Promise", desc: "Every order is delivered with setup notes and personal email support so you actually get results, not just files." },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-border bg-card/80 p-7 shadow-card backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/60 hover:shadow-card-hover">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-card">
                  <b.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            ))}
          </div>

          <div id="business-details" className="mt-14 rounded-2xl border border-border bg-card/85 p-8 shadow-card backdrop-blur-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-card">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Business details</h2>
                <p className="text-sm text-muted-foreground">Who you are buying from, in plain terms.</p>
              </div>
            </div>
            <dl className="grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trading name</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">Toofixitt</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Business type</dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  Independent, owner-operated digital tools store. Not yet incorporated as a registered company.
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 text-accent" /> Support email
                </dt>
                <dd className="mt-1 text-sm font-medium">
                  <a href="mailto:smithmove0@gmail.com" className="text-accent hover:underline">smithmove0@gmail.com</a>
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <Globe className="h-3.5 w-3.5 text-accent" /> Operating model
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  Fully online. Orders, delivery and support are handled by email — we do not operate a walk-in address.
                </dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
              Only Toofixitt.com content and orders confirmed from the support email above are official. If you were sent a
              lookalike store or a different payment address, contact us before paying. Refund terms are published on our{" "}
              <Link to="/refund" className="text-accent hover:underline">Refund Policy</Link> page.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-border gradient-primary p-10 text-center shadow-card">
            <h2 className="mb-3 text-2xl font-bold text-primary-foreground">Questions before you buy?</h2>
            <p className="mb-6 text-primary-foreground/85">Email us anytime — real humans, fast replies.</p>
            <Link to="/contact" className="inline-block rounded-lg bg-background px-7 py-3 text-sm font-semibold text-foreground shadow-card transition-all hover:-translate-y-0.5">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default About;