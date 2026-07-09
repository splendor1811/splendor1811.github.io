import { resources, topics } from "@/lib/content";
import type { ReadStatus } from "@/lib/db";

export interface GraphNode {
  id: string;
  kind: "topic" | "resource";
  label: string;
  color: string;
  val: number;
  topicSlug: string;
  status?: ReadStatus;
  url?: string;
}

export interface GraphLink {
  source: string;
  target: string;
  kind: "member" | "related";
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export function buildGraph(
  progress: Map<string, ReadStatus>,
  opts: { showResources: boolean },
): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  for (const t of topics) {
    nodes.push({
      id: `topic:${t.slug}`,
      kind: "topic",
      label: t.short,
      color: t.color,
      val: 8 + t.resourceCount * 0.3,
      topicSlug: t.slug,
    });
  }

  // Topic ↔ topic (related), deduped.
  const seen = new Set<string>();
  for (const t of topics) {
    for (const rel of t.relatedSlugs) {
      const key = [t.slug, rel].sort().join("|");
      if (seen.has(key) || !topics.find((x) => x.slug === rel)) continue;
      seen.add(key);
      links.push({ source: `topic:${t.slug}`, target: `topic:${rel}`, kind: "related" });
    }
  }

  if (opts.showResources) {
    for (const r of resources) {
      const topic = topics.find((t) => t.slug === r.topicSlug);
      nodes.push({
        id: r.id,
        kind: "resource",
        label: r.title,
        color: topic?.color ?? "#7C8CFF",
        val: r.markers.star ? 3 : 1.6,
        topicSlug: r.topicSlug,
        status: progress.get(r.id) ?? "unread",
        url: r.url,
      });
      links.push({ source: `topic:${r.topicSlug}`, target: r.id, kind: "member" });
    }
  }

  return { nodes, links };
}
