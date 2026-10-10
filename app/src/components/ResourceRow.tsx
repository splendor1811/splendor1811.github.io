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

export function ResourceRow({ resource, pending }: { resource: Resource; pending?: boolean }) {
  const fav = useIsFavorite(resource.id);
  const topic = topicBySlug.get(resource.topicSlug);

  return (
    <article className="group flex min-w-0 flex-col gap-3 px-1 py-5 transition-colors sm:px-2 lg:flex-row lg:items-start lg:gap-6">
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <TypeBadge type={resource.type} />
          <span className="text-xs text-muted-foreground">{formatDate(resource.dateRaw, resource.dateSort)}</span>
          <MarkerBadges markers={resource.markers} size={14} />
          {pending && <span className="rounded bg-primary/5 px-2 py-1 text-xs font-medium text-primary">Publishing</span>}
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-foreground">
          <Link to={"/resource/" + resource.id} className="block min-h-11 py-1 transition-colors hover:text-primary">
            {resource.title}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 max-w-[75ch] text-sm leading-relaxed text-muted-foreground">{resource.summary}</p>
        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="max-w-full break-words">{resource.source}</span>
          {topic && (
            <Link to={"/topics/" + topic.slug} className="inline-flex min-h-11 max-w-full items-center gap-1.5 text-primary hover:underline">
              <TopicIcon name={topic.icon} size={13} className="shrink-0" />
              <span>{topic.title}</span>
            </Link>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 lg:pt-1" aria-label={"Actions for " + resource.title}>
        <StatusControl resourceId={resource.id} topicSlug={resource.topicSlug} />
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
    </article>
  );
}
