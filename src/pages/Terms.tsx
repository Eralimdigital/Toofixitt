import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="mb-2 text-4xl font-extrabold text-gradient">Terms of Service</h1>
          <p className="mb-10 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 rounded-2xl border border-border bg-card/80 p-8 shadow-card backdrop-blur-md">
            <Section title="1. Acceptance of Terms">
              By accessing or purchasing from Toofixitt, you agree to these Terms of Service. If you do not agree, please do not use the site.
            </Section>
            <Section title="2. Products & Services">
              Toofixitt sells digital Shopify tools, plugins, and related services. All products are delivered via email after order confirmation.
            </Section>
            <Section title="3. Payments">
              Orders are placed by email and payment is confirmed before delivery. Prices are listed in USD. We reserve the right to update pricing at any time.
            </Section>
            <Section title="4. License & Use">
              When you purchase a tool, you receive a non-exclusive license to use it on the store(s) discussed at the time of order. Reselling, redistributing, or reverse-engineering our tools is strictly prohibited.
            </Section>
            <Section title="5. Support">
              Each purchase includes setup notes and direct email support via <a className="text-accent hover:underline" href="mailto:smithmove0@gmail.com">smithmove0@gmail.com</a>.
            </Section>
            <Section title="6. Liability">
              Toofixitt provides tools "as is" and is not liable for any indirect or consequential damages arising from improper use. Some tools require expert-level Shopify knowledge for safe implementation.
            </Section>
            <Section title="7. Account & Conduct">
              You agree not to misuse the site, attempt unauthorized access, or use our tools to violate any applicable laws.
            </Section>
            <Section title="8. Changes">
              We may update these Terms from time to time. Continued use of the site after updates constitutes acceptance of the new Terms.
            </Section>
            <Section title="9. Contact">
              For questions about these Terms, email <a className="text-accent hover:underline" href="mailto:smithmove0@gmail.com">smithmove0@gmail.com</a>.
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

export default Terms;