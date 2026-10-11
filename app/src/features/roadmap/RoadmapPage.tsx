import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, Check, Compass, Layers3 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { TypeBadge } from "@/components/ResourceMeta";
import { topics, resourcesByTopic, resourceById } from "@/lib/content";
import type { Resource, Topic } from "@/data/schema";
import { useProgressMap } from "@/hooks/personal";
import { cn, hexToRgb } from "@/lib/utils";
import { resolveTopicSlug } from "@/data/topics";
import { LEARNING_PATHS, STAGE_COLORS } from "./paths";

interface DisplayStage {
  id: string;
  title: string;
  purpose: string;
  checkpoint: string;
  color: string;
  resources: Resource[];
}

function stagesFor(topic: Topic): DisplayStage[] {
  const path = LEARNING_PATHS[topic.slug];
  if (path) return path.stages.map(stage => ({
    ...stage,
    resources: stage.resourceIds.map(id => resourceById.get(id)).filter((item): item is Resource => Boolean(item)),
  }));
  const collection = resourcesByTopic(topic.slug);
  return topic.groups.map((group, index) => ({
    id: `group-${index}`,
    title: group,
    purpose: "",
    checkpoint: "",
    color: STAGE_COLORS[index % STAGE_COLORS.length],
    resources: collection.filter(resource => resource.group === group),
  })).filter(stage => stage.resources.length > 0);
}

function countCompleted(resources: readonly Resource[], progress: Map<string, string>) {
  return resources.filter(resource => progress.get(resource.id) === "completed").length;
}

function TrackButton({ topic, active, completed, total, onClick }: {
  topic: Topic;
  active: boolean;
  completed: number;
  total: number;
  onClick: () => void;
}) {
  return <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      "flex min-h-12 min-w-[150px] shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors lg:w-full lg:min-w-0",
      active ? "border-primary/40 bg-primary/10 text-foreground" : "border-border bg-surface/60 text-muted-foreground hover:border-primary/30 hover:bg-surface-raised",
    )}
  >
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `rgba(${hexToRgb(topic.color)},0.16)`, color: topic.color }}>
      <TopicIcon name={topic.icon} size={17} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-medium">{topic.short}</span>
      <span className="block text-xs text-faint">{LEARNING_PATHS[topic.slug] ? "Guided path" : "Library outline"}</span>
    </span>
    <span className="shrink-0 font-mono text-xs tabular-nums text-faint">{completed}/{total}</span>
  </button>;
}

function ResourceRow({ resource, index, status }: { resource: Resource; index: number; status?: string }) {
  const completed = status === "completed";
  return <li>
    <Link to={`/resource/${resource.id}`} className="group flex min-h-16 min-w-0 items-center gap-3 rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:border-primary/40 hover:bg-surface-raised sm:px-4">
      <span className="w-5 shrink-0 text-center font-mono text-xs tabular-nums text-faint">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold leading-snug text-foreground group-hover:text-primary">{resource.title}</span>
        <span className="mt-1 block truncate text-xs text-muted-foreground">{resource.source}</span>
      </span>
      <TypeBadge type={resource.type} className="hidden md:inline-flex" />
      {completed ? <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-success"><Check size={15} aria-hidden="true" /><span className="hidden sm:inline">Done</span><span className="sr-only sm:hidden">Completed</span></span>
        : status === "reading" ? <span className="shrink-0 text-xs font-medium text-primary">Reading</span>
          : <ArrowRight size={16} className="shrink-0 text-faint transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
    </Link>
  </li>;
}

function StageSection({ stage, index, progress, guided }: { stage: DisplayStage; index: number; progress: Map<string, string>; guided: boolean }) {
  const completed = countCompleted(stage.resources, progress);
  return <section id={`stage-${stage.id}`} aria-labelledby={`stage-heading-${stage.id}`} className="scroll-mt-24">
    <div className="relative border-l-[3px] pb-9 pl-5 sm:pl-7" style={{ borderColor: stage.color }}>
      <span className="absolute -left-[22px] top-0 flex h-10 w-10 items-center justify-center rounded-xl border-4 border-background font-mono text-xs font-bold text-white shadow-sm" style={{ backgroundColor: stage.color }} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="min-w-0 rounded-xl border px-4 py-4 sm:px-5" style={{ borderColor: `rgba(${hexToRgb(stage.color)},0.32)`, backgroundColor: `rgba(${hexToRgb(stage.color)},0.09)` }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-xs font-semibold tracking-wide text-muted-foreground">{guided ? "STAGE" : "COLLECTION"} {String(index + 1).padStart(2, "0")}</span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">{completed}/{stage.resources.length} completed</span>
        </div>
        <h3 id={`stage-heading-${stage.id}`} className="mt-1 font-display text-xl font-semibold leading-tight text-foreground">{stage.title}</h3>
        {stage.purpose && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{stage.purpose}</p>}
      </div>
      <ol className="mt-3 space-y-2" aria-label={`${stage.title} resources`}>
        {stage.resources.map((resource, resourceIndex) => <ResourceRow key={resource.id} resource={resource} index={resourceIndex} status={progress.get(resource.id)} />)}
      </ol>
      {stage.checkpoint && <div className="mt-3 flex gap-2.5 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm leading-relaxed text-muted-foreground">
        <Compass size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <p><span className="font-semibold text-foreground">Before moving on: </span>{stage.checkpoint}</p>
      </div>}
    </div>
  </section>;
}

export function RoadmapPage() {
  const progress = useProgressMap();
  const [params, setParams] = useSearchParams();
  const requested = resolveTopicSlug(params.get("topic") ?? "");
  const active = topics.some(topic => topic.slug === requested) ? requested : "post-training-alignment";
  const topic = topics.find(item => item.slug === active)!;
  const path = LEARNING_PATHS[active];
  const stages = stagesFor(topic);
  const allResources = stages.flatMap(stage => stage.resources);
  const completed = countCompleted(allResources, progress);
  const guidedTopics = topics.filter(item => LEARNING_PATHS[item.slug]);
  const outlineTopics = topics.filter(item => !LEARNING_PATHS[item.slug]);

  function chooseTopic(slug: string) {
    setParams({ topic: slug });
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  return <PageContainer>
    <PageHeader eyebrow="Research Atlas / Roadmap" title="Learning paths" description="A considered route through the library. Post-Training and RL/Reasoning now have guided stages; the other domains retain their browsable source outlines." />
    <div className="mt-7 grid min-w-0 gap-7 lg:grid-cols-[252px_minmax(0,1fr)] lg:gap-10">
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start" aria-label="Learning path topics">
        <div className="mb-2 flex items-center justify-between lg:mb-3">
          <h2 className="font-display text-sm font-semibold text-foreground">Choose a domain</h2>
          <span className="text-xs text-faint lg:hidden">Swipe for more</span>
        </div>
        <nav className="flex min-w-0 gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0" aria-label="Choose a learning path">
          {guidedTopics.map(item => {
            const readings = stagesFor(item).flatMap(stage => stage.resources);
            return <TrackButton key={item.slug} topic={item} active={item.slug === active} completed={countCompleted(readings, progress)} total={readings.length} onClick={() => chooseTopic(item.slug)} />;
          })}
          <span className="hidden border-t border-border pt-3 text-xs font-medium text-faint lg:block">More domains</span>
          {outlineTopics.map(item => {
            const readings = resourcesByTopic(item.slug);
            return <TrackButton key={item.slug} topic={item} active={item.slug === active} completed={countCompleted(readings, progress)} total={readings.length} onClick={() => chooseTopic(item.slug)} />;
          })}
        </nav>
      </aside>
      <div className="min-w-0">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `rgba(${hexToRgb(topic.color)},0.16)`, color: topic.color }}><TopicIcon name={topic.icon} size={24} /></div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><span className="font-mono font-medium">{path ? "GUIDED PATH" : "LIBRARY OUTLINE"}</span><span aria-hidden="true">·</span><span>{stages.length} {path ? "stages" : "collections"}</span></div>
              <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">{topic.title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">{path?.introduction ?? topic.intro}</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2.5 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">
            {path ? <BookOpen size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" /> : <Layers3 size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />}
            <p>{path ? <><span className="font-semibold text-foreground">Before you start: </span>{path.prerequisite}</> : "These sections follow the library taxonomy. A reviewed step-by-step path for this domain is still being prepared."}</p>
          </div>
          <div className="mt-5 border-t border-border pt-4">
            <div className="mb-2 flex items-end justify-between gap-3 text-sm"><span className="font-medium text-foreground">Your reading progress</span><span className="font-mono text-xs tabular-nums text-muted-foreground">{completed} / {allResources.length}</span></div>
            <div role="progressbar" aria-label={`${topic.title} reading progress`} aria-valuemin={0} aria-valuemax={allResources.length} aria-valuenow={completed} className="h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full transition-[width] duration-200" style={{ width: `${allResources.length ? completed / allResources.length * 100 : 0}%`, backgroundColor: topic.color }} />
            </div>
          </div>
        </div>
        {path && <nav className="mt-5 flex flex-wrap gap-2" aria-label="Jump to a stage">
          {stages.map((stage, index) => <a key={stage.id} href={`#stage-${stage.id}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-surface-raised">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} aria-hidden="true" /><span className="font-mono text-faint">{String(index + 1).padStart(2, "0")}</span>{stage.title}
          </a>)}
        </nav>}
        <div className="mt-8 pl-5 sm:pl-6">{stages.map((stage, index) => <StageSection key={stage.id} stage={stage} index={index} progress={progress} guided={Boolean(path)} />)}</div>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface/70 px-4 py-3 text-sm text-muted-foreground">
          <span>{path ? "This path selects the essential readings; the full domain library has more examples and deep dives." : "Explore the full library to search, filter and compare sources."}</span>
          <Link to={`/library?topic=${active}`} className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-primary hover:underline">Browse all {topic.resourceCount} resources <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  </PageContainer>;
}
