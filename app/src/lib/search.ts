// Client-side full-text search over resources, topics, and tags via MiniSearch.

import MiniSearch from "minisearch";
import { resources, topics } from "@/lib/content";

export interface SearchDoc {
  id: string;
  kind: "resource" | "topic";
  title: string;
  body: string;
  topicSlug: string;
}

const docs: SearchDoc[] = [
  ...resources.map((r) => ({
    id: r.id,
    kind: "resource" as const,
    title: r.title,
    body: `${r.summary} ${r.source} ${r.keyConcepts.join(" ")} ${r.type}`,
    topicSlug: r.topicSlug,
  })),
  ...topics.map((t) => ({
    id: `topic:${t.slug}`,
    kind: "topic" as const,
    title: t.title,
    body: `${t.intro} ${t.groups.join(" ")}`,
    topicSlug: t.slug,
  })),
];

export const miniSearch = new MiniSearch<SearchDoc>({
  fields: ["title", "body"],
  storeFields: ["kind", "title", "topicSlug"],
  searchOptions: {
    boost: { title: 3 },
    fuzzy: 0.2,
    prefix: true,
  },
});

miniSearch.addAll(docs);

export function search(query: string, limit = 20) {
  if (!query.trim()) return [];
  return miniSearch.search(query).slice(0, limit);
}
