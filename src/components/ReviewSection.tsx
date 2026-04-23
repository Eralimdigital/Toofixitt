import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, ThumbsUp, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewSectionProps {
  toolSlug: string;
}

const REVIEWS_PER_PAGE = 5;

type Review = {
  id: string;
  tool_slug: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
  review_helpful_votes: { voter_key: string }[];
};

const getVisitorKey = () => {
  const storageKey = "toolify-review-voter-key";
  const existingKey = localStorage.getItem(storageKey);

  if (existingKey) return existingKey;

  const newKey = crypto.randomUUID();
  localStorage.setItem(storageKey, newKey);
  return newKey;
};

const StarRating = ({ rating, onRate, interactive = false }: { rating: number; onRate?: (r: number) => void; interactive?: boolean }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${star <= rating ? "fill-accent text-accent" : "text-muted-foreground/30"} ${interactive ? "cursor-pointer" : ""}`}
        onClick={() => interactive && onRate?.(star)}
      />
    ))}
  </div>
);

const ReviewSection = ({ toolSlug }: ReviewSectionProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [page, setPage] = useState(1);
  const voterKey = useMemo(getVisitorKey, []);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", toolSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, review_helpful_votes(voter_key)")
        .eq("tool_slug", toolSlug)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
  });

  const sortedReviews = useMemo(
    () =>
      [...reviews].sort((a, b) => {
        const helpfulDifference = b.review_helpful_votes.length - a.review_helpful_votes.length;
        if (helpfulDifference !== 0) return helpfulDifference;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }),
    [reviews],
  );

  const totalPages = Math.max(1, Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE));
  const visibleReviews = sortedReviews.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  const mutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("reviews").insert({
        tool_slug: toolSlug,
        reviewer_name: name.trim(),
        rating,
        comment: comment.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", toolSlug] });
      setName("");
      setRating(0);
      setComment("");
      toast.success("Review submitted!");
    },
    onError: () => toast.error("Failed to submit review"),
  });

  const helpfulMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase.from("review_helpful_votes" as never).insert({
        review_id: reviewId,
        voter_key: voterKey,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", toolSlug] });
      toast.success("Marked as helpful");
    },
    onError: () => toast.error("You already marked this review helpful"),
  });

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const goToPage = (nextPage: number) => setPage(Math.min(Math.max(nextPage, 1), totalPages));

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h3>
        {avgRating && (
          <div className="flex items-center gap-2">
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="text-sm font-semibold text-foreground">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Submit Form */}
      <div className="mb-8 rounded-xl border border-border bg-secondary/80 p-6 shadow-card">
        <h4 className="mb-4 text-sm font-semibold text-foreground">Write a Review</h4>
        <div className="mb-3">
          <label className="mb-1 block text-xs text-muted-foreground">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <div className="mb-3">
          <label className="mb-1 block text-xs text-muted-foreground">Rating</label>
          <StarRating rating={rating} onRate={setRating} interactive />
        </div>
        <div className="mb-4">
          <label className="mb-1 block text-xs text-muted-foreground">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
            className="w-full rounded-lg border border-border bg-background/80 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
        <button
          onClick={() => mutation.mutate()}
          disabled={!name.trim() || rating === 0 || mutation.isPending}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-card transition-all hover:opacity-90 disabled:opacity-50"
        >
          {mutation.isPending ? "Submitting..." : "Submit Review"}
        </button>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {visibleReviews.map((review) => {
            const helpfulCount = review.review_helpful_votes.length;
            const hasVoted = review.review_helpful_votes.some((vote) => vote.voter_key === voterKey);

            return (
              <div key={review.id} className="rounded-xl border border-border bg-card/80 p-5 shadow-card transition-all hover:shadow-card-hover">
              <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm font-semibold text-foreground">{review.reviewer_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              )}
              <button
                type="button"
                onClick={() => helpfulMutation.mutate(review.id)}
                disabled={hasVoted || helpfulMutation.isPending}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border bg-secondary/70 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-card transition-all hover:border-accent/60 hover:text-accent disabled:cursor-default disabled:border-accent/40 disabled:text-accent"
              >
                <ThumbsUp className={`h-3.5 w-3.5 ${hasVoted ? "fill-accent" : ""}`} />
                Helpful {helpfulCount > 0 && `(${helpfulCount})`}
              </button>
            </div>
            );
          })}

          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/70 p-3 shadow-card">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-all hover:border-accent/60 hover:text-accent disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <span className="text-xs font-semibold text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-semibold text-foreground transition-all hover:border-accent/60 hover:text-accent disabled:opacity-40"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
