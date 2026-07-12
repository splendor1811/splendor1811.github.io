import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Activity as ActivityIcon, Flame } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { Heatmap } from "@/components/Heatmap";
import { EmptyState } from "@/components/EmptyState";
import { TopicIcon } from "@/components/TopicIcon";
import { db, type ActivityRow, type ActivityType } from "@/lib/db";
import { getResource, topicBySlug } from "@/lib/content";
import { computeStreak } from "@/lib/stats";

const VERB: Record<ActivityType, { label: string; color: string }> = {
  started: { label: "Started reading", color: "text-primary" },
  completed: { label: "Completed", color: "text-success" },
  noted: { label: "Wrote a note on", color: "text-primary" },
  highlighted: { label: "Highlighted", color: "text-accent" },
  favorited: { label: "Favorited", color: "text-accent" },
  unfavorited: { label: "Unfavorited", color: "text-faint" },
  reviewed: { label: "Reviewed", color: "text-success" },
  added: { label: "Added", color: "text-primary" },
  edited: { label: "Edited", color: "text-primary" },
};

function dayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const yest = new Date();
  yest.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yest.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export function ActivityPage() {
  const rows = useLiveQuery(() => db.activity.orderBy("at").reverse().toArray(), [], []);
  const streak = useLiveQuery(
    async () => computeStreak((await db.activity.toArray()).map((a) => a.at)),
    [],
    0,
  );

  const groups = new Map<string, ActivityRow[]>();
  for (const r of rows ?? []) {
    const key = dayLabel(r.at);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Activity"
        title="Learning activity"
        description="Every action you take, on a timeline. Read consistently to grow your streak."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
        <div className="card-surface p-5">
          <div className="rail mb-3">Last 26 weeks</div>
          <Heatmap weeks={26} />
        </div>
        <div className="card-surface flex items-center gap-4 p-5">
          <Flame size={26} className="text-accent" />
          <div>
            <div className="font-display text-3xl font-semibold text-foreground">{streak}</div>
            <div className="rail">day streak</div>
          </div>
        </div>
      </div>

      {rows && rows.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={ActivityIcon}
            title="No activity yet"
            description="Mark a resource as reading, take a note, or add a highlight to start your history."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {[...groups.entries()].map(([day, items]) => (
            <section key={day}>
              <div className="rail mb-2">{day}</div>
              <ol className="relative space-y-0.5 border-l border-border pl-4">
                {items.map((a) => {
                  const r = a.resourceId ? getResource(a.resourceId) : undefined;
                  const t = r ? topicBySlug.get(r.topicSlug) : undefined;
                  const v = VERB[a.type];
                  return (
                    <li key={a.id} className="relative py-1.5">
                      <span className="absolute -left-[21px] top-3 h-1.5 w-1.5 rounded-full bg-border" />
                      <div className="flex items-baseline gap-2 text-sm">
                        <span className={`font-medium ${v.color}`}>{v.label}</span>
                        {r ? (
                          <Link to={`/resource/${r.id}`} className="flex-1 truncate text-muted-foreground hover:text-foreground">
                            {r.title}
                          </Link>
                        ) : (
                          <span className="flex-1 text-faint">a resource</span>
                        )}
                        {t && <TopicIcon name={t.icon} size={12} style={{ color: t.color }} />}
                        <span className="shrink-0 font-mono text-2xs text-faint">
                          {new Date(a.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
