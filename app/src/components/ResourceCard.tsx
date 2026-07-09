import { useNavigate } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import type { Resource } from "@/data/schema";
import { TypeBadge, MarkerBadges } from "@/components/ResourceMeta";
import { StatusControl, StatusDot } from "@/components/StatusControl";
import { TopicIcon } from "@/components/TopicIcon";
import { useIsFavorite, useStatus } from "@/hooks/personal";
import { toggleFavorite } from "@/lib/db";
import { topicBySlug } from "@/lib/content";
import { cn, hexToRgb, formatDate } from "@/lib/utils";

export function ResourceCard({ resource }: { resource: Resource }) {
  const navigate = useNavigate();
  const fav = useIsFavorite(resource.id);
  const status = useStatus(resource.id);
  const topic = topicBySlug.get(resource.topicSlug);
  const color = topic?.color ?? "#7C8CFF";

  return (
    <article
      onClick={() => navigate(`/resource/${resource.id}`)}
      className={cn(
        "group relative flex cursor-pointer flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-all",
        "hover:border-[color:var(--tc)] hover:shadow-raised",
        status === "completed" && "opacity-75 hover:opacity-100",
      )}
      style={{ ["--tc" as string]: `rgba(${hexToRgb(color)}, 0.5)` }}
    >
      {/* top rail */}
      <div className="flex items-center gap-2">
        <TypeBadge type={resource.type} />
        <div className="ml-auto flex items-center gap-1.5">
          <MarkerBadges markers={resource.markers} size={13} />
          <StatusDot status={status} />
        </div>
      </div>

      <div className="flex-1">
        <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-foreground">
          {resource.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
          {resource.summary}
        </p>
      </div>

      {/* concept chips */}
      {resource.keyConcepts.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {resource.keyConcepts.slice(0, 3).map((c) => (
            <span
              key={c}
              className="truncate rounded bg-surface-raised px-1.5 py-0.5 font-mono text-2xs text-muted-foreground"
            >
              {c}
            </span>
          ))}
          {resource.keyConcepts.length > 3 && (
            <span className="px-1 py-0.5 font-mono text-2xs text-faint">
              +{resource.keyConcepts.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 border-t border-border/70 pt-3">
        <span
          className="flex items-center gap-1.5 text-2xs font-medium"
          style={{ color }}
        >
          <TopicIcon name={topic?.icon ?? "Circle"} size={12} />
          <span className="max-w-[110px] truncate">{topic?.short}</span>
        </span>
        <span className="text-faint">·</span>
        <span className="truncate font-mono text-2xs text-faint" title={resource.source}>
          {formatDate(resource.dateRaw, resource.dateSort)}
        </span>

        <div className="ml-auto flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => toggleFavorite(resource.id, resource.topicSlug)}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-surface-raised",
              fav ? "text-accent" : "text-faint hover:text-muted-foreground",
            )}
            aria-label={fav ? "Remove favorite" : "Add favorite"}
          >
            <Star size={14} className={fav ? "fill-accent" : ""} />
          </button>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-md text-faint transition-colors hover:bg-surface-raised hover:text-muted-foreground"
            aria-label="Open original"
          >
            <ExternalLink size={14} />
          </a>
          <StatusControl resourceId={resource.id} topicSlug={resource.topicSlug} />
        </div>
      </div>
    </article>
  );
}
