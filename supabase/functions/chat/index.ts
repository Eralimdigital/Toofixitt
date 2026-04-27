import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ClientTool = {
  name: string;
  slug: string;
  price: string;
  priceValue: number;
  category: string;
  description: string;
};

const buildSystemPrompt = (tools: ClientTool[]) => {
  const catalog = tools
    .map(
      (t) =>
        `- ${t.name} — ${t.price} — Category: ${t.category} — /tools/${t.slug}\n  ${t.description}`,
    )
    .join("\n");

  return `You are ToolBot, the friendly support assistant for ToolifyHQ — a premium Shopify tools marketplace.

SITE PAGES
- Home: /
- All tools: /tools
- Tool detail: /tools/<slug>
- Filter by category: /tools?category=<Category>
- Filter by max price: /tools?maxPrice=<number>
- About: /about · Contact: /contact · Privacy: /privacy · Terms: /terms · Refund: /refund
- Support email: smithmove0@gmail.com

LIVE TOOL CATALOG (authoritative — always use these exact prices, names, slugs):
${catalog}

RULES
- ALWAYS reference tools using their EXACT name and EXACT price from the catalog above.
- When recommending a tool, link it as a markdown link: [Tool Name](/tools/<slug>).
- For category browse suggestions use links like [Browse SEO tools](/tools?category=SEO).
- For budget queries use [Tools under $200](/tools?maxPrice=200).
- If a user asks for the cheapest / best value / under-$X tool, scan the catalog and recommend the best concrete match.
- Be concise, warm, premium. Use markdown (bold, bullet lists, links).
- If something isn't in the catalog, say so and direct them to /contact or smithmove0@gmail.com.
- Never invent prices, slugs, refund approvals, or guarantees.`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, tools = [] } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = buildSystemPrompt(tools as ClientTool[]);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});