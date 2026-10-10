import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { TopicIcon } from "@/components/TopicIcon";
import { topics } from "@/lib/content";
import { useResources } from "@/hooks/publishing";
import { useProgressMap } from "@/hooks/personal";

export function TopicsPage() {
  const progress = useProgressMap();
  const resources = useResources();

  return (
    <PageContainer>
      <PageHeader
        title="Research topics"
        description={topics.length + " connected fields of study. Explore their foundations, key references, and open questions."}
        actions={
          <Link to="/library" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary">
            <BookOpen size={16} aria-hidden /> All resources
          </Link>
        }
      />

      <div className="mt-8 grid border-t border-border lg:grid-cols-2">
        {topics.map((topic, index) => {
          const list = resources.filter((resource) => resource.topicSlug === topic.slug);
          const done = list.filter((resource) => progress.get(resource.id) === "completed").length;
          const groups = [...new Set(list.map((resource) => resource.group).filter(Boolean))];
          return (
            <article
              key={topic.slug}
              className={"group min-w-0 border-b border-border py-7 lg:py-8 " + (index % 2 === 0 ? "lg:pr-8" : "lg:border-l lg:pl-8")}
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <TopicIcon name={topic.icon} size={22} />
                </span>
                <span className="text-sm text-muted-foreground">
                  <span className="font-medium tabular-nums text-foreground">{list.length}</span> resources
                </span>
              </div>
              <Link to={"/topics/" + topic.slug} className="block rounded-sm">
                <h2 className="flex min-h-11 items-start justify-between gap-4 font-display text-xl font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                  {topic.title}
                  <ArrowUpRight size={20} className="mt-1 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" aria-hidden />
                </h2>
                <p className="mt-2 line-clamp-3 max-w-[60ch] text-sm leading-7 text-muted-foreground">
                  {topic.intro.replace(/\*\*/g, "")}
                </p>
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-relaxed text-muted-foreground">
                {groups.length > 0 && <span>{groups.length} areas to explore</span>}
                {topic.readingOrder && <span className="text-primary">Reading guide available</span>}
                {done > 0 && <span>{done} completed</span>}
              </div>
            </article>
          );
        })}
      </div>
    </PageContainer>
  );
}
