import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ArrowUpDown, LayoutGrid, Rows3, Star } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/PageHeader";
import { ResourceCard } from "@/components/ResourceCard";
import { ResourceRow } from "@/components/ResourceRow";
import { EmptyState } from "@/components/EmptyState";
import { Input, Button } from "@/components/ui/primitives";
import { DropdownMenu, DropdownTrigger, DropdownContent, DropdownItem } from "@/components/ui/dropdown";
import { topics, TYPES } from "@/lib/content";
import { createResourceSearch, runResourceSearch } from "@/lib/search";
import { sourceFacet, matchesSource } from "@/lib/source-facets";
import { useResources, usePendingIds, useAddedTimestamps } from "@/hooks/publishing";
import { useProgressMap } from "@/hooks/personal";
import type { ReadStatus } from "@/lib/db";
import type { ResourceType } from "@/data/schema";
import { resolveTopicSlug, SOURCE_TOPIC_REDIRECTS } from "@/data/topics";
import { cn, pluralize } from "@/lib/utils";
import { compareRecentlyAdded } from "@/lib/recent";

type SortKey = "relevance" | "newest" | "oldest" | "title" | "topic" | "added";
const SORTS: Record<SortKey, string> = {
  relevance: "Most relevant",
  newest: "Newest published",
  oldest: "Oldest published",
  title: "Title A–Z",
  topic: "By topic",
  added: "Recently added",
};
const STATUS_FILTERS: { key: ReadStatus | "all"; label: string }[] = [
  { key: "all", label: "All resources" },
  { key: "unread", label: "Unread" },
  { key: "reading", label: "Reading" },
  { key: "completed", label: "Completed" },
  { key: "archived", label: "Archived" },
];
const FILTER_KEYS = ["q", "topic", "source", "type", "status", "tag", "star"];

export function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const progress = useProgressMap();
  const resources = useResources();
  const pending = usePendingIds();
  const addedAt = useAddedTimestamps();

  // The URL remains authoritative after browser Back / Forward and shared links.
  const query = params.get("q") ?? "";
  const originalTopicFilter = params.get("topic");
  const legacySource = originalTopicFilter ? SOURCE_TOPIC_REDIRECTS[originalTopicFilter] : undefined;
  const topicFilter = originalTopicFilter && !legacySource ? resolveTopicSlug(originalTopicFilter) : null;
  const sourceFilter = params.get("source") ?? legacySource ?? null;
  const sources = useMemo(() => [...new Set(resources.map(sourceFacet).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [resources]);
  const typeValues = params.getAll("type").flatMap((value) => value.split(","));
  const typeFilter = new Set<ResourceType>(TYPES.filter((type) => typeValues.includes(type)));
  const statusParam = params.get("status");
  const statusFilter = STATUS_FILTERS.find((status) => status.key === statusParam)?.key ?? "all";
  const mustRead = ["1", "true"].includes(params.get("star") ?? "");
  const tagParam = params.get("tag");
  const sortParam = params.get("sort");
  const sort: SortKey = sortParam && Object.hasOwn(SORTS, sortParam)
    ? sortParam as SortKey
    : query.trim() ? "relevance" : "newest";
  const view = params.get("view") === "grid" ? "grid" : "list";
  const searchIndex = useMemo(() => createResourceSearch(resources), [resources]);
  const searchResults = useMemo(() => runResourceSearch(searchIndex, query), [searchIndex, query]);
  const searchRanks = useMemo(() => new Map(searchResults.map((result, index) => [String(result.id), index])), [searchResults]);

  useEffect(() => {
    if (!originalTopicFilter || (!legacySource && topicFilter === originalTopicFilter)) return;
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (legacySource) {
        next.delete("topic");
        if (!next.has("source")) next.set("source", legacySource);
      } else if (topicFilter) next.set("topic", topicFilter);
      return next;
    }, { replace: true });
  }, [originalTopicFilter, legacySource, topicFilter, setParams]);

  function updateParam(key: string, value: string | null, replace = false) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    }, { replace });
  }

  function toggleType(type: ResourceType) {
    const next = new Set(typeFilter);
    if (next.has(type)) next.delete(type);
    else next.add(type);
    updateParam("type", TYPES.filter((item) => next.has(item)).join(",") || null);
  }

  function clearFilters() {
    setParams((current) => {
      const next = new URLSearchParams(current);
      FILTER_KEYS.forEach((key) => next.delete(key));
      return next;
    });
  }

  const filtered = resources.filter((resource) => {
    if (topicFilter && resource.topicSlug !== topicFilter) return false;
    if (sourceFilter && !matchesSource(resource, sourceFilter)) return false;
    if (typeFilter.size && !typeFilter.has(resource.type)) return false;
    if (mustRead && !resource.markers.star) return false;
    if (tagParam && !resource.keyConcepts.some((concept) => concept.toLowerCase() === tagParam.toLowerCase())) return false;
    if (statusFilter !== "all" && (progress.get(resource.id) ?? "unread") !== statusFilter) return false;
    if (query.trim() && !searchRanks.has(resource.id)) return false;
    return true;
  }).sort((a, b) => {
    switch (sort) {
      case "relevance":
        if (query.trim()) return (searchRanks.get(a.id) ?? Infinity) - (searchRanks.get(b.id) ?? Infinity);
        return (b.dateSort ?? "").localeCompare(a.dateSort ?? "");
      case "title":
        return a.title.localeCompare(b.title);
      case "topic":
        return a.topicSlug.localeCompare(b.topicSlug) || a.title.localeCompare(b.title);
      case "oldest":
        return (a.dateSort ?? "9999").localeCompare(b.dateSort ?? "9999");
      case "added": return compareRecentlyAdded(a, b, addedAt);
      default:
        return (b.dateSort ?? "").localeCompare(a.dateSort ?? "");
    }
  });

  const selectedTopic = topics.find((topic) => topic.slug === topicFilter);
  const activeFilters = [
    ...(query.trim() ? [{ key: "q", label: `Search: ${query}`, remove: () => updateParam("q", null) }] : []),
    ...(topicFilter ? [{ key: "topic", label: selectedTopic?.title ?? topicFilter, remove: () => updateParam("topic", null) }] : []),
    ...(sourceFilter ? [{ key: "source", label: `Source: ${sourceFilter}`, remove: () => updateParam("source", null) }] : []),
    ...[...typeFilter].map((type) => ({ key: `type:${type}`, label: type, remove: () => toggleType(type) })),
    ...(statusFilter !== "all" ? [{ key: "status", label: STATUS_FILTERS.find((status) => status.key === statusFilter)!.label, remove: () => updateParam("status", null) }] : []),
    ...(mustRead ? [{ key: "star", label: "Must-read", remove: () => updateParam("star", null) }] : []),
    ...(tagParam ? [{ key: "tag", label: `Concept: ${tagParam}`, remove: () => updateParam("tag", null) }] : []),
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Research library"
        description={`${resources.length.toLocaleString()} resources across ${topics.length} topics. Find a reference, follow an idea, go deeper.`}
      />

      <div className="mt-7">
        <label htmlFor="library-search" className="sr-only">Search the research library</label>
        <div className="relative">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-primary" aria-hidden />
          <Input
            id="library-search"
            type="search"
            value={query}
            onChange={(event) => updateParam("q", event.target.value, true)}
            placeholder="Search a paper, a concept, an author…"
            className="h-14 rounded-xl bg-card pl-12 pr-4 text-base shadow-none"
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-5 flex min-w-0 flex-wrap items-center gap-2">
        <label htmlFor="library-topic" className="sr-only">Filter by topic</label>
        <select
          id="library-topic"
          value={topicFilter ?? ""}
          onChange={(event) => updateParam("topic", event.target.value || null)}
          className="h-11 min-w-[170px] max-w-full flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground sm:max-w-[280px]"
        >
          <option value="">All topics</option>
          {topicFilter && !selectedTopic && <option value={topicFilter}>{topicFilter}</option>}
          {topics.map((topic) => <option key={topic.slug} value={topic.slug}>{topic.title}</option>)}
        </select>

        <label htmlFor="library-source" className="sr-only">Filter by source</label>
        <select
          id="library-source"
          value={sourceFilter ?? ""}
          onChange={(event) => updateParam("source", event.target.value || null)}
          className="h-11 min-w-[170px] max-w-full flex-1 rounded-lg border border-border bg-card px-3 text-sm text-foreground sm:max-w-[280px]"
        >
          <option value="">All sources</option>
          {sourceFilter && !sources.includes(sourceFilter) && <option value={sourceFilter}>{sourceFilter}</option>}
          {sources.map((source) => <option key={source} value={source}>{source}</option>)}
        </select>

        <DropdownMenu>
          <DropdownTrigger asChild>
            <Button variant="outline" className={cn("h-11 rounded-lg", typeFilter.size > 0 && "border-primary/40 bg-primary/5 text-primary")}>
              <SlidersHorizontal size={16} aria-hidden />
              Format{typeFilter.size > 0 ? ` · ${typeFilter.size}` : ""}
            </Button>
          </DropdownTrigger>
          <DropdownContent>
            {TYPES.map((type) => (
              <DropdownItem key={type} active={typeFilter.has(type)} onSelect={() => toggleType(type)} className="min-h-11">
                {type}
              </DropdownItem>
            ))}
          </DropdownContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => updateParam("star", mustRead ? null : "1")}
          aria-pressed={mustRead}
          className={cn(
            "flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm font-medium transition-colors",
            mustRead ? "border-primary/40 bg-primary/5 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground",
          )}
        >
          <Star size={16} className={mustRead ? "fill-primary/15" : ""} aria-hidden />
          Must-read
        </button>
      </div>

      <div className="mt-6 flex min-w-0 flex-wrap items-end justify-between gap-x-4 gap-y-3 border-b border-border">
        <div className="flex min-w-0 max-w-full items-center overflow-x-auto" role="group" aria-label="Reading status">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status.key}
              type="button"
              onClick={() => updateParam("status", status.key === "all" ? null : status.key)}
              aria-pressed={statusFilter === status.key}
              className={cn(
                "min-h-12 shrink-0 border-b-2 px-3 text-sm font-medium transition-colors first:pl-0",
                statusFilter === status.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {status.label}
            </button>
          ))}
        </div>

        <div className="mb-2 flex items-center gap-2">
          <DropdownMenu>
            <DropdownTrigger asChild>
              <Button variant="ghost" className="h-11 gap-2 px-2" aria-label={`Sort resources: ${SORTS[sort]}`}>
                <ArrowUpDown size={15} aria-hidden />
                <span className="text-sm">{SORTS[sort]}</span>
              </Button>
            </DropdownTrigger>
            <DropdownContent>
              {(Object.keys(SORTS) as SortKey[]).filter((key) => key !== "relevance" || query.trim()).map((key) => (
                <DropdownItem key={key} active={sort === key} onSelect={() => updateParam("sort", key)} className="min-h-11">
                  {SORTS[key]}
                </DropdownItem>
              ))}
            </DropdownContent>
          </DropdownMenu>
          <div className="flex rounded-lg border border-border p-0.5" role="group" aria-label="Resource layout">
            <button
              type="button"
              onClick={() => updateParam("view", "list")}
              className={cn("flex h-11 w-11 items-center justify-center rounded-md transition-colors", view === "list" ? "bg-surface-raised text-primary" : "text-muted-foreground hover:text-foreground")}
              aria-label="List view"
              aria-pressed={view === "list"}
            >
              <Rows3 size={17} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => updateParam("view", "grid")}
              className={cn("flex h-11 w-11 items-center justify-center rounded-md transition-colors", view === "grid" ? "bg-surface-raised text-primary" : "text-muted-foreground hover:text-foreground")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
            >
              <LayoutGrid size={17} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 py-3">
        <p className="text-sm text-muted-foreground" role="status" aria-live="polite" aria-atomic="true">
          <span className="font-semibold tabular-nums text-foreground">{filtered.length.toLocaleString()}</span>
          {` ${filtered.length === 1 ? "resource" : "resources"}`}
          {activeFilters.length > 0 && <span> of {resources.length.toLocaleString()}</span>}
        </p>
        {activeFilters.length > 0 && (
          <button type="button" onClick={clearFilters} className="min-h-11 px-2 text-sm font-medium text-primary hover:underline">
            Clear all filters
          </button>
        )}
      </div>

      {activeFilters.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={filter.remove}
              aria-label={`Remove filter: ${filter.label}`}
              className="flex min-h-11 max-w-full items-center gap-2 rounded-lg bg-primary/5 px-3 text-sm text-primary transition-colors hover:bg-primary/10"
            >
              <span className="truncate">{filter.label}</span>
              <X size={14} className="shrink-0" aria-hidden />
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card py-6">
          <EmptyState icon={Search} title="No resources found" description="Try a broader term, a different topic, or clear your filters to explore the full library." />
          {activeFilters.length > 0 && <div className="pb-6 text-center"><Button onClick={clearFilters} className="h-11">Clear all filters</Button></div>}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label={pluralize(filtered.length, "resource")}>
          {filtered.map((resource) => <ResourceCard key={resource.id} resource={resource} pending={pending.has(resource.id)} addedAt={sort === "added" ? addedAt.get(resource.id) : undefined} />)}
        </div>
      ) : (
        <div className="divide-y divide-border border-y border-border" aria-label={pluralize(filtered.length, "resource")}>
          {filtered.map((resource) => <ResourceRow key={resource.id} resource={resource} pending={pending.has(resource.id)} addedAt={sort === "added" ? addedAt.get(resource.id) : undefined} />)}
        </div>
      )}
    </PageContainer>
  );
}
