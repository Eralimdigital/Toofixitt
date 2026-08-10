import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReviewSummary {
  count: number;
  avg: number;
}

/**
 * Fetches every review rating in ONE request and derives per-tool summaries.
 * Previously each ToolCard issued its own query (40+ parallel requests per page).
 */
export function useReviewSummaries() {
  return useQuery({
    queryKey: ["reviews-summary-all"],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<Record<string, ReviewSummary>> => {
      const { data } = await supabase.from("reviews").select("tool_slug, rating");
      const totals: Record<string, { sum: number; count: number }> = {};
      for (const row of data || []) {
        const slug = (row as { tool_slug: string }).tool_slug;
        const rating = (row as { rating: number }).rating || 0;
        if (!totals[slug]) totals[slug] = { sum: 0, count: 0 };
        totals[slug].sum += rating;
        totals[slug].count += 1;
      }
      const out: Record<string, ReviewSummary> = {};
      for (const [slug, t] of Object.entries(totals)) {
        out[slug] = { count: t.count, avg: t.count ? t.sum / t.count : 0 };
      }
      return out;
    },
  });
}
