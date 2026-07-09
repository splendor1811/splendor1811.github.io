import { useParams, useNavigate, Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Star, Repeat, Sparkles, Link2 } from "lucide-react";
import { PageContainer } from "@/components/PageHeader";
import { TypeBadge, MarkerBadges } from "@/components/ResourceMeta";
import { StatusControl } from "@/components/StatusControl";
import { TopicIcon } from "@/components/TopicIcon";
import { Button } from "@/components/ui/primitives";
import { Tooltip } from "@/components/ui/tooltip";
import { NoteEditor } from "./NoteEditor";
import { Highlights } from "./Highlights";
import { getResource, topicBySlug, relatedResources } from "@/lib/content";
import { useIsFavorite } from "@/hooks/personal";
import { db, toggleFavorite, setRating } from "@/lib/db";
import { newReview } from "@/lib/srs";
import { hexToRgb, formatDate } from "@/lib/utils";

export function ResourcePage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const resource = getResource(id);
  const fav = useIsFavorite(id);
  const progressRow = useLiveQuery(() => db.progress.get(id), [id]);
  const inReview = useLiveQuery(() => db.reviews.get(id).then(Boolean), [id], false);

  if (!resource) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Resource not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate("/library")}>
          Back to library
        </Button>
      </PageContainer>
    );
  }

  const topic = topicBySlug.get(resource.topicSlug)!;
  const related = relatedResources(resource, 5);
  const rating = progressRow?.rating ?? 0;

  async function addReview() {
    await db.reviews.put(newReview(id));
    toast.success("Added to review queue", { description: "You'll be reminded to revisit this." });
  }

  return (
    <PageContainer className="max-w-5xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Header */}
      <div
        className="rounded-xl border border-border bg-card p-5 md:p-6"
        style={{ boxShadow: `inset 0 1px 0 rgba(${hexToRgb(topic.color)},0.12)` }}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/topics/${topic.slug}`}
            className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium transition-opacity hover:opacity-80"
            style={{ background: `rgba(${hexToRgb(topic.color)},0.14)`, color: topic.color }}
          >
            <TopicIcon name={topic.icon} size={12} />
            {topic.title}
          </Link>
          <TypeBadge type={resource.type} />
          <div className="flex items-center gap-1.5">
            <MarkerBadges markers={resource.markers} size={15} />
          </div>
        </div>

        <h1 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-[30px]">
          {resource.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          <span>{resource.source}</span>
          <span className="text-faint">·</span>
          <span>{formatDate(resource.dateRaw, resource.dateSort)}</span>
          {resource.group && (
            <>
              <span className="text-faint">·</span>
              <span className="text-faint">{resource.group}</span>
            </>
          )}
        </div>

        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-foreground/90">
          {resource.summary}
        </p>

        {resource.markers.unverified && (
          <p className="mt-3 flex items-center gap-2 rounded-md border border-border bg-surface/50 px-3 py-2 text-xs text-muted-foreground">
            <Sparkles size={13} className="text-faint" />
            This summary was reconstructed from the title and search — verify specifics against the source.
          </p>
        )}

        {/* Actions */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Button asChild>
            <a href={resource.url} target="_blank" rel="noreferrer">
              Open original <ExternalLink size={15} />
            </a>
          </Button>
          <StatusControl resourceId={id} topicSlug={resource.topicSlug} variant="full" />
          <Button
            variant={fav ? "secondary" : "outline"}
            onClick={() => toggleFavorite(id, resource.topicSlug)}
            className={fav ? "text-accent" : ""}
          >
            <Star size={15} className={fav ? "fill-accent" : ""} />
            {fav ? "Favorited" : "Favorite"}
          </Button>
          <Tooltip content={inReview ? "Already in your review queue" : "Schedule spaced-repetition reviews"}>
            <Button variant="outline" onClick={addReview} disabled={inReview}>
              <Repeat size={15} /> {inReview ? "In review" : "Add to review"}
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
        {/* Main column */}
        <div className="min-w-0 space-y-6">
          {/* Concepts */}
          {resource.keyConcepts.length > 0 && (
            <section>
              <h2 className="rail mb-2">Key concepts</h2>
              <div className="flex flex-wrap gap-1.5">
                {resource.keyConcepts.map((c) => (
                  <Link
                    key={c}
                    to={`/library?tag=${encodeURIComponent(c)}`}
                    className="rounded-md border border-border bg-surface-raised px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {c}
                  </Link>
                ))}
              </div>
            </section>
          )}

          <NoteEditor resourceId={id} topicSlug={resource.topicSlug} />
          <Highlights resourceId={id} topicSlug={resource.topicSlug} />
        </div>

        {/* Right rail */}
        <aside className="space-y-6">
          <section>
            <h2 className="rail mb-2">Your rating</h2>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(id, n === rating ? 0 : n)}
                  className="p-0.5 text-faint transition-colors hover:text-accent"
                  aria-label={`Rate ${n}`}
                >
                  <Star size={18} className={n <= rating ? "fill-accent text-accent" : ""} />
                </button>
              ))}
            </div>
          </section>

          {related.length > 0 && (
            <section>
              <h2 className="mb-2 flex items-center gap-1.5 rail">
                <Link2 size={12} /> Related
              </h2>
              <div className="space-y-1.5">
                {related.map((r) => {
                  const rt = topicBySlug.get(r.topicSlug);
                  return (
                    <Link
                      key={r.id}
                      to={`/resource/${r.id}`}
                      className="block rounded-lg border border-border bg-card p-2.5 transition-colors hover:border-primary/30"
                    >
                      <div className="flex items-center gap-1.5">
                        <TopicIcon name={rt?.icon ?? "Circle"} size={11} style={{ color: rt?.color }} />
                        <span className="font-mono text-2xs text-faint">{rt?.short}</span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs font-medium leading-snug text-foreground">
                        {r.title}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </aside>
      </div>
    </PageContainer>
  );
}
