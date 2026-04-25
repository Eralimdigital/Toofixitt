import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Refund = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="mb-2 text-4xl font-extrabold text-gradient">Refund Policy</h1>
          <p className="mb-10 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 rounded-2xl border border-border bg-card/80 p-8 shadow-card backdrop-blur-md">
            <Section title="1. Digital Products">
              Because our tools are digital and delivered immediately after order confirmation, all sales are generally final.
            </Section>
            <Section title="2. When You May Request a Refund">
              We will issue a full refund if (a) the tool you purchased is materially different from what was described, or (b) the tool cannot be delivered for technical reasons on our side.
            </Section>
            <Section title="3. How to Request">
              Email <a className="text-accent hover:underline" href="mailto:smithmove0@gmail.com">smithmove0@gmail.com</a> within 7 days of purchase with your order details and the reason for the refund. We respond to every request personally.
            </Section>
            <Section title="4. Non-Refundable Cases">
              Refunds are not available once a tool has been successfully delivered, installed, or used on your store, or for change-of-mind requests.
            </Section>
            <Section title="5. Need Help First?">
              Most issues can be solved with a quick support session. Reach out before requesting a refund — we’ll do our best to make it work.
            </Section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h2 className="mb-2 text-lg font-bold">{title}</h2>
    <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
  </div>
);

export default Refund;