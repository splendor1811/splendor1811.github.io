import { useNavigate } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import type { Resource } from "@/data/schema";
import { TypeBadge, MarkerBadges } from "@/components/ResourceMeta";
import { StatusControl } from "@/components/StatusControl";
import { TopicIcon } from "@/components/TopicIcon";
import { useIsFavorite, useStatus } from "@/hooks/personal";
import { toggleFavorite } from "@/lib/db";
import { topicBySlug } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";

export function ResourceRow({ resource, pending }: { resource: Resource; pending?: boolean }) {
  const navigate = useNavigate();
  const fav = useIsFavorite(resource.id);
  const status = useStatus(resource.id);
  const topic = topicBySlug.get(resource.topicSlug);

  return (
    <div
      onClick={() => navigate(`/resource/${resource.id}`)}
      className={cn(
        "group flex cursor-pointer items-center gap-3 bg-card px-4 py-3 transition-colors hover:bg-surface-raised/50",
        status === "completed" && "opacity-70 hover:opacity-100",
      )}
    >
      <span
        className="h-8 w-0.5 shrink-0 rounded-full"
        style={{ background: topic?.color ?? "#7C8CFF" }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-medium text-foreground">{resource.title}</h3>
          <MarkerBadges markers={resource.markers} size={12} />
          {pending && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-2xs font-medium text-primary">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Live soon
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-2 truncate font-mono text-2xs text-faint">
          <span className="flex items-center gap-1" style={{ color: topic?.color }}>
            <TopicIcon name={topic?.icon ?? "Circle"} size={10} />
            {topic?.short}
          </span>
          <span>·</span>
          <span className="truncate">{resource.source}</span>
          <span>·</span>
          <span>{formatDate(resource.dateRaw, resource.dateSort)}</span>
        </div>
      </div>
      <TypeBadge type={resource.type} className="hidden md:inline-flex" />
      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => toggleFavorite(resource.id, resource.topicSlug)}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-surface-raised",
            fav ? "text-accent" : "text-faint opacity-0 group-hover:opacity-100",
          )}
          aria-label="Favorite"
        >
          <Star size={14} className={fav ? "fill-accent" : ""} />
        </button>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="flex h-7 w-7 items-center justify-center rounded-md text-faint opacity-0 transition-colors hover:bg-surface-raised group-hover:opacity-100"
          aria-label="Open original"
        >
          <ExternalLink size={14} />
        </a>
        <StatusControl resourceId={resource.id} topicSlug={resource.topicSlug} />
      </div>
    </div>
  );
}
