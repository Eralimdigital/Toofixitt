import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-secondary py-12">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold text-foreground">ToolifyHQ</h3>
            <p className="text-sm text-muted-foreground">
              Premium Shopify tools for serious store owners. Automate, optimize, and scale.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Quick Links</h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
              <Link to="/tools" className="text-sm text-muted-foreground hover:text-foreground">All Tools</Link>
            </div>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">Support</h4>
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at support@toolifyhq.com
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ToolifyHQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
