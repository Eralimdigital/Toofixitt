import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="mb-2 text-4xl font-extrabold text-gradient">Privacy Policy</h1>
          <p className="mb-10 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-8 rounded-2xl border border-border bg-card/80 p-8 shadow-card backdrop-blur-md">
            <Section title="1. Information We Collect">
              We collect information you provide when you contact us or place an order — typically your name, email, and the details of the tool or service you’re purchasing. We do not store credit card information; payments are confirmed via email.
            </Section>
            <Section title="2. How We Use Your Information">
              Your data is used solely to fulfill your order, deliver tools, provide setup support, and respond to inquiries. We never sell or rent your personal information to third parties.
            </Section>
            <Section title="3. Cookies & Analytics">
              We may use minimal analytics cookies to understand how visitors use our site so we can improve the experience. You can disable cookies in your browser at any time.
            </Section>
            <Section title="4. Data Storage & Security">
              Customer data is stored on secure, encrypted infrastructure. Access is restricted to authorized team members handling your order or support request.
            </Section>
            <Section title="5. Third-Party Services">
              We use trusted providers (email, hosting, analytics) that comply with industry standards. Each provider only receives the minimum information needed to operate.
            </Section>
            <Section title="6. Your Rights">
              You may request access, correction, or deletion of your personal data at any time. Just email <a className="text-accent hover:underline" href="mailto:smithmove0@gmail.com">smithmove0@gmail.com</a> and we’ll respond within 7 days.
            </Section>
            <Section title="7. Changes to This Policy">
              We may update this policy occasionally. The latest version will always be posted on this page with an updated date.
            </Section>
            <Section title="8. Contact">
              Questions? Email <a className="text-accent hover:underline" href="mailto:smithmove0@gmail.com">smithmove0@gmail.com</a>.
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

export default Privacy;