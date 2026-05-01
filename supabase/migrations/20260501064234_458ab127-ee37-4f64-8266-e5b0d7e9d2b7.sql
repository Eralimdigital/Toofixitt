
ALTER TABLE public.tool_delivery_requests
  ADD COLUMN IF NOT EXISTS approval_token text NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS rejected_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS license_key text,
  ADD COLUMN IF NOT EXISTS tool_image_url text;

CREATE INDEX IF NOT EXISTS tool_delivery_requests_approval_token_idx
  ON public.tool_delivery_requests(approval_token);
