import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ShoppingCart, Check } from "lucide-react";
import type { Tool } from "@/data/tools";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  const { add, has } = useCart();
  const inCart = has(tool.slug);
  const { data: reviews } = useQuery({
    queryKey: ["reviews-summary", tool.slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("rating")
        .eq("tool_slug", tool.slug);
      return data || [];
    },
  });

  const avgRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const count = reviews?.length || 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card/90 shadow-card backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-card-hover">
      <div className="aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={`/images/tools/${tool.slug}.webp`}
          alt={tool.name}
          loading="lazy"
          decoding="async"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          width={400}
          height={250}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 inline-block w-fit rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {tool.category}
        </span>
        <h3 className="mb-1 text-lg font-bold text-foreground">{tool.name}</h3>
        <p className="mb-3 flex-1 text-sm text-muted-foreground">{tool.description}</p>

        {/* Rating */}
        <div className="mb-3 flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(avgRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/30"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {avgRating > 0 ? avgRating.toFixed(1) : "No reviews"}{count > 0 ? ` (${count})` : ""}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary">{tool.price}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (inCart) return;
                add(tool);
                toast.success(`${tool.name} added to cart`);
              }}
              aria-label={inCart ? "In cart" : "Add to cart"}
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-all ${
                inCart
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-border bg-card text-foreground hover:border-accent/60 hover:text-accent"
              }`}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
            <Link
              to={`/tools/${tool.slug}`}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
