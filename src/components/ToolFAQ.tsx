import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import type { Tool } from "@/data/tools";

interface ToolFAQProps {
  tool: Tool;
}

const ToolFAQ = ({ tool }: ToolFAQProps) => {
  const faqs = [
    {
      q: `How do I receive ${tool.name} after I order?`,
      a: `Once your purchase email is confirmed, we deliver ${tool.name} directly to your inbox along with a step-by-step setup guide. Most orders are sent within 2–6 hours, 7 days a week.`,
    },
    {
      q: "Is this tool compatible with my Shopify store?",
      a: `${tool.name} works with all standard Shopify plans (Basic, Shopify, Advanced, and Plus) and is compatible with most modern themes including Dawn, Refresh, Sense, and popular premium themes. If you’re unsure, email us your store URL and we’ll confirm before you buy.`,
    },
    {
      q: "Do I need technical or coding skills to set it up?",
      a: "No coding required. Every order ships with a plain-English setup guide and short walkthrough. If you get stuck, our support team can guide you through installation over email.",
    },
    {
      q: "How long does setup take?",
      a: "Most store owners are up and running in 15–45 minutes. More advanced configurations (custom flows, multi-store setups, integrations) typically take a single afternoon.",
    },
    {
      q: "Will it slow down my store or break my theme?",
      a: "No. Our tools are built lightweight and tested against Core Web Vitals. They are non-destructive — you can safely uninstall at any time without affecting your existing theme or data.",
    },
    {
      q: "What if it doesn’t work the way I expected?",
      a: "Reach out within 7 days at smithmove0@gmail.com and we’ll either troubleshoot it with you 1-on-1 or issue a refund per our refund policy. We want it to actually drive results, not just sit in your store.",
    },
    {
      q: "Do you offer ongoing support after purchase?",
      a: "Yes. Every purchase includes direct email support from our team. We help with installation issues, configuration questions, and best-practice tips — at no extra cost.",
    },
    {
      q: "Can I use this on multiple stores?",
      a: "Each license covers one Shopify store by default. If you run multiple stores, email us before purchase and we’ll prepare a multi-store package for you.",
    },
  ];

  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-card">
          <HelpCircle className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">Setup, compatibility, and support — answered.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card/80 p-2 shadow-card backdrop-blur-md sm:p-4">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-left text-sm font-semibold hover:text-accent sm:text-base">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Still have questions?{" "}
        <a href="mailto:smithmove0@gmail.com" className="font-semibold text-accent hover:underline">
          Email smithmove0@gmail.com
        </a>
      </p>
    </div>
  );
};

export default ToolFAQ;