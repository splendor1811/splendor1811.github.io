import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, BookOpen, ChevronDown, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PageContainer } from "@/components/PageHeader";
import { ResourceRow } from "@/components/ResourceRow";
import { TopicIcon } from "@/components/TopicIcon";
import { Button } from "@/components/ui/primitives";
import { getTopic, topics } from "@/lib/content";
import { useResources, usePendingIds } from "@/hooks/publishing";
import { useProgressMap } from "@/hooks/personal";
import { cn } from "@/lib/utils";
import { topicArtwork } from "@/lib/topic-artwork";

export function TopicDetailPage() {
  const { slug = "" } = useParams();
  const topic = getTopic(slug);
  const progress = useProgressMap();
  const resources = useResources();
  const pending = usePendingIds();
  const [overviewExpanded, setOverviewExpanded] = useState(false);
  useEffect(() => setOverviewExpanded(false), [slug]);

  if (!topic) {
    return (
      <PageContainer>
        <h1 className="font-display text-3xl font-semibold">Topic not found</h1>
        <p className="mt-3 text-muted-foreground">This topic may have moved. Explore the topic index to continue.</p>
        <Button variant="outline" className="mt-6 h-11" asChild><Link to="/topics">Browse topics</Link></Button>
      </PageContainer>
    );
  }

  const list = resources.filter((resource) => resource.topicSlug === slug);
  const done = list.filter((resource) => progress.get(resource.id) === "completed").length;
  const related = topic.relatedSlugs.map((relatedSlug) => topics.find((item) => item.slug === relatedSlug)).filter(Boolean);
  const startingPoint = list.find((resource) => resource.markers.startHere);
  const grouped = new Map<string, typeof list>();
  for (const group of topic.groups) grouped.set(group, []);
  for (const resource of list) {
    const key = resource.group || "Resources";
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(resource);
  }
  const sections = [...grouped.entries()].filter(([, items]) => items.length);

  return (
    <PageContainer>
      <Link to="/topics" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft size={16} aria-hidden /> All topics
      </Link>

      <div className="relative mb-8 h-36 overflow-hidden rounded-2xl border border-border bg-surface sm:h-52">
        <img src={topicArtwork(topic.slug)} alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/55 via-slate-950/10 to-transparent" />
        <div className="absolute bottom-4 left-5 flex items-center gap-3 sm:bottom-6 sm:left-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-slate-950/35 text-white backdrop-blur-md">
            <TopicIcon name={topic.icon} size={23} />
          </span>
          <span className="text-sm font-medium tracking-wide text-white/90">{topic.short}</span>
        </div>
      </div>
      <header className="border-b border-border pb-8">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
            <TopicIcon name={topic.icon} size={23} />
          </span>
          <span className="text-sm text-muted-foreground">{list.length} resources</span>
          {done > 0 && <span className="text-sm text-muted-foreground">{done} completed</span>}
        </div>
        <h1 className="max-w-[24ch] font-display text-3xl font-semibold leading-[1.15] tracking-tight text-foreground md:text-5xl">
          {topic.title}
        </h1>
        <div
          id="topic-overview"
          className={cn("mt-5 max-w-[72ch] text-base leading-8 text-muted-foreground md:line-clamp-none [&_strong]:font-medium [&_strong]:text-foreground", !overviewExpanded && "line-clamp-3")}
        >
          <ReactMarkdown>{topic.intro}</ReactMarkdown>
        </div>
        <button
          type="button"
          onClick={() => setOverviewExpanded((expanded) => !expanded)}
          aria-expanded={overviewExpanded}
          aria-controls="topic-overview"
          className="mt-1 min-h-11 text-sm font-medium text-primary md:hidden"
        >
          {overviewExpanded ? "Show less" : "Read full overview"}
        </button>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          {startingPoint ? (
            <Button asChild className="h-11 rounded-lg">
              <Link to={"/resource/" + startingPoint.id}><BookOpen size={16} aria-hidden /> Start here</Link>
            </Button>
          ) : (
            <Button asChild className="h-11 rounded-lg">
              <a href="#topic-resources"><BookOpen size={16} aria-hidden /> Browse resources</a>
            </Button>
          )}
          <Button variant="outline" className="h-11 rounded-lg" asChild>
            <Link to={"/library?topic=" + encodeURIComponent(slug)}><Search size={16} aria-hidden /> Search this topic</Link>
          </Button>
          {topic.readingOrder && (
            <Link to={"/roadmap?topic=" + encodeURIComponent(slug)} className="hidden min-h-11 items-center gap-2 px-2 text-sm font-medium text-primary hover:underline sm:inline-flex">
              Reading guide <ArrowUpRight size={16} aria-hidden />
            </Link>
          )}
        </div>
      </header>

      {topic.readingOrder && (
        <details className="group my-6 rounded-xl bg-primary/5 px-4">
          <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
            <BookOpen size={18} className="shrink-0 text-primary" aria-hidden />
            A suggested way in
            <ChevronDown size={16} className="ml-auto shrink-0 text-primary transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="pb-4 pl-8">
            <p className="max-w-[85ch] text-sm leading-7 text-muted-foreground">{topic.readingOrder}</p>
            <Link to={"/roadmap?topic=" + encodeURIComponent(slug)} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline">
              Open the reading guide <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
        </details>
      )}

      <div className="mt-8 grid min-w-0 gap-8 xl:grid-cols-[190px_minmax(0,1fr)]">
        <aside className="min-w-0">
          <nav aria-label="On this topic" className="sticky top-6">
            <p className="mb-3 text-sm font-semibold text-foreground">In this topic</p>
            <div className="flex gap-1 overflow-x-auto pb-2 xl:flex-col xl:overflow-visible">
              {sections.map(([group, items], index) => (
                <a
                  key={group}
                  href={"#topic-section-" + index}
                  className="flex min-h-11 shrink-0 items-center justify-between gap-3 rounded-lg px-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:bg-surface-raised hover:text-primary xl:shrink"
                >
                  <span>{group}</span>
                  <span className="text-xs tabular-nums">{items.length}</span>
                </a>
              ))}
            </div>

            {related.length > 0 && (
              <div className="mt-7 hidden border-t border-border pt-5 xl:block">
                <p className="mb-2 text-sm font-semibold text-foreground">Connected topics</p>
                {related.map((item) => (
                  <Link key={item!.slug} to={"/topics/" + item!.slug} className="flex min-h-11 items-center gap-2 rounded-lg py-2 text-sm leading-relaxed text-muted-foreground hover:text-primary">
                    <TopicIcon name={item!.icon} size={15} className="shrink-0 text-primary" />
                    {item!.title}
                  </Link>
                ))}
              </div>
            )}
          </nav>
        </aside>

        <div id="topic-resources" className="min-w-0 scroll-mt-6 space-y-10" tabIndex={-1}>
          {sections.map(([group, items], index) => (
            <section key={group} id={"topic-section-" + index} className="scroll-mt-6" tabIndex={-1} aria-labelledby={"topic-section-title-" + index}>
              <h2 id={"topic-section-title-" + index} className="mb-3 flex items-baseline gap-3 font-display text-xl font-semibold leading-snug tracking-tight text-foreground">
                {group}
                <span className="text-sm font-normal tabular-nums text-muted-foreground">{items.length}</span>
              </h2>
              <div className="divide-y divide-border border-t border-border">
                {items.map((resource) => <ResourceRow key={resource.id} resource={resource} pending={pending.has(resource.id)} />)}
              </div>
            </section>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-8 border-t border-border pt-6 xl:hidden" aria-labelledby="related-topics">
          <h2 id="related-topics" className="text-base font-semibold text-foreground">Connected topics</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((item) => (
              <Link key={item!.slug} to={"/topics/" + item!.slug} className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-3 text-sm text-primary">
                <TopicIcon name={item!.icon} size={15} />{item!.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageContainer>
  );
}
