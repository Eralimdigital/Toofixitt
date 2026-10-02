# Project architecture

- Keep the product catalogue and package descriptions in `src/data/tools.ts` so cards, detail pages, and the sitemap share one source.
- Build Social Commerce Setup Resource handoff guides in `supabase/functions/approve-tool-delivery/socialcommerce.ts` by package tier; this delivers only applicable setup instructions without implying a customer's accounts were configured remotely.
- Keep reviews in the existing customer submission flow rather than inserting unverified testimonials; purchase claims should reflect real customer experiences.
- Keep the storefront free of music, voiceover, and shopping action sounds; the owner requested a silent experience.