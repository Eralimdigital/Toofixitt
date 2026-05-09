import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Trash2, ShoppingCart, Mail, PackageCheck } from "lucide-react";
import CheckoutCartDialog from "@/components/CheckoutCartDialog";

const Cart = () => {
  const { items, remove, clear, total } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentRequested, setPaymentRequested] = useState(false);

  const SUPPORT_EMAIL = "smithmove0@gmail.com";

  const buildMailto = () => {
    const subject = `Payment request for ${items.length} tool${items.length > 1 ? "s" : ""} ($${total.toLocaleString()})`;
    const lines = [
      "Hi ToolifyHQ team,",
      "",
      "I'd like to purchase the following tools and need the payment details:",
      "",
      ...items.map((it, i) => `${i + 1}. ${it.name} — ${it.price}`),
      "",
      `Estimated total: $${total.toLocaleString()}`,
      "",
      "Please send me the payment instructions. Once paid, I'll come back to the website to request delivery.",
      "",
      "Thanks!",
    ];
    return `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  const handleRequestPayment = () => {
    window.location.href = buildMailto();
    setPaymentRequested(true);
  };

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
                  <a
                    href={buildMailto()}
                    onClick={() => setPaymentRequested(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:-translate-y-0.5 hover:opacity-90"
                  >
                    <Mail className="h-4 w-4" /> Checkout (email us for payment)
                  </a>
                  <button
                    type="button"
                    onClick={() => setCheckoutOpen(true)}
                    disabled={!paymentRequested}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-card transition-all hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PackageCheck className="h-4 w-4" /> I've paid — Request delivery
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-dashed border-border bg-secondary/40 p-4 text-xs text-muted-foreground">
                <p className="mb-1 font-semibold text-foreground">How checkout works</p>
                <ol className="ml-4 list-decimal space-y-1">
                  <li>Click <span className="font-semibold text-foreground">Checkout</span> to email us — we'll reply with secure payment details for all tools in your cart.</li>
                  <li>Complete the payment using the instructions we send.</li>
                  <li>Come back here and click <span className="font-semibold text-foreground">I've paid — Request delivery</span> to submit your transaction ID and technician email. We deliver every tool within 1–2 hours.</li>
                </ol>
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