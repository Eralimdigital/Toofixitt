
-- 1. Deny-by-default storage policies for payment-screenshots
DROP POLICY IF EXISTS "payment_screenshots_deny_select" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_deny_insert" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_deny_update" ON storage.objects;
DROP POLICY IF EXISTS "payment_screenshots_deny_delete" ON storage.objects;

CREATE POLICY "payment_screenshots_deny_select"
ON storage.objects FOR SELECT TO public, anon, authenticated
USING (bucket_id = 'payment-screenshots' AND false);

CREATE POLICY "payment_screenshots_deny_insert"
ON storage.objects FOR INSERT TO public, anon, authenticated
WITH CHECK (bucket_id = 'payment-screenshots' AND false);

CREATE POLICY "payment_screenshots_deny_update"
ON storage.objects FOR UPDATE TO public, anon, authenticated
USING (bucket_id = 'payment-screenshots' AND false)
WITH CHECK (bucket_id = 'payment-screenshots' AND false);

CREATE POLICY "payment_screenshots_deny_delete"
ON storage.objects FOR DELETE TO public, anon, authenticated
USING (bucket_id = 'payment-screenshots' AND false);

-- 2. Dedupe and enforce unique helpful votes
DELETE FROM public.review_helpful_votes a
USING public.review_helpful_votes b
WHERE a.ctid < b.ctid
  AND a.review_id = b.review_id
  AND a.voter_key = b.voter_key;

ALTER TABLE public.review_helpful_votes
  ADD CONSTRAINT review_helpful_votes_review_voter_unique
  UNIQUE (review_id, voter_key);
