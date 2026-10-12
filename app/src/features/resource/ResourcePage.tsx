import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { ArrowLeft, ArrowUpRight, BookOpen, CircleAlert, ExternalLink, Pencil, Repeat, Route, Star } from "lucide-react";
import { PageContainer } from "@/components/PageHeader";
import { TypeBadge } from "@/components/ResourceMeta";
import type { Resource } from "@/data/schema";
import { StatusControl } from "@/components/StatusControl";
import { TopicIcon } from "@/components/TopicIcon";
import { Button } from "@/components/ui/primitives";
import { NoteEditor } from "./NoteEditor";
import { Highlights } from "./Highlights";
import { EditResourceDialog } from "./EditResourceDialog";
import { topicBySlug, relatedResources } from "@/lib/content";
import { useIsFavorite } from "@/hooks/personal";
import { useResources, usePublishingConfigured, usePendingIds } from "@/hooks/publishing";
import { db, toggleFavorite, setRating } from "@/lib/db";
import { newReview } from "@/lib/srs";
import { cn, formatDate } from "@/lib/utils";
import { formatResourceDate, isHttpUrl, isUnknownResourceDate, parseResourceDate } from "@/lib/resource-fields";

const notesControlClasses =
  "min-w-0 [&_h2]:text-lg [&_textarea]:text-base [&_textarea]:leading-relaxed [&_button]:inline-flex [&_button]:min-h-11 [&_button]:min-w-11 [&_button]:items-center [&_button]:justify-center [&_button.rounded-full]:scale-100 [&_button.rounded-full]:bg-clip-content [&_button.rounded-full]:p-3 [&_li_button]:opacity-100";

export function ResourcePage() {
  const { id = "" } = useParams();
  const resources = useResources();
  const resource = resources.find((r) => r.id === id);
  const publishingConfigured = usePublishingConfigured();
  const pending = usePendingIds().has(id);
  const [editing, setEditing] = useState(false);
  const [addingReview, setAddingReview] = useState(false);
  const fav = useIsFavorite(id);
  const progressRow = useLiveQuery(() => db.progress.get(id), [id]);
  const inReview = useLiveQuery(() => db.reviews.get(id).then(Boolean), [id], false);

  if (!resource) {
    return (
      <PageContainer className="max-w-4xl">
        <div className="py-16 text-center">
          <BookOpen size={32} className="mx-auto text-muted-foreground" aria-hidden="true" />
          <h1 className="mt-5 font-display text-2xl font-semibold text-foreground">Resource not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">Browse your library to find the resource you’re looking for.</p>
          <Button variant="secondary" className="mt-6" asChild><Link to="/library">Back to library</Link></Button>
        </div>
      </PageContainer>
    );
  }

  const topic = topicBySlug.get(resource.topicSlug);
  const related = relatedResources(resource, 5);
  const rating = progressRow?.rating ?? 0;
  const hasSource = Boolean(resource.source.trim() && !/^(unknown|—)$/i.test(resource.source.trim()));
  const hasDate = !isUnknownResourceDate(resource.dateRaw);
  const sourceUrl = isHttpUrl(resource.url) ? new URL(resource.url) : null;
  const dateParts = parseResourceDate(resource.dateRaw);

  async function addReview() {
    if (addingReview || inReview) return;
    setAddingReview(true);
    try {
      await db.reviews.put(newReview(id));
      toast.success("Added to review queue", { description: "You'll be reminded to revisit this." });
    } catch {
      toast.error("Couldn't add this resource to review", { description: "Try again in a moment." });
    } finally {
      setAddingReview(false);
    }
  }

  return (
    <PageContainer className="max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <Link to="/library" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft size={17} aria-hidden="true" />All resources
        </Link>
        {publishingConfigured && (
          <Button variant="outline" onClick={() => setEditing(true)} aria-label="Edit resource">
            <Pencil size={16} aria-hidden="true" />Edit details
          </Button>
        )}
      </div>

      <article aria-labelledby="resource-title">
        <header className="border-b border-border pb-7">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <TypeBadge type={resource.type} />
            {topic && <Link to={`/topics/${topic.slug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"><TopicIcon name={topic.icon} size={15} />{topic.title}</Link>}
            {resource.markers.star && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Star size={14} aria-hidden="true" />Must-read</span>}
            {resource.markers.startHere && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><Route size={14} aria-hidden="true" />Recommended starting point</span>}
            {resource.markers.unverified && <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"><CircleAlert size={14} aria-hidden="true" />Unverified summary</span>}
            {pending && <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">Update publishing</span>}
          </div>

          <h1 id="resource-title" className="mt-4 max-w-[35ch] break-words font-display text-[clamp(1.75rem,3vw,2.625rem)] font-semibold leading-[1.22] tracking-tight text-foreground">{resource.title}</h1>

          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4">
            {(hasSource || sourceUrl) && (
              <div className="min-w-0 max-w-full">
                <dt className="text-xs text-muted-foreground">Source / author</dt>
                {hasSource && <dd className="mt-1 break-words text-sm font-medium text-foreground">{resource.source}</dd>}
                {sourceUrl && <dd><a href={resource.url} target="_blank" rel="noreferrer" aria-label={`Open ${sourceUrl.hostname.replace(/^www\./, "")} in a new tab`} className="inline-flex min-h-11 max-w-full items-center gap-1.5 text-sm text-primary hover:underline"><span className="break-all">{sourceUrl.hostname.replace(/^www\./, "")}</span><ArrowUpRight size={14} aria-hidden="true" /></a></dd>}
              </div>
            )}
            {hasDate && (
              <div>
                <dt className="text-xs text-muted-foreground">Published</dt>
                <dd className="mt-1 text-sm font-medium text-foreground"><time dateTime={dateParts?.month ? resource.dateRaw.trim() : undefined}>{formatDate(resource.dateRaw, resource.dateSort)}</time></dd>
              </div>
            )}
          </dl>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {sourceUrl && <Button asChild><a href={resource.url} target="_blank" rel="noreferrer" aria-label="Open original resource in a new tab">Open original<ExternalLink size={16} aria-hidden="true" /></a></Button>}
            <StatusControl resourceId={id} topicSlug={resource.topicSlug} variant="full" />
            <Button variant={fav ? "secondary" : "outline"} aria-pressed={fav} onClick={() => toggleFavorite(id, resource.topicSlug)} className={fav ? "border-primary/30 text-primary" : ""}>
              <Star size={16} className={fav ? "fill-primary/20" : ""} aria-hidden="true" />{fav ? "Favorited" : "Favorite"}
            </Button>
            <Button variant="outline" onClick={addReview} disabled={inReview || addingReview}>
              <Repeat size={16} aria-hidden="true" />{inReview ? "In review queue" : addingReview ? "Adding…" : "Add to review"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Done, favorites and review progress are saved only in this browser profile, not to the public library.</p>
        </header>

        <div className="mt-8 grid min-w-0 gap-10 xl:grid-cols-[minmax(0,1fr)_280px] xl:gap-12">
          <div className="min-w-0 space-y-9">
            <section aria-labelledby="resource-summary-heading">
              <h2 id="resource-summary-heading" className="font-display text-lg font-semibold text-foreground">At a glance</h2>
              <p className="mt-3 max-w-[70ch] whitespace-pre-wrap break-words text-base leading-8 text-foreground/90 sm:text-[17px]">{resource.summary}</p>
              {resource.markers.unverified && (
                <div className="mt-5 flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3.5" role="note" aria-label="Unverified summary">
                  <CircleAlert size={19} className="mt-0.5 text-muted-foreground" aria-hidden="true" />
                  <div><p className="text-sm font-semibold text-foreground">Unverified summary</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Check the original source before relying on these details.</p></div>
                </div>
              )}
            </section>

            {resource.keyConcepts.length > 0 && (
              <section aria-labelledby="resource-concepts-heading">
                <h2 id="resource-concepts-heading" className="font-display text-lg font-semibold text-foreground">Key concepts</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resource.keyConcepts.map((concept, index) => <Link key={`${concept}-${index}`} to={`/library?tag=${encodeURIComponent(concept)}`} className="inline-flex min-h-11 max-w-full items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"><span className="break-words">{concept}</span></Link>)}
                </div>
              </section>
            )}

            <div className={cn(notesControlClasses, "border-t border-border pt-7 [&_textarea]:min-h-[200px]")}>
              <NoteEditor key={id} resourceId={id} topicSlug={resource.topicSlug} />
            </div>
            <div className={notesControlClasses}>
              <Highlights key={id} resourceId={id} topicSlug={resource.topicSlug} />
            </div>
          </div>

          <aside className="min-w-0 space-y-8 border-t border-border pt-7 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0" aria-label="Your reading and related resources">
            {resource.provenance && <SourceRecord provenance={resource.provenance} resourceUrl={resource.url} />}
            <section aria-labelledby="resource-rating-heading">
              <div className="flex items-baseline justify-between gap-2">
                <h2 id="resource-rating-heading" className="font-display text-lg font-semibold text-foreground">Your rating</h2>
                {rating > 0 && <span className="text-xs text-muted-foreground" aria-live="polite">{rating} of 5</span>}
              </div>
              <div className="mt-2 flex items-center gap-1" role="group" aria-label="Rate this resource">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(id, n === rating ? 0 : n)} aria-label={n === rating ? `Clear ${n}-star rating` : `Rate ${n} out of 5`} aria-pressed={n === rating} className={cn("flex h-11 w-11 items-center justify-center rounded-md transition-colors hover:bg-primary/10 hover:text-primary", n <= rating ? "text-primary" : "text-muted-foreground")}>
                    <Star size={21} className={n <= rating ? "fill-primary/20" : ""} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{rating > 0 ? "Select your rating again to clear it." : "How useful is this resource to you?"}</p>
            </section>

            {resource.group && <section className="border-t border-border pt-6" aria-labelledby="resource-group-heading"><h2 id="resource-group-heading" className="text-xs font-medium text-muted-foreground">In this collection</h2><p className="mt-2 text-sm font-medium leading-relaxed text-foreground">{resource.group}</p></section>}

            {related.length > 0 && (
              <section className="border-t border-border pt-6" aria-labelledby="resource-related-heading">
                <h2 id="resource-related-heading" className="font-display text-lg font-semibold text-foreground">Keep exploring</h2>
                <p className="mt-1 text-xs text-muted-foreground">Connections from your library</p>
                <ul className="mt-3 divide-y divide-border">
                  {related.map((relatedResource) => {
                    const relatedTopic = topicBySlug.get(relatedResource.topicSlug);
                    return (
                      <li key={relatedResource.id}>
                        <Link to={`/resource/${relatedResource.id}`} className="group block min-h-11 rounded-md py-4 transition-colors hover:text-primary">
                          <div className="flex items-start justify-between gap-3"><h3 className="min-w-0 break-words text-sm font-semibold leading-relaxed text-foreground transition-colors group-hover:text-primary">{relatedResource.title}</h3><ArrowUpRight size={16} className="mt-1 text-muted-foreground group-hover:text-primary" aria-hidden="true" /></div>
                          <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs leading-relaxed text-muted-foreground"><span>{relatedResource.type}</span>{relatedTopic && <><span aria-hidden="true">·</span><span>{relatedTopic.title}</span></>}</p>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </article>

      {publishingConfigured && <EditResourceDialog resource={resource} open={editing} onOpenChange={setEditing} />}
    </PageContainer>
  );
}

function formatRecordDate(value: string): string {
  if (parseResourceDate(value)) return formatResourceDate(value);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function SourceRecord({ provenance, resourceUrl }: { provenance: NonNullable<Resource["provenance"]>; resourceUrl: string }) {
  const originLabels = { edge: "Saved from Edge", x: "Discovered on X", manual: "Saved manually", lilianweng: "Lil’Log" };
  const originalUrl = provenance.sourceUrl || resourceUrl;
  const sourceUrl = isHttpUrl(originalUrl) ? new URL(originalUrl) : null;
  const discoveryLinks = (provenance.discoveryLinks ?? []).filter(link => isHttpUrl(link.url));
  const domains = [...new Set(provenance.relatedDomains ?? [])].flatMap((slug) => {
    const domain = topicBySlug.get(slug);
    return domain ? [domain] : [];
  });

  return (
    <section className="border-b border-border pb-7" aria-labelledby="resource-source-record-heading">
      <h2 id="resource-source-record-heading" className="font-display text-lg font-semibold text-foreground">Source record</h2>
      {provenance.origin && <p className="mt-2 text-sm text-muted-foreground">{originLabels[provenance.origin]}</p>}
      {provenance.verification && <p className="mt-3 text-sm font-medium text-foreground">{provenance.verification === "primary" ? "Primary source checked" : "Metadata checked; content unverified"}</p>}
      {(provenance.capturedAt || provenance.verifiedAt) && (
        <dl className="mt-3 space-y-2 text-xs">
          {provenance.capturedAt && <div className="flex flex-wrap justify-between gap-x-3 gap-y-1"><dt className="text-muted-foreground">Saved on</dt><dd className="font-medium text-foreground"><time dateTime={provenance.capturedAt}>{formatRecordDate(provenance.capturedAt)}</time></dd></div>}
          {provenance.verifiedAt && <div className="flex flex-wrap justify-between gap-x-3 gap-y-1"><dt className="text-muted-foreground">Verified on</dt><dd className="font-medium text-foreground"><time dateTime={provenance.verifiedAt}>{formatRecordDate(provenance.verifiedAt)}</time></dd></div>}
        </dl>
      )}
      {sourceUrl && <a href={originalUrl} target="_blank" rel="noreferrer" aria-label={`Open primary source on ${sourceUrl.hostname.replace(/^www\./, "")} in a new tab`} className="mt-3 inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-medium text-primary hover:underline"><span className="min-w-0 break-all">Primary source</span><ArrowUpRight size={15} aria-hidden="true" /></a>}
      {provenance.note && <p className="mt-2 break-words text-xs leading-relaxed text-muted-foreground">{provenance.note}</p>}
      {discoveryLinks.length > 0 && <div className="mt-4">
        <h3 className="text-xs font-medium text-muted-foreground">Discovery trail</h3>
        <div className="mt-1 flex flex-col items-start">{discoveryLinks.map((link,index) => <a key={`${link.url}:${index}`} href={link.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 max-w-full items-center gap-2 text-sm text-primary hover:underline"><span className="min-w-0 break-words">{link.label}</span><ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /></a>)}</div>
      </div>}
      {domains.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-medium text-muted-foreground">Also connects to</h3>
          <div className="mt-1 flex flex-wrap gap-x-3">{domains.map((domain) => <Link key={domain.slug} to={`/topics/${domain.slug}`} className="inline-flex min-h-11 items-center text-sm text-primary hover:underline">{domain.title}</Link>)}</div>
        </div>
      )}
    </section>
  );
}
