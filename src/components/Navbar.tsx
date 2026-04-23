import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/75 shadow-card backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="ToolifyHQ" width={160} height={40} className="h-9 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Home
          </Link>
          <Link to="/tools" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Tools
          </Link>
        </nav>
        <Link
          to="/tools"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-card transition-all hover:opacity-90"
        >
          Browse Tools
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
