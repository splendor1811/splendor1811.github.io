import { Link } from "react-router-dom";
import { Star, ExternalLink } from "lucide-react";
import type { Resource } from "@/data/schema";
import { TypeBadge, MarkerBadges } from "@/components/ResourceMeta";
import { StatusControl } from "@/components/StatusControl";
import { TopicIcon } from "@/components/TopicIcon";
import { useIsFavorite } from "@/hooks/personal";
import { toggleFavorite } from "@/lib/db";
import { topicBySlug } from "@/lib/content";
import { cn, formatDate } from "@/lib/utils";

export function ResourceCard({ resource, pending }: { resource: Resource; pending?: boolean }) {
  const fav = useIsFavorite(resource.id);
  const topic = topicBySlug.get(resource.topicSlug);

  return (
    <article className="group relative flex min-w-0 flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={resource.type} />
        {pending && <span className="rounded bg-primary/5 px-2 py-1 text-xs font-medium text-primary">Publishing</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <MarkerBadges markers={resource.markers} size={15} />
        </div>
      </div>

      <div className="mt-4 flex-1">
        <Link to={"/resource/" + resource.id} className="block rounded-sm transition-colors hover:text-primary">
          <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{resource.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{resource.summary}</p>
        </Link>
        <div className="mt-4 text-xs leading-relaxed text-muted-foreground">
          <p className="break-words font-medium text-foreground/80">{resource.source}</p>
          <p className="mt-0.5">{formatDate(resource.dateRaw, resource.dateSort)}</p>
        </div>
      </div>

      {resource.keyConcepts.length > 0 && (
        <div className="mt-4 flex min-w-0 flex-wrap gap-1.5">
          {resource.keyConcepts.slice(0, 2).map((concept) => (
            <span key={concept} className="max-w-full truncate rounded-md bg-surface-raised px-2 py-1 text-xs text-muted-foreground">{concept}</span>
          ))}
          {resource.keyConcepts.length > 2 && (
            <span className="px-1 py-1 text-xs text-muted-foreground" aria-label={(resource.keyConcepts.length - 2) + " more concepts"}>
              +{resource.keyConcepts.length - 2}
            </span>
          )}
        </div>
      )}

      {topic && (
        <Link to={"/topics/" + topic.slug} className="mt-3 inline-flex min-h-11 items-center gap-2 self-start text-xs font-medium text-primary hover:underline">
          <TopicIcon name={topic.icon} size={14} className="shrink-0" />
          {topic.title}
        </Link>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3" aria-label={"Actions for " + resource.title}>
        <StatusControl resourceId={resource.id} topicSlug={resource.topicSlug} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(resource.id, resource.topicSlug)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-surface-raised",
              fav ? "text-primary" : "text-muted-foreground hover:text-foreground",
            )}
            aria-label={(fav ? "Remove from" : "Add to") + " favorites: " + resource.title}
            aria-pressed={fav}
          >
            <Star size={17} className={fav ? "fill-primary/20" : ""} aria-hidden />
          </button>
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-raised hover:text-primary"
            aria-label={"Open original in a new tab: " + resource.title}
          >
            <ExternalLink size={17} aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
}
