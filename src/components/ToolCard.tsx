import { Link } from "react-router-dom";
import type { Tool } from "@/data/tools";

interface ToolCardProps {
  tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
      <div className="aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={`/images/tools/${tool.slug}.jpg`}
          alt={tool.name}
          loading="lazy"
          width={400}
          height={250}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2 inline-block w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {tool.category}
        </span>
        <h3 className="mb-1 text-lg font-bold text-foreground">{tool.name}</h3>
        <p className="mb-4 flex-1 text-sm text-muted-foreground">{tool.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">{tool.price}</span>
          <Link
            to={`/tools/${tool.slug}`}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:opacity-90"
          >
            View Tool
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;
