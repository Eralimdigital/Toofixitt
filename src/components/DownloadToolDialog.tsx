import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { z } from "zod";

interface DownloadToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toolSlug: string;
  toolName: string;
  toolPrice: string;
}

const formSchema = z.object({
  buyerName: z.string().trim().min(2, "Name must be at least 2 characters").max(120, "Name too long"),
  technicianEmail: z.string().trim().email("Enter a valid technician email").max(254),
  transactionId: z
    .string()
    .trim()
    .min(6, "Transaction ID must be at least 6 characters")
    .max(128, "Transaction ID too long"),
});

export const DownloadToolDialog = ({ open, onOpenChange, toolSlug, toolName, toolPrice }: DownloadToolDialogProps) => {
  const [buyerName, setBuyerName] = useState("");
  const [technicianEmail, setTechnicianEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const reset = () => {
    setBuyerName("");
    setTechnicianEmail("");
    setTransactionId("");
    setSuccess(null);
  };

  const handleClose = (next: boolean) => {
    if (!submitting) {
      if (!next) reset();
      onOpenChange(next);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = formSchema.safeParse({ buyerName, technicianEmail, transactionId });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { data: inserted, error: insertError } = await supabase
        .from("tool_delivery_requests")
        .insert({
          tool_slug: toolSlug,
          tool_name: toolName,
          tool_price: toolPrice,
          buyer_name: parsed.data.buyerName,
          technician_email: parsed.data.technicianEmail,
          transaction_id: parsed.data.transactionId,
        })
        .select("order_reference, approval_token")
        .single();

      if (insertError) throw insertError;

      // Fire-and-forget notification email — failure must NOT block the buyer
      supabase.functions
        .invoke("notify-tool-purchase", {
          body: {
            toolSlug,
            toolName,
            toolPrice,
            buyerName: parsed.data.buyerName,
            technicianEmail: parsed.data.technicianEmail,
            transactionId: parsed.data.transactionId,
            orderReference: inserted?.order_reference ?? "",
            approvalToken: inserted?.approval_token ?? "",
          },
        })
        .catch((e) => console.warn("notify email failed", e));

      setSuccess(parsed.data.technicianEmail);
      toast.success("Request submitted! Tool will be sent to the technician.");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Could not submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-foreground">Request received!</h3>
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{toolName}</span> will be sent to your technician at:
            </p>
            <p className="mb-6 inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4 text-accent" />
              {success}
            </p>
            <p className="mb-6 text-xs text-muted-foreground">
              Our team will verify your transaction ID and deliver the tool within 1–2 hours.
            </p>
            <Button onClick={() => handleClose(false)} className="w-full bg-accent text-accent-foreground hover:opacity-90">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Download {toolName}</DialogTitle>
              <DialogDescription>
                Enter your payment Transaction ID and technician email — we'll verify and deliver the tool directly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="buyerName">Your name</Label>
                <Input
                  id="buyerName"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="John Doe"
                  maxLength={120}
                  required
                />
              </div>
              <div>
                <Label htmlFor="technicianEmail">Technician email</Label>
                <Input
                  id="technicianEmail"
                  type="email"
                  value={technicianEmail}
                  onChange={(e) => setTechnicianEmail(e.target.value)}
                  placeholder="technician@example.com"
                  maxLength={254}
                  required
                />
                <p className="mt-1 text-xs text-muted-foreground">The tool will be delivered to this email.</p>
              </div>
              <div>
                <Label htmlFor="transactionId">Payment Transaction ID</Label>
                <Input
                  id="transactionId"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. ch_3PqA9b2eZvKYlo2C... or PayPal txn ID"
                  maxLength={128}
                  required
                  className="font-mono text-sm"
                />
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                  Find this in your Stripe / PayPal / bank receipt. We verify it before delivery.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-secondary/50 p-3 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Order:</span> {toolName} — <span className="font-semibold text-accent">{toolPrice}</span>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-accent text-accent-foreground hover:opacity-90"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Submit & Send to Technician
                  </>
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DownloadToolDialog;
