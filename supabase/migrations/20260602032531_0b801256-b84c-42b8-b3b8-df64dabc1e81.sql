
-- Tool delivery requests: remove public read + public insert. Only service_role (used by the
-- notify-tool-purchase edge function) can read/write. Anonymous users may no longer query
-- license keys, approval tokens or buyer emails.
DROP POLICY IF EXISTS "Delivery requests are publicly readable" ON public.tool_delivery_requests;
DROP POLICY IF EXISTS "Anyone can submit a delivery request" ON public.tool_delivery_requests;

REVOKE SELECT, INSERT, UPDATE, DELETE ON public.tool_delivery_requests FROM anon, authenticated;
GRANT ALL ON public.tool_delivery_requests TO service_role;

-- Make the payment screenshots bucket private and remove the permissive policies.
UPDATE storage.buckets SET public = false WHERE id = 'payment-screenshots';
DROP POLICY IF EXISTS "Payment screenshots are publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload payment screenshots" ON storage.objects;

-- Tighten the "anyone can submit a review" policy so WITH CHECK is no longer just true().
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
CREATE POLICY "Anyone can submit a review"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (
  rating BETWEEN 1 AND 5
  AND char_length(reviewer_name) BETWEEN 1 AND 80
  AND (comment IS NULL OR char_length(comment) <= 2000)
  AND char_length(tool_slug) BETWEEN 1 AND 200
);
