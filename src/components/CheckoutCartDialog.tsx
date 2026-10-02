import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { useCart, type CartItem } from "@/contexts/CartContext";

interface CheckoutCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  onSuccess?: () => void;
}

const formSchema = z.object({
  buyerName: z.string().trim().min(2, "Name must be at least 2 characters").max(120),
  technicianEmail: z.string().trim().email("Enter a valid technician email").max(254),
  transactionId: z.string().trim().min(6, "Transaction ID must be at least 6 characters").max(128),
});

const CheckoutCartDialog = ({ open, onOpenChange, items, onSuccess }: CheckoutCartDialogProps) => {
  const { clear } = useCart();
  const [buyerName, setBuyerName] = useState("");
  const [technicianEmail, setTechnicianEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const total = items.reduce((s, i) => s + (i.priceValue || 0), 0);

  const reset = () => {
    setBuyerName("");
    setTechnicianEmail("");
    setTransactionId("");
    setSuccess(null);
  };

  const handleClose = (next: boolean) => {
    if (submitting) return;
    if (!next) reset();
    onOpenChange(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    const parsed = formSchema.safeParse({ buyerName, technicianEmail, transactionId });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { error: fnError } = await supabase.functions.invoke("notify-tool-purchase", {
        body: {
          items: items.map((it) => ({
            toolSlug: it.slug,
            toolName: it.name,
            toolPrice: it.price,
          })),
          buyerName: parsed.data.buyerName,
          technicianEmail: parsed.data.technicianEmail,
          transactionId: parsed.data.transactionId,
        },
      });
      if (fnError) throw fnError;

      setSuccess(parsed.data.technicianEmail);
      clear();
      onSuccess?.();
      toast.success(`${items.length} tool${items.length > 1 ? "s" : ""} requested!`);
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Could not submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">Request received!</h3>
            <p className="mb-1 text-sm text-muted-foreground">
              Your tools will be sent to your technician at:
            </p>
            <p className="mb-6 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4 text-accent" />
              {success}
            </p>
            <p className="mb-6 text-xs text-muted-foreground">
              Our team will verify your transaction ID and deliver each tool within 1–2 hours.
            </p>
            <Button onClick={() => handleClose(false)} className="w-full bg-accent text-accent-foreground hover:opacity-90">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Checkout {items.length} tool{items.length > 1 ? "s" : ""}</DialogTitle>
              <DialogDescription>
                Enter your payment Transaction ID once — we'll process every tool in your cart together.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-border bg-secondary/50 p-3 text-xs">
              <p className="mb-2 font-semibold text-foreground">Order summary</p>
              <ul className="space-y-1">
                {items.map((it) => (
                  <li key={it.slug} className="flex items-center justify-between text-muted-foreground">
                    <span className="truncate pr-2">{it.name}</span>
                    <span className="shrink-0 font-semibold text-foreground">{it.price}</span>
                  </li>
                ))}
              </ul>
              {total > 0 && (
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2 text-sm font-bold text-foreground">
                  <span>Estimated total</span>
                  <span className="text-accent">${total.toLocaleString()}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="buyerName">Your name</Label>
                <Input id="buyerName" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} placeholder="John Doe" maxLength={120} required />
              </div>
              <div>
                <Label htmlFor="technicianEmail">Technician email</Label>
                <Input id="technicianEmail" type="email" value={technicianEmail} onChange={(e) => setTechnicianEmail(e.target.value)} placeholder="technician@example.com" maxLength={254} required />
                <p className="mt-1 text-xs text-muted-foreground">All tools will be delivered here.</p>
              </div>
              <div>
                <Label htmlFor="transactionId">Payment Transaction ID</Label>
                <Input id="transactionId" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="Stripe / PayPal / bank txn ID" maxLength={128} required className="font-mono text-sm" />
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  One transaction covers every tool in this cart.
                </p>
              </div>
              <Button type="submit" disabled={submitting} className="w-full bg-accent text-accent-foreground hover:opacity-90">
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Download className="h-4 w-4" /> Submit & Send to Technician</>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutCartDialog;