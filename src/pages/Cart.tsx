import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import CheckoutCartDialog from "@/components/CheckoutCartDialog";

const Cart = () => {
  const { items, remove, clear, total } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <section className="py-16">
        <div className="container max-w-3xl">
          <h1 className="mb-2 flex items-center gap-3 text-3xl font-extrabold text-foreground">
            <ShoppingCart className="h-7 w-7 text-accent" /> Your Cart
          </h1>
          <p className="mb-8 text-sm text-muted-foreground">
            Review your selected tools and request them all in one go.
          </p>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
              <p className="mb-2 text-lg font-semibold text-foreground">Your cart is empty</p>
              <p className="mb-6 text-sm text-muted-foreground">Browse our catalog and add tools to purchase together.</p>
              <Link to="/tools" className="inline-block rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90">
                Browse Tools
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 rounded-2xl border border-border bg-card/70 p-4 shadow-card backdrop-blur-sm">
                {items.map((it) => (
                  <div key={it.slug} className="flex items-center gap-4 rounded-xl border border-border bg-secondary/60 p-3">
                    <img
                      src={`/images/tools/${it.slug}.jpg`}
                      alt={it.name}
                      width={72}
                      height={48}
                      loading="lazy"
                      className="h-14 w-20 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link to={`/tools/${it.slug}`} className="block truncate text-sm font-semibold text-foreground hover:text-accent">
                        {it.name}
                      </Link>
                      <p className="text-sm font-bold text-accent">{it.price}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(it.slug)}
                      aria-label={`Remove ${it.name}`}
                      className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-card/80 p-5 shadow-card sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Estimated total</p>
                  <p className="text-2xl font-extrabold text-accent">${total.toLocaleString()}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{items.length} tool{items.length > 1 ? "s" : ""} in cart</p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={clear}
                    className="rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:border-destructive/60 hover:text-destructive"
                  >
                    Clear cart
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-card transition-all hover:-translate-y-0.5 hover:opacity-90"
                  >
                    Checkout all <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      <Footer />
      <CheckoutCartDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} items={items} />
    </div>
  );
};

export default Cart;