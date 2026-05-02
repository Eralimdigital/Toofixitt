import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary/60 py-14 backdrop-blur-xl">
      <div className="container">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-lg font-bold text-gradient">ToolifyHQ</h3>
            <p className="text-sm text-muted-foreground">
              Premium Shopify tools for serious store owners. Automate, optimize, scale.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground">All Tools</Link>
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
            <p className="text-sm text-muted-foreground">Need help? Email us:</p>
            <a href="mailto:smithmove0@gmail.com" className="mt-1 inline-block text-sm font-semibold text-accent hover:underline">
              smithmove0@gmail.com
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
            {/* Visa */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-white shadow-sm">
              <span className="text-[10px] font-extrabold italic tracking-tight text-[#1A1F71]">VISA</span>
            </div>
            {/* Mastercard */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-white shadow-sm">
              <div className="flex">
                <div className="h-4 w-4 rounded-full bg-[#EB001B] opacity-90" />
                <div className="-ml-1.5 h-4 w-4 rounded-full bg-[#F79E1B] opacity-90" />
              </div>
            </div>
            {/* PayPal */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-white shadow-sm">
              <span className="text-[10px] font-bold text-[#003087]">Pay<span className="text-[#009CDE]">Pal</span></span>
            </div>
            {/* Apple Pay */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-white shadow-sm">
              <span className="text-[10px] font-semibold text-black"> Pay</span>
            </div>
            {/* Google Pay */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-white shadow-sm">
              <span className="text-[10px] font-semibold text-[#5F6368]">G Pay</span>
            </div>
            {/* Stripe */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-[#635BFF] shadow-sm">
              <span className="text-[10px] font-bold text-white">stripe</span>
            </div>
            {/* Discover */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-white shadow-sm">
              <span className="text-[8px] font-bold text-[#FF6600]">DISCOVER</span>
            </div>
            {/* Amex */}
            <div className="flex h-8 w-12 items-center justify-center rounded bg-[#006FCF] shadow-sm">
              <span className="text-[8px] font-bold text-white">AMEX</span>
            </div>
          </div>
          <p className="mb-2 text-xs text-muted-foreground">Secure payments accepted worldwide</p>
          © {new Date().getFullYear()} ToolifyHQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
