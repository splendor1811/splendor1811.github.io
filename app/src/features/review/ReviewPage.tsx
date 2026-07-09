import { useState } from "react";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Repeat, Check, PartyPopper, Eye } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/primitives";
import { TypeBadge } from "@/components/ResourceMeta";
import { TopicIcon } from "@/components/TopicIcon";
import { db, logActivity } from "@/lib/db";
import { schedule, isDue, type Grade } from "@/lib/srs";
import { getResource, topicBySlug } from "@/lib/content";
import { hexToRgb } from "@/lib/utils";

const GRADES: { key: Grade; label: string; className: string }[] = [
  { key: "forgot", label: "Forgot", className: "border-destructive/30 text-destructive hover:bg-destructive/10" },
  { key: "fuzzy", label: "Fuzzy", className: "border-accent/30 text-accent hover:bg-accent/10" },
  { key: "remember", label: "Remembered", className: "border-success/30 text-success hover:bg-success/10" },
];

export function ReviewPage() {
  const due = useLiveQuery(async () => (await db.reviews.toArray()).filter((r) => isDue(r)), []);
  const totalReviews = useLiveQuery(() => db.reviews.count(), [], 0);
  const [revealed, setRevealed] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  const current = due?.[0];
  const resource = current ? getResource(current.resourceId) : undefined;
  const note = useLiveQuery(() => (current ? db.notes.get(current.resourceId) : undefined), [current?.resourceId]);

  async function grade(g: Grade) {
    if (!current) return;
    const next = schedule(current, g);
    await db.reviews.put({ ...current, ...next, lastReviewed: Date.now() });
    await logActivity({ type: "reviewed", resourceId: current.resourceId });
    setRevealed(false);
    setDoneCount((c) => c + 1);
  }

  if (totalReviews === 0) {
    return (
      <PageContainer>
        <PageHeader eyebrow="Review" title="Spaced repetition" />
        <div className="mt-6">
          <EmptyState
            icon={Repeat}
            title="Nothing to review yet"
            description="Add resources to your review queue from any resource page to revisit them on a spaced schedule."
            action={
              <Button asChild>
                <Link to="/library">Browse library</Link>
              </Button>
            }
          />
        </div>
      </PageContainer>
    );
  }

  if (!current || !resource) {
    return (
      <PageContainer>
        <PageHeader eyebrow="Review" title="Spaced repetition" />
        <div className="mt-6">
          <EmptyState
            icon={PartyPopper}
            title={doneCount > 0 ? "All caught up!" : "Nothing due right now"}
            description={
              doneCount > 0
                ? `You reviewed ${doneCount} ${doneCount === 1 ? "item" : "items"}. Come back later for the next batch.`
                : "Your next reviews are scheduled for the future. Great consistency."
            }
          />
        </div>
      </PageContainer>
    );
  }

  const topic = topicBySlug.get(resource.topicSlug)!;

  return (
    <PageContainer className="max-w-3xl">
      <PageHeader
        eyebrow="Review"
        title="Spaced repetition"
        description="Recall before you reveal. Grade honestly — the schedule adapts."
        actions={
          <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
            {due.length} due
          </span>
        }
      />

      <div
        className="mt-6 rounded-2xl border border-border bg-card p-6 md:p-8"
        style={{ boxShadow: `inset 0 1px 0 rgba(${hexToRgb(topic.color)},0.14)` }}
      >
        <div className="flex items-center gap-2">
          <span
            className="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
            style={{ background: `rgba(${hexToRgb(topic.color)},0.14)`, color: topic.color }}
          >
            <TopicIcon name={topic.icon} size={12} />
            {topic.short}
          </span>
          <TypeBadge type={resource.type} />
        </div>

        <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-foreground">
          {resource.title}
        </h2>
        <p className="mt-1 font-mono text-xs text-faint">{resource.source}</p>

        {!revealed ? (
          <div className="mt-8 flex flex-col items-center gap-4 py-6">
            <p className="text-sm text-muted-foreground">What do you remember about this?</p>
            <Button variant="secondary" onClick={() => setRevealed(true)}>
              <Eye size={15} /> Reveal summary & notes
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <div className="rail mb-1">Summary</div>
              <p className="text-[15px] leading-relaxed text-foreground/90">{resource.summary}</p>
            </div>
            {note?.body?.trim() && (
              <div>
                <div className="rail mb-1">Your notes</div>
                <div className="prose-notes rounded-lg border border-border bg-surface/50 p-3">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{note.body}</ReactMarkdown>
                </div>
              </div>
            )}
            <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row">
              {GRADES.map((g) => (
                <button
                  key={g.key}
                  onClick={() => grade(g.key)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors ${g.className}`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {doneCount > 0 && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
          <Check size={14} className="text-success" /> {doneCount} reviewed this session
        </p>
      )}
    </PageContainer>
  );
}
