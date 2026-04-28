-- Table for tool delivery requests
CREATE TABLE public.tool_delivery_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_slug TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_price TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  technician_email TEXT NOT NULL,
  payment_screenshot_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tool_delivery_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a delivery request"
ON public.tool_delivery_requests
FOR INSERT
TO public
WITH CHECK (
  char_length(buyer_name) BETWEEN 1 AND 120
  AND char_length(technician_email) BETWEEN 3 AND 254
  AND technician_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(payment_screenshot_url) BETWEEN 1 AND 1024
);

CREATE POLICY "Delivery requests are publicly readable"
ON public.tool_delivery_requests
FOR SELECT
TO public
USING (true);

-- Storage bucket for payment screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Payment screenshots are publicly readable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'payment-screenshots');

CREATE POLICY "Anyone can upload payment screenshots"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'payment-screenshots');