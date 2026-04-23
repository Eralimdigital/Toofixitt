CREATE TABLE public.review_helpful_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  voter_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (review_id, voter_key)
);

ALTER TABLE public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Helpful votes are publicly readable"
ON public.review_helpful_votes
FOR SELECT
USING (true);

CREATE POLICY "Anyone can mark a review helpful"
ON public.review_helpful_votes
FOR INSERT
WITH CHECK (char_length(voter_key) >= 16 AND char_length(voter_key) <= 64);

CREATE INDEX idx_review_helpful_votes_review_id ON public.review_helpful_votes(review_id);
CREATE INDEX idx_reviews_tool_slug_created_at ON public.reviews(tool_slug, created_at DESC);