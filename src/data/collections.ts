import { tools, type Tool } from "./tools";

export interface Collection {
  slug: string;
  name: string;
  description: string;
  items: Tool[];
}

const descriptions: Record<string, string> = {
  SEO: "Tools to grow your rankings, indexing, and organic traffic on Google and AI search.",
  Marketing: "Email, ads, and social campaigns that bring shoppers back and turn them into buyers.",
  Conversion: "Checkout, trust, and CRO tools that turn more visitors into paying customers.",
  AI: "AI-powered product content, video, and automation built for Shopify stores.",
  Sales: "Recover lost revenue and lift average order value across your store.",
  "Error Fixing": "Fix broken links, sold-out states, and schema issues before they cost you sales.",
  Traffic: "Drive qualified visitors to your store from search and ads.",
  Performance: "Speed up your store and product pages for better shopper experience.",
  Integration: "Connect your store to social commerce and other sales channels.",
  Design: "Premium themes and conversion-focused layouts for your storefront.",
  Analytics: "Track, measure, and understand how shoppers use your store.",
  Security: "SSL, verification, and infrastructure protection for your store.",
  Research: "Find winning products and validate demand before you invest.",
};

export const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const collections: Collection[] = Array.from(new Set(tools.map((t) => t.category)))
  .sort()
  .map((category) => ({
    slug: slugify(category),
    name: category,
    description: descriptions[category] ?? `Premium ${category} tools for your Shopify store.`,
    items: tools.filter((t) => t.category === category),
  }));

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

// Collections showcased on the homepage, largest first.
export const showcaseCollections = [...collections]
  .sort((a, b) => b.items.length - a.items.length)
  .slice(0, 6);
