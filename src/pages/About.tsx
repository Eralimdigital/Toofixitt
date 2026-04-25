import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Sparkles, Target, Users, ShieldCheck } from "lucide-react";

const About = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="gradient-hero border-b border-border py-20">
        <div className="container max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full border border-accent/40 bg-secondary/70 px-4 py-1.5 text-xs font-semibold text-accent shadow-card backdrop-blur-md">
            About ToolifyHQ
          </span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Built for store owners who want to <span className="text-gradient">scale faster</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            ToolifyHQ is a premium marketplace of battle-tested Shopify tools, plugins, and growth assets — handpicked to help serious merchants automate, optimize, and scale.
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

          <div className="mt-14 rounded-2xl border border-border gradient-primary p-10 text-center shadow-card">
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