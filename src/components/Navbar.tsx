import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
import ToolSearch from "@/components/ToolSearch";
import { useCart } from "@/contexts/CartContext";
import { collections } from "@/data/collections";

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const { count } = useCart();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/75 shadow-card backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Toofixitt" width={160} height={40} className="h-9 w-auto" />
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus:outline-none">
                  Collections
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="max-h-[420px] w-60 overflow-y-auto">
                <DropdownMenuItem asChild>
                  <Link to="/tools" className="font-semibold">All Tools</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-muted-foreground">Shop by collection</DropdownMenuLabel>
                {collections.map((c) => (
                  <DropdownMenuItem key={c.slug} asChild>
                    <Link to={`/collections/${c.slug}`} className="flex justify-between">
                      <span>{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.items.length}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Blog
            </Link>
            <Link to="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search tools"
              className="hidden items-center gap-2 rounded-lg border border-border bg-card/80 px-3 py-2 text-xs font-medium text-muted-foreground shadow-card transition-all hover:border-accent/60 hover:text-foreground sm:flex"
            >
              <Search className="h-3.5 w-3.5 text-accent" />
              <span>Search tools</span>
              <kbd className="ml-2 rounded border border-border bg-secondary/80 px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search tools"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/80 text-accent shadow-card transition-all hover:border-accent/60 sm:hidden"
            >
              <Search className="h-4 w-4" />
            </button>
            <Link
              to="/cart"
              aria-label={`Cart (${count} item${count === 1 ? "" : "s"})`}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/80 text-accent shadow-card transition-all hover:border-accent/60"
            >
              <ShoppingCart className="h-4 w-4" />
              {count > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground shadow-card">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to="/tools"
              className="hidden rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:-translate-y-0.5 hover:opacity-95 sm:inline-block"
            >
              Browse Tools
            </Link>
          </div>
        </div>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-background/70 px-4 pt-20 backdrop-blur-md"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ToolSearch
              autoFocus
              placeholder="Search any Shopify tool..."
              onClose={() => setSearchOpen(false)}
            />
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Press <kbd className="rounded border border-border bg-card/80 px-1.5 py-0.5 font-semibold">Esc</kbd> to close
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
