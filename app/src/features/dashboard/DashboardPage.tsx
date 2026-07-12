import { Link, useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Flame,
  CheckCircle2,
  BookOpen,
  PenLine,
  ArrowRight,
  Repeat,
  Sparkles,
  Star,
  FolderTree,
} from "lucide-react";
import { PageContainer } from "@/components/PageHeader";
import { ProgressRing } from "@/components/ProgressRing";
import { Heatmap } from "@/components/Heatmap";
import { TopicIcon } from "@/components/TopicIcon";
import { TypeBadge } from "@/components/ResourceMeta";
import { Button } from "@/components/ui/primitives";
import { db } from "@/lib/db";
import { resources, topics, getResource, topicBySlug } from "@/lib/content";
import { useProgressMap, useReviewCount } from "@/hooks/personal";
import { useRecentlyAdded, usePendingIds } from "@/hooks/publishing";
import { formatDistanceToNow } from "date-fns";
import { PlusCircle } from "lucide-react";
import { overallStats, computeStreak, dayKey } from "@/lib/stats";
import { hexToRgb } from "@/lib/utils";
import type { ActivityType } from "@/lib/db";

const GREETING = () => {
  const h = new Date().getHours();
  if (h < 5) return "Still up";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

const ACTIVITY_VERB: Record<ActivityType, string> = {
  started: "Started",
  completed: "Completed",
  noted: "Noted",
  highlighted: "Highlighted",
  favorited: "Favorited",
  unfavorited: "Unfavorited",
  reviewed: "Reviewed",
  added: "Added",
  edited: "Edited",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const progress = useProgressMap();
  const stats = overallStats(progress);
  const reviews = useReviewCount();
  const recentlyAdded = useRecentlyAdded(6);
  const pending = usePendingIds();

  const activity = useLiveQuery(() => db.activity.orderBy("at").reverse().limit(6).toArray(), [], []);
  const streak = useLiveQuery(
    async () => computeStreak((await db.activity.toArray()).map((a) => a.at)),
    [],
    0,
  );
  const counts = useLiveQuery(
    async () => ({
      notes: (await db.notes.toArray()).filter((n) => n.body.trim()).length,
      highlights: await db.highlights.count(),
    }),
    [],
    { notes: 0, highlights: 0 },
  );
  const todayCount = useLiveQuery(
    async () => (await db.activity.toArray()).filter((a) => dayKey(a.at) === dayKey(Date.now())).length,
    [],
    0,
  );

  const continueReading = resources.filter((r) => progress.get(r.id) === "reading").slice(0, 4);
  const upNext = resources
    .filter((r) => (progress.get(r.id) ?? "unread") === "unread" && (r.markers.startHere || r.markers.star))
    .slice(0, 4);

  const statCards = [
    { icon: Flame, label: "Day streak", value: streak, tone: "text-accent" },
    { icon: CheckCircle2, label: "Completed", value: stats.completed, tone: "text-success" },
    { icon: PenLine, label: "Notes", value: counts.notes, tone: "text-primary" },
    { icon: Star, label: "Highlights", value: counts.highlights, tone: "text-accent" },
  ];

  return (
    <PageContainer>
      {/* Hero instrument panel */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid-texture absolute inset-0 opacity-40" aria-hidden />
        <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div>
            <div className="rail mb-2">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
              {GREETING()}.
            </h1>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {todayCount > 0
                ? `${todayCount} ${todayCount === 1 ? "action" : "actions"} today — keep the momentum.`
                : "Pick up where you left off, or start something new."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button onClick={() => navigate("/library")}>
                Browse library <ArrowRight size={15} />
              </Button>
              {reviews.due > 0 && (
                <Button variant="secondary" onClick={() => navigate("/review")} className="text-accent">
                  <Repeat size={15} /> {reviews.due} to review
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ProgressRing pct={stats.pct} size={116} stroke={8}>
              <div className="text-center">
                <div className="font-display text-2xl font-semibold text-foreground">
                  {Math.round(stats.pct * 100)}%
                </div>
                <div className="rail">read</div>
              </div>
            </ProgressRing>
            <div className="space-y-1.5 font-mono text-xs">
              <Legend color="hsl(var(--success))" label="Completed" value={stats.completed} />
              <Legend color="hsl(var(--primary))" label="Reading" value={stats.reading} />
              <Legend color="hsl(var(--faint))" label="Unread" value={stats.unread} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="card-surface flex items-center gap-3 p-4">
            <s.icon size={20} className={s.tone} />
            <div>
              <div className="font-display text-xl font-semibold tabular-nums text-foreground">
                {s.value}
              </div>
              <div className="rail">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Continue + Up next */}
        <div className="space-y-4 lg:col-span-2">
          <Panel title="Continue reading" icon={BookOpen} action={{ to: "/library?status=reading", label: "All" }}>
            {continueReading.length ? (
              <div className="space-y-1.5">
                {continueReading.map((r) => (
                  <MiniResource key={r.id} id={r.id} />
                ))}
              </div>
            ) : (
              <Muted>Nothing in progress. Mark something as “Reading” to see it here.</Muted>
            )}
          </Panel>

          <Panel title="Recommended next" icon={Sparkles}>
            {upNext.length ? (
              <div className="space-y-1.5">
                {upNext.map((r) => (
                  <MiniResource key={r.id} id={r.id} />
                ))}
              </div>
            ) : (
              <Muted>You've started all the highlighted picks. Explore the library for more.</Muted>
            )}
          </Panel>

          <Panel title="Activity" icon={Flame}>
            <Heatmap />
          </Panel>
        </div>

        {/* Right column: recently added, topic progress, recent */}
        <div className="space-y-4">
          <Panel title="Recently added" icon={PlusCircle} action={{ to: "/library?sort=added", label: "Library" }}>
            {recentlyAdded.length ? (
              <div className="space-y-1">
                {recentlyAdded.map(({ resource, at }) => {
                  const t = topicBySlug.get(resource.topicSlug);
                  return (
                    <Link
                      key={resource.id}
                      to={`/resource/${resource.id}`}
                      className="group flex items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-surface-raised"
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
                        style={{ background: `rgba(${hexToRgb(t?.color ?? "#7C8CFF")},0.14)`, color: t?.color }}
                      >
                        <TopicIcon name={t?.icon ?? "Circle"} size={13} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5">
                          <span className="truncate text-sm text-foreground">{resource.title}</span>
                          {pending.has(resource.id) && (
                            <span className="shrink-0 rounded bg-primary/15 px-1 text-[10px] font-medium text-primary">
                              live soon
                            </span>
                          )}
                        </span>
                        <span className="block font-mono text-2xs text-faint">
                          {formatDistanceToNow(at, { addSuffix: true })}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-1">
                <p className="text-sm text-muted-foreground">Nothing added yet from the app.</p>
                <button
                  onClick={() => navigate("/add")}
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <PlusCircle size={13} /> Add your first resource
                </button>
              </div>
            )}
          </Panel>

          <Panel title="Topic progress" icon={FolderTree} action={{ to: "/topics", label: "All" }}>
            <div className="space-y-2.5">
              {topics.map((t) => {
                const list = resources.filter((r) => r.topicSlug === t.slug);
                const done = list.filter((r) => progress.get(r.id) === "completed").length;
                const pct = list.length ? done / list.length : 0;
                return (
                  <Link key={t.slug} to={`/topics/${t.slug}`} className="flex items-center gap-2.5 group">
                    <TopicIcon name={t.icon} size={13} style={{ color: t.color }} />
                    <span className="w-24 shrink-0 truncate text-xs text-muted-foreground group-hover:text-foreground">
                      {t.short}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-raised">
                      <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: t.color }} />
                    </div>
                    <span className="w-10 text-right font-mono text-2xs text-faint">
                      {done}/{list.length}
                    </span>
                  </Link>
                );
              })}
            </div>
          </Panel>

          <Panel title="Recent" icon={Flame}>
            {activity && activity.length ? (
              <div className="space-y-2.5">
                {activity.map((a) => {
                  const r = a.resourceId ? getResource(a.resourceId) : undefined;
                  return (
                    <Link
                      key={a.id}
                      to={r ? `/resource/${r.id}` : "/activity"}
                      className="flex items-baseline gap-2 text-xs"
                    >
                      <span className="font-mono text-faint">{ACTIVITY_VERB[a.type]}</span>
                      <span className="flex-1 truncate text-muted-foreground hover:text-foreground">
                        {r?.title ?? "—"}
                      </span>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <Muted>Your activity will appear here as you read and take notes.</Muted>
            )}
          </Panel>
        </div>
      </div>
    </PageContainer>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto tabular-nums text-foreground">{value}</span>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  action,
  children,
}: {
  title: string;
  icon: typeof Flame;
  action?: { to: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="card-surface p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={15} className="text-faint" />
        <h2 className="font-display text-sm font-semibold text-foreground">{title}</h2>
        {action && (
          <Link to={action.to} className="ml-auto text-2xs text-faint hover:text-muted-foreground">
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function MiniResource({ id }: { id: string }) {
  const r = getResource(id);
  if (!r) return null;
  const t = topicBySlug.get(r.topicSlug);
  return (
    <Link
      to={`/resource/${r.id}`}
      className="flex items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-surface-raised"
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
        style={{ background: `rgba(${hexToRgb(t?.color ?? "#7C8CFF")},0.14)`, color: t?.color }}
      >
        <TopicIcon name={t?.icon ?? "Circle"} size={13} />
      </span>
      <span className="flex-1 truncate text-sm text-foreground">{r.title}</span>
      <TypeBadge type={r.type} className="hidden sm:inline-flex" />
    </Link>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p className="py-2 text-sm text-muted-foreground">{children}</p>;
}
