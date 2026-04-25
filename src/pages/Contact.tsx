import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Clock, MessageSquare } from "lucide-react";

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
              href="mailto:smithmove0@gmail.com?subject=ToolifyHQ%20Support%20Request"
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg gradient-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-card transition-all hover:-translate-y-0.5"
            >
              <Mail className="h-4 w-4" />
              Send us an email
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;