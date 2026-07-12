import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowUpDown, LayoutGrid, Rows3 } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceRow } from "@/components/ResourceRow";
import { EmptyState } from "@/components/EmptyState";
import { Input, Button } from "@/components/ui/primitives";
import { TopicIcon } from "@/components/TopicIcon";
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import { topics, TYPES } from "@/lib/content";
import { useResources, usePendingIds } from "@/hooks/publishing";
import { useProgressMap } from "@/hooks/personal";
import type { ReadStatus } from "@/lib/db";
import type { ResourceType } from "@/data/schema";
import { cn, hexToRgb, pluralize } from "@/lib/utils";

type SortKey = "newest" | "oldest" | "title" | "topic";
const SORTS: Record<SortKey, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  title: "Title A–Z",
  topic: "By topic",
};
const STATUS_FILTERS: { key: ReadStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "reading", label: "Reading" },
  { key: "completed", label: "Done" },
];

export function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const progress = useProgressMap();
  const resources = useResources();
  const pending = usePendingIds();
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState<string | null>(params.get("topic"));
  const [typeFilter, setTypeFilter] = useState<Set<ResourceType>>(new Set());
  const [statusFilter, setStatusFilter] = useState<ReadStatus | "all">("all");
  const [mustRead, setMustRead] = useState(false);
  const [sort, setSort] = useState<SortKey>("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const tagParam = params.get("tag");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = resources.filter((r) => {
      if (topicFilter && r.topicSlug !== topicFilter) return false;
      if (typeFilter.size && !typeFilter.has(r.type)) return false;
      if (mustRead && !r.markers.star) return false;
      if (tagParam && !r.keyConcepts.some((c) => c.toLowerCase() === tagParam.toLowerCase())) return false;
      if (statusFilter !== "all") {
        const s = progress.get(r.id) ?? "unread";
        if (s !== statusFilter) return false;
      }
      if (q) {
        const hay = `${r.title} ${r.summary} ${r.source} ${r.keyConcepts.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "topic":
          return a.topicSlug.localeCompare(b.topicSlug) || a.title.localeCompare(b.title);
        case "oldest":
          return (a.dateSort ?? "0000").localeCompare(b.dateSort ?? "0000");
        default:
          return (b.dateSort ?? "0000").localeCompare(a.dateSort ?? "0000");
      }
    });
    return list;
  }, [query, topicFilter, typeFilter, statusFilter, mustRead, sort, tagParam, progress, resources]);

  const activeFilters = (topicFilter ? 1 : 0) + typeFilter.size + (mustRead ? 1 : 0) + (tagParam ? 1 : 0);

  function clearTag() {
    params.delete("tag");
    setParams(params, { replace: true });
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Library"
        title="All resources"
        description={`${resources.length} curated resources across ${topics.length} topics — everything you're tracking.`}
      />

      {/* Search + controls */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, summary, source, concept…"
            className="pl-9"
          />
        </div>

        <div className="flex overflow-hidden rounded-md border border-border">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(s.key)}
              className={cn(
                "px-3 py-2 text-xs font-medium transition-colors",
                statusFilter === s.key
                  ? "bg-surface-raised text-foreground"
                  : "text-muted-foreground hover:bg-surface-raised/50",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <DropdownMenu>
          <DropdownTrigger asChild>
            <Button variant="secondary" size="md">
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">{SORTS[sort]}</span>
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            {(Object.keys(SORTS) as SortKey[]).map((k) => (
              <DropdownItem key={k} active={sort === k} onSelect={() => setSort(k)}>
                {SORTS[k]}
              </DropdownItem>
            ))}
          </DropdownContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownTrigger asChild>
            <Button variant="secondary" size="md" className={typeFilter.size ? "text-primary" : ""}>
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Type</span>
              {typeFilter.size > 0 && <span className="font-mono text-2xs">{typeFilter.size}</span>}
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            {TYPES.map((t) => (
              <DropdownItem
                key={t}
                active={typeFilter.has(t)}
                onSelect={() => {
                  const next = new Set(typeFilter);
                  next.has(t) ? next.delete(t) : next.add(t);
                  setTypeFilter(next);
                }}
              >
                {t}
              </DropdownItem>
            ))}
          </DropdownContent>
        </DropdownMenu>

        <div className="hidden overflow-hidden rounded-md border border-border sm:flex">
          <button
            onClick={() => setView("grid")}
            className={cn("px-2.5 py-2", view === "grid" ? "bg-surface-raised text-foreground" : "text-faint")}
            aria-label="Grid view"
          >
            <LayoutGrid size={15} />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("px-2.5 py-2", view === "list" ? "bg-surface-raised text-foreground" : "text-faint")}
            aria-label="List view"
          >
            <Rows3 size={15} />
          </button>
        </div>
      </div>

      {/* Topic chips */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setTopicFilter(null)}
          className={cn(
            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            !topicFilter ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-surface-raised",
          )}
        >
          All topics
        </button>
        {topics.map((t) => {
          const active = topicFilter === t.slug;
          return (
            <button
              key={t.slug}
              onClick={() => setTopicFilter(active ? null : t.slug)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                active ? "text-foreground" : "border-border text-muted-foreground hover:bg-surface-raised",
              )}
              style={active ? { borderColor: `rgba(${hexToRgb(t.color)},0.5)`, background: `rgba(${hexToRgb(t.color)},0.12)` } : undefined}
            >
              <TopicIcon name={t.icon} size={12} style={{ color: t.color }} />
              {t.short}
            </button>
          );
        })}
        <button
          onClick={() => setMustRead((v) => !v)}
          className={cn(
            "ml-auto rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
            mustRead ? "border-accent/40 bg-accent/10 text-accent" : "border-border text-muted-foreground hover:bg-surface-raised",
          )}
        >
          ⭐ Must-read
        </button>
      </div>

      {/* Active tag filter */}
      {tagParam && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Filtered by concept:</span>
          <button
            onClick={clearTag}
            className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 font-mono text-2xs text-primary"
          >
            {tagParam}
            <X size={12} />
          </button>
        </div>
      )}

      {/* Results */}
      <div className="mt-4 flex items-center justify-between">
        <span className="rail">{pluralize(filtered.length, "result")}</span>
        {(activeFilters > 0 || query) && (
          <button
            onClick={() => {
              setQuery("");
              setTopicFilter(null);
              setTypeFilter(new Set());
              setMustRead(false);
              setStatusFilter("all");
              clearTag();
            }}
            className="text-xs text-faint hover:text-muted-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState icon={Search} title="No matches" description="Try loosening a filter or clearing your search." />
        </div>
      ) : view === "grid" ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => (
            <ResourceCard key={r.id} resource={r} pending={pending.has(r.id)} />
          ))}
        </div>
      ) : (
        <div className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {filtered.map((r) => (
            <ResourceRow key={r.id} resource={r} pending={pending.has(r.id)} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
