import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewSectionProps {
  toolSlug: string;
}

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

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews", toolSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("tool_slug", toolSlug)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

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
      <div className="mb-8 rounded-xl border border-border bg-secondary p-6">
        <h4 className="mb-4 text-sm font-semibold text-foreground">Write a Review</h4>
        <div className="mb-3">
          <label className="mb-1 block text-xs text-muted-foreground">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          onClick={() => mutation.mutate()}
          disabled={!name.trim() || rating === 0 || mutation.isPending}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
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
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-border bg-background p-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{review.reviewer_name}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              <StarRating rating={review.rating} />
              {review.comment && (
                <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
