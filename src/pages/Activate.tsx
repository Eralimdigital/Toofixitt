import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, KeyRound } from "lucide-react";
import { toast } from "sonner";

const Activate = () => {
  const [form, setForm] = useState({ store: "", key: "", number: "", code: "" });
  const [sending, setSending] = useState(false);

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.store || !form.key || !form.number || !form.code) {
      toast.error("Please fill in every field exactly as shown in your license file.");
      return;
    }
    setSending(true);
    const body = encodeURIComponent(
      `Store URL: ${form.store}\nLicense Key: ${form.key}\nLicense Number: ${form.number}\nActivation Code: ${form.code}\n`,
    );
    window.location.href = `mailto:smithmove0@gmail.com?subject=${encodeURIComponent(
      `Activation request — ${form.key}`,
    )}&body=${body}`;
    setTimeout(() => setSending(false), 1200);
    toast.success("Activation request prepared. Send the email to complete activation.");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SEO
        title="Product Activation Portal | ToolifyHQ"
        description="Activate your purchased ToolifyHQ tool using your store URL, license key, license number and activation code."
      />
      <Navbar />
      <section className="gradient-hero border-b border-border py-16">
        <div className="container max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            <span className="text-gradient">Product Activation</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Enter the credentials from your license file to activate your tool.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container max-w-2xl">
          <form
            onSubmit={submit}
            className="space-y-5 rounded-2xl border border-border bg-card/85 p-8 shadow-card backdrop-blur-md"
          >
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary">
                <KeyRound className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold">Activation input</p>
                <p className="text-sm text-muted-foreground">Copy and paste each value exactly.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="store">Store URL</Label>
              <Input id="store" placeholder="https://yourstore.myshopify.com" value={form.store} onChange={onChange("store")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="key">License Key</Label>
              <Input id="key" placeholder="TOOL-V123-AB12-CD34-5678" value={form.key} onChange={onChange("key")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">License Number</Label>
              <Input id="number" placeholder="16-character identifier" value={form.number} onChange={onChange("number")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Activation Code</Label>
              <Input id="code" placeholder="Multi-segmented activation code" value={form.code} onChange={onChange("code")} />
            </div>

            <Button type="submit" className="w-full" disabled={sending}>
              {sending ? "Preparing…" : "Activate"}
            </Button>

            <p className="flex items-start gap-2 pt-2 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              Credentials are verified manually by our technical team. Each license number and activation code
              pair is unique — reusing an activated code may permanently deactivate it.
            </p>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Activate;
