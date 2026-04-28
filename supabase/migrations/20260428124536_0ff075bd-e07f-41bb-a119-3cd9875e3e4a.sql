-- Add transaction_id and order_reference columns
ALTER TABLE public.tool_delivery_requests
  ADD COLUMN IF NOT EXISTS transaction_id text,
  ADD COLUMN IF NOT EXISTS order_reference text;

-- Make payment_screenshot_url optional
ALTER TABLE public.tool_delivery_requests
  ALTER COLUMN payment_screenshot_url DROP NOT NULL;

-- Drop old strict insert policy and replace
DROP POLICY IF EXISTS "Anyone can submit a delivery request" ON public.tool_delivery_requests;

CREATE POLICY "Anyone can submit a delivery request"
ON public.tool_delivery_requests
FOR INSERT
TO public
WITH CHECK (
  char_length(buyer_name) BETWEEN 1 AND 120
  AND char_length(technician_email) BETWEEN 3 AND 254
  AND technician_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(transaction_id) BETWEEN 3 AND 128
);

-- Auto-generate order reference like TFX-20260428-A7K9
CREATE OR REPLACE FUNCTION public.set_order_reference()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_reference IS NULL OR NEW.order_reference = '' THEN
    NEW.order_reference := 'TFX-' || to_char(now(), 'YYYYMMDD') || '-' ||
      upper(substring(md5(gen_random_uuid()::text) from 1 for 4));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_set_order_reference ON public.tool_delivery_requests;
CREATE TRIGGER trg_set_order_reference
BEFORE INSERT ON public.tool_delivery_requests
FOR EACH ROW EXECUTE FUNCTION public.set_order_reference();