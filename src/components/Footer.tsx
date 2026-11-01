import { Link } from "react-router-dom";
import {
  siVisa,
  siMastercard,
  siPaypal,
  siApplepay,
  siGooglepay,
  siStripe,
  siDiscover,
  siAmericanexpress,
} from "simple-icons";

const paymentIcons = [
  { si: siVisa, hex: siVisa.hex, label: "Visa" },
  { si: siMastercard, hex: siMastercard.hex, label: "Mastercard" },
  { si: siPaypal, hex: siPaypal.hex, label: "PayPal" },
  { si: siApplepay, hex: siApplepay.hex, label: "Apple Pay" },
  { si: siGooglepay, hex: siGooglepay.hex, label: "Google Pay" },
  { si: siStripe, hex: "#FFFFFF", label: "Stripe" },
  { si: siDiscover, hex: siDiscover.hex, label: "Discover" },
  { si: siAmericanexpress, hex: "#FFFFFF", label: "American Express" },
];

const PaymentBadges = () => (
  <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
    {paymentIcons.map(({ si, hex, label }) => (
      <div
        key={label}
        title={label}
        aria-label={label}
        className="flex h-8 w-12 items-center justify-center rounded bg-white shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill={hex} role="img" aria-hidden="true">
          <path d={si.path} />
        </svg>
      </div>
    ))}
  </div>
);

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/60 py-14 backdrop-blur-xl">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-gradient">Toofixitt</h3>
            <p className="text-sm text-muted-foreground">
              Premium Shopify tools for serious store owners. Automate, optimize, scale.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground">All Tools</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">About Us</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
              <Link to="/refund" className="text-sm text-muted-foreground hover:text-foreground">Refund Policy</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
            <p className="text-sm text-muted-foreground">Toofixitt — independent, owner-operated online store.</p>
            <p className="mt-2 text-sm text-muted-foreground">Need help? Email us:</p>
            <a href="mailto:smithmove0@gmail.com" className="mt-1 inline-block text-sm font-semibold text-accent hover:underline">
              smithmove0@gmail.com
            </a>
            <Link to="/contact#business-details" className="mt-2 block text-sm text-muted-foreground hover:text-foreground">
              Business details
            </Link>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <PaymentBadges />
          <p className="mb-2 text-xs text-muted-foreground">Secure payments accepted worldwide</p>
          © {new Date().getFullYear()} Toofixitt. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
