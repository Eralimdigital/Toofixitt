import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Download, Loader2, CheckCircle2, Upload, Mail } from "lucide-react";
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
});

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const DownloadToolDialog = ({ open, onOpenChange, toolSlug, toolName, toolPrice }: DownloadToolDialogProps) => {
  const [buyerName, setBuyerName] = useState("");
  const [technicianEmail, setTechnicianEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const reset = () => {
    setBuyerName("");
    setTechnicianEmail("");
    setFile(null);
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

    const parsed = formSchema.safeParse({ buyerName, technicianEmail });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    if (!file) {
      toast.error("Please attach your payment screenshot");
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Screenshot must be PNG, JPG, or WEBP");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("Screenshot must be under 5MB");
      return;
    }

    setSubmitting(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const filePath = `${toolSlug}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("payment-screenshots")
        .upload(filePath, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("payment-screenshots").getPublicUrl(filePath);
      const screenshotUrl = urlData.publicUrl;

      const { error: insertError } = await supabase.from("tool_delivery_requests").insert({
        tool_slug: toolSlug,
        tool_name: toolName,
        tool_price: toolPrice,
        buyer_name: parsed.data.buyerName,
        technician_email: parsed.data.technicianEmail,
        payment_screenshot_url: screenshotUrl,
      });

      if (insertError) throw insertError;

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
              Our team will verify your payment screenshot and deliver the tool within 1–2 hours.
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
                Provide your payment proof and technician email — we'll deliver the tool to them directly.
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
                <Label htmlFor="screenshot">Payment screenshot</Label>
                <label
                  htmlFor="screenshot"
                  className="mt-1 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input bg-secondary/40 px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-secondary"
                >
                  <Upload className="h-4 w-4" />
                  {file ? <span className="font-medium text-foreground">{file.name}</span> : <span>Click to upload (PNG/JPG, max 5MB)</span>}
                </label>
                <input
                  id="screenshot"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
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
