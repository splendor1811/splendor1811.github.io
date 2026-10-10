import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Circle, BookOpen } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { TypeBadge } from "@/components/ResourceMeta";
import { topics, resourcesByTopic } from "@/lib/content";
import { useProgressMap } from "@/hooks/personal";
import { cn, hexToRgb } from "@/lib/utils";
import { resolveTopicSlug } from "@/data/topics";

export function RoadmapPage() {
  const progress = useProgressMap();
  const [params, setParams] = useSearchParams();
  const requested = resolveTopicSlug(params.get("topic") ?? "");
  const active = topics.some(t => t.slug === requested) ? requested : topics[0].slug;
  const setActive = (slug: string) => setParams({topic: slug});
  const topic = topics.find((t) => t.slug === active)!;
  const steps = resourcesByTopic(active);
  const done = steps.filter((r) => progress.get(r.id) === "completed").length;

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Roadmap"
        title="Learning paths"
        description="Follow a topic end-to-end in a sensible order. Each track is a sequence through its resources."
      />

      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Track picker */}
        <nav className="flex min-w-0 gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Choose a learning path">
          {topics.map((t) => {
            const list = resourcesByTopic(t.slug);
            const d = list.filter((r) => progress.get(r.id) === "completed").length;
            const activeT = t.slug === active;
            return (
              <button
                key={t.slug}
                onClick={() => setActive(t.slug)}
                className={cn(
                  "flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  activeT ? "text-foreground" : "border-border text-muted-foreground hover:bg-surface-raised",
                )}
                style={activeT ? { borderColor: `rgba(${hexToRgb(t.color)},0.5)`, background: `rgba(${hexToRgb(t.color)},0.1)` } : undefined}
              >
                <TopicIcon name={t.icon} size={14} style={{ color: t.color }} />
                <span className="flex-1 truncate lg:w-24">{t.short}</span>
                <span className="font-mono text-2xs text-faint">
                  {d}/{list.length}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Track steps */}
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg"
              style={{ background: `rgba(${hexToRgb(topic.color)},0.14)`, color: topic.color }}
            >
              <TopicIcon name={topic.icon} size={19} />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">{topic.title}</h2>
              <p className="font-mono text-2xs text-faint">
                {done} of {steps.length} completed
              </p>
            </div>
          </div>

          {topic.readingOrder && (
            <div className="mb-5 flex gap-2.5 rounded-lg border border-border bg-surface/50 p-3">
              <BookOpen size={15} className="mt-0.5 shrink-0 text-faint" />
              <p className="min-w-0 text-sm leading-relaxed text-muted-foreground">
                <span className="text-foreground">Suggested order — </span>
                {topic.readingOrder}
              </p>
            </div>
          )}

          <ol className="relative space-y-2 border-l-2 border-border pl-6">
            {steps.map((r, i) => {
              const completed = progress.get(r.id) === "completed";
              const reading = progress.get(r.id) === "reading";
              return (
                <li key={r.id} className="relative">
                  <span
                    className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-background"
                    style={{ background: completed ? topic.color : "hsl(var(--surface-raised))" }}
                  >
                    {completed ? (
                      <CheckCircle2 size={16} className="text-background" />
                    ) : (
                      <Circle size={9} className={reading ? "text-primary" : "text-faint"} />
                    )}
                  </span>
                  <Link
                    to={`/resource/${r.id}`}
                    className={cn(
                      "flex min-h-14 min-w-0 items-center gap-2 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:border-primary/30",
                      completed && "opacity-70",
                    )}
                  >
                    <span className="font-mono text-2xs text-faint">{String(i + 1).padStart(2, "0")}</span>
                    <span className="min-w-0 flex-1 text-sm font-medium leading-relaxed text-foreground">{r.title}</span>
                    <TypeBadge type={r.type} className="hidden sm:inline-flex" />
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </PageContainer>
  );
}
