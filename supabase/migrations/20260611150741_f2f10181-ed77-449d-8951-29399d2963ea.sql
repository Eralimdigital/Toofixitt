
REVOKE ALL ON public.tool_delivery_requests FROM anon, authenticated;
GRANT ALL ON public.tool_delivery_requests TO service_role;

CREATE POLICY "tool_delivery_requests_deny_all"
ON public.tool_delivery_requests
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);
