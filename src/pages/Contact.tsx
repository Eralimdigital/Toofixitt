import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Mail, Clock, MessageSquare, Building2, Globe } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="gradient-hero border-b border-border py-20">
        <div className="container max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            <span className="text-gradient">Contact Support</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            We answer every email personally. Most replies go out within a few hours.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container max-w-3xl">
          <div className="rounded-2xl border border-border bg-card/85 p-10 shadow-card backdrop-blur-md">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-card">
                <Mail className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Email us directly</h2>
              <a
                href="mailto:smithmove0@gmail.com"
                className="text-2xl font-extrabold text-gradient hover:underline"
              >
                smithmove0@gmail.com
              </a>
              <p className="mt-3 max-w-md text-sm text-muted-foreground">
                For purchases, support, refunds, custom builds, or partnership requests — write to us and a team member will get back to you.
              </p>
            </div>

            <div className="grid gap-4 border-t border-border pt-8 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-secondary/60 p-5 shadow-card">
                <Clock className="mb-2 h-5 w-5 text-accent" />
                <h3 className="mb-1 font-semibold">Response time</h3>
                <p className="text-sm text-muted-foreground">Usually within 2–6 hours, 7 days a week.</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/60 p-5 shadow-card">
                <MessageSquare className="mb-2 h-5 w-5 text-accent" />
                <h3 className="mb-1 font-semibold">What to include</h3>
                <p className="text-sm text-muted-foreground">Tool name, your store URL, and a clear description of your question.</p>
              </div>
            </div>

            <a
              href="mailto:smithmove0@gmail.com?subject=Toofixitt%20Support%20Request"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-card transition-all hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              Send us an email
            </a>
          </div>

          <div id="business-details" className="mt-8 rounded-2xl border border-border bg-card/85 p-8 shadow-card backdrop-blur-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-card">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Business details</h2>
                <p className="text-sm text-muted-foreground">Verify who you are dealing with before you pay.</p>
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
                  <Mail className="h-3.5 w-3.5 text-accent" /> Official support email
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
                  Fully online. We deliver and support by email and do not operate a walk-in address.
                </dd>
              </div>
            </dl>
            <p className="mt-6 border-t border-border pt-5 text-xs text-muted-foreground">
              Beware of clones: only this site and the support email above are official. Read our{" "}
              <Link to="/refund" className="text-accent hover:underline">Refund Policy</Link> and{" "}
              <Link to="/terms" className="text-accent hover:underline">Terms</Link> before purchasing.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;