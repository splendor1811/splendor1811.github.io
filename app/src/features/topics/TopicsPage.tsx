import { Link } from "react-router-dom";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { topics, resources } from "@/lib/content";
import { useProgressMap } from "@/hooks/personal";
import { hexToRgb } from "@/lib/utils";

export function TopicsPage() {
  const progress = useProgressMap();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Topics"
        title="Topics"
        description="Twelve threads of frontier AI research. Track your progress through each."
      />
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => {
          const list = resources.filter((r) => r.topicSlug === t.slug);
          const done = list.filter((r) => progress.get(r.id) === "completed").length;
          const pct = list.length ? Math.round((done / list.length) * 100) : 0;
          return (
            <Link
              key={t.slug}
              to={`/topics/${t.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:shadow-raised"
              style={{ ["--tc" as string]: t.color }}
            >
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.08] blur-xl transition-opacity group-hover:opacity-20"
                style={{ background: t.color }}
              />
              <div
                className="flex h-11 w-11 items-center justify-center rounded-lg"
                style={{ background: `rgba(${hexToRgb(t.color)},0.14)`, color: t.color }}
              >
                <TopicIcon name={t.icon} size={20} />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{t.title}</h3>
              <p className="mt-1.5 line-clamp-3 flex-1 text-[13px] leading-relaxed text-muted-foreground">
                {t.intro}
              </p>
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between font-mono text-2xs text-faint">
                  <span>
                    {done}/{list.length} done
                  </span>
                  <span style={{ color: t.color }}>{pct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-surface-raised">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: t.color }}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </PageContainer>
  );
}
