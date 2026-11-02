import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { topics } from "@/lib/content";
import { useResources } from "@/hooks/publishing";
import { useProgressMap } from "@/hooks/personal";
import { topicArtwork } from "@/lib/topic-artwork";

export function TopicsPage() {
  const progress = useProgressMap();
  const resources = useResources();

  return (
    <PageContainer>
      <PageHeader
        title="Explore topics"
        description="Explore AI research domains alongside practical reading on life, career, and finance."
        actions={
          <Link to="/library" className="inline-flex min-h-11 items-center gap-2 rounded-md border-2 border-border bg-accent px-4 text-sm font-semibold text-foreground shadow-subtle transition-transform hover:-translate-y-0.5">
            <BookOpen size={16} aria-hidden /> All resources
          </Link>
        }
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {topics.map((topic, index) => {
          const list = resources.filter((resource) => resource.topicSlug === topic.slug);
          const done = list.filter((resource) => progress.get(resource.id) === "completed").length;
          const groups = [...new Set(list.map((resource) => resource.group).filter(Boolean))];
          return (
            <article
              key={topic.slug}
              className="pulse-panel group min-w-0 overflow-hidden transition duration-300 hover:-translate-y-1"
            >
              <Link to={"/topics/" + topic.slug} className="relative block aspect-[2/1] overflow-hidden border-b-2 border-border bg-surface" aria-label={"Explore " + topic.title}>
                <img src={topicArtwork(topic.slug)} alt="" loading={index < 3 ? "eager" : "lazy"} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-slate-950/25" />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-950 bg-accent text-slate-950 shadow-[2px_2px_0_#111]">
                  <TopicIcon name={topic.icon} size={20} />
                </span>
                <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                  <span className="font-display text-sm font-medium tracking-wide text-white/85">{topic.short}</span>
                  <span className="rounded-full border-2 border-white bg-slate-950/70 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-wide">
                    {list.length} resources
                  </span>
                </span>
              </Link>
              <div className="p-5 sm:p-6">
                <Link to={"/topics/" + topic.slug} className="block rounded-sm">
                  <h2 className="flex min-h-11 items-start justify-between gap-4 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {topic.title}
                  <ArrowUpRight size={20} className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                  </h2>
                  <p className="mt-2 line-clamp-3 min-h-[4.75rem] text-sm leading-7 text-muted-foreground">
                    {topic.intro.replace(/\*\*/g, "")}
                  </p>
                </Link>
                <div className="mt-4 flex min-h-6 flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                  {groups.length > 0 && <span>{groups.length} areas to explore</span>}
                  {topic.readingOrder && <span className="text-primary">Reading guide available</span>}
                  {done > 0 && <span>{done} completed</span>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </PageContainer>
  );
}
