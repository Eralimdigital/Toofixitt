# Project architecture

- Keep the product catalogue and package descriptions in `src/data/tools.ts` so cards, detail pages, and the sitemap share one source.
- Build Social Commerce Setup Resource handoff guides in `supabase/functions/approve-tool-delivery/socialcommerce.ts` by package tier; this delivers only applicable setup instructions without implying a customer's accounts were configured remotely.
- Keep reviews in the existing customer submission flow rather than inserting unverified testimonials; purchase claims should reflect real customer experiences.
- Keep only opt-out shopping action sounds in the site audio layer; background music and spoken route announcements were removed at the owner's request.