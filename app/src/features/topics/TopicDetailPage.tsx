import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Route } from "lucide-react";
import { PageContainer } from "@/components/PageHeader";
import { ResourceRow } from "@/components/ResourceRow";
import { TopicIcon } from "@/components/TopicIcon";
import { Button } from "@/components/ui/primitives";
import { getTopic, resourcesByTopic, topics } from "@/lib/content";
import { useProgressMap } from "@/hooks/personal";
import { hexToRgb } from "@/lib/utils";

export function TopicDetailPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const topic = getTopic(slug);
  const progress = useProgressMap();

  if (!topic) {
    return (
      <PageContainer>
        <p className="text-muted-foreground">Topic not found.</p>
      </PageContainer>
    );
  }

  const list = resourcesByTopic(slug);
  const done = list.filter((r) => progress.get(r.id) === "completed").length;
  const pct = list.length ? Math.round((done / list.length) * 100) : 0;
  const related = topic.relatedSlugs.map((s) => topics.find((t) => t.slug === s)).filter(Boolean);

  // Group resources by their ### group, preserving document order.
  const grouped = new Map<string, typeof list>();
  for (const g of topic.groups) grouped.set(g, []);
  for (const r of list) {
    const key = r.group || "Resources";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(r);
  }

  return (
    <PageContainer>
      <button
        onClick={() => navigate("/topics")}
        className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={15} /> All topics
      </button>

      {/* Hero */}
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-card p-6"
        style={{ ["--tc" as string]: topic.color }}
      >
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-[0.1] blur-2xl"
          style={{ background: topic.color }}
        />
        <div className="flex items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `rgba(${hexToRgb(topic.color)},0.16)`, color: topic.color }}
          >
            <TopicIcon name={topic.icon} size={26} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {topic.title}
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {topic.intro}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-surface-raised">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: topic.color }} />
            </div>
            <span className="font-mono text-xs text-muted-foreground">
              {done}/{list.length} · {pct}%
            </span>
          </div>
          {topic.readingOrder && (
            <Button variant="secondary" size="sm" asChild>
              <Link to="/roadmap">
                <Route size={13} /> Reading order
              </Link>
            </Button>
          )}
        </div>

        {topic.readingOrder && (
          <div className="mt-4 rounded-lg border border-border bg-surface/50 p-3">
            <div className="rail mb-1">Suggested reading order</div>
            <p className="text-sm text-foreground/90">{topic.readingOrder}</p>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="rail">Related</span>
            {related.map((r) => (
              <Link
                key={r!.slug}
                to={`/topics/${r!.slug}`}
                className="flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-surface-raised"
              >
                <TopicIcon name={r!.icon} size={11} style={{ color: r!.color }} />
                {r!.short}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Grouped resources */}
      <div className="mt-6 space-y-6">
        {[...grouped.entries()]
          .filter(([, rs]) => rs.length)
          .map(([group, rs]) => (
            <section key={group}>
              <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                {group}
                <span className="font-mono text-2xs font-normal text-faint">{rs.length}</span>
              </h2>
              <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
                {rs.map((r) => (
                  <ResourceRow key={r.id} resource={r} />
                ))}
              </div>
            </section>
          ))}
      </div>
    </PageContainer>
  );
}
