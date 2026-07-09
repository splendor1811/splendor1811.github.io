// Typed, memoized accessors over the build-time content bundle. This is the read-only
// "resource" side of the app; personal state lives in lib/db.ts.

import rawBundle from "@/data/content.json";
import type { ContentBundle, Resource, Topic } from "@/data/schema";

const bundle = rawBundle as ContentBundle;

export const resources: Resource[] = bundle.resources;
export const topics: Topic[] = bundle.topics;
export const priorityQueue = bundle.priorityQueue;
export const tags = bundle.tags;
export const generatedAt = bundle.generatedAt;

export const resourceById = new Map(resources.map((r) => [r.id, r]));
export const topicBySlug = new Map(topics.map((t) => [t.slug, t]));
export const resourceByUrl = new Map(resources.map((r) => [r.url, r]));

export function getResource(id: string): Resource | undefined {
  return resourceById.get(id);
}

export function getTopic(slug: string): Topic | undefined {
  return topicBySlug.get(slug);
}

export function resourcesByTopic(slug: string): Resource[] {
  return resources.filter((r) => r.topicSlug === slug);
}

const conceptKey = (c: string) => c.toLowerCase().trim();

// Precompute a concept -> resourceIds index for related-resource lookups.
const conceptIndex = new Map<string, string[]>();
for (const r of resources) {
  for (const c of r.keyConcepts) {
    const k = conceptKey(c);
    const arr = conceptIndex.get(k) ?? [];
    arr.push(r.id);
    conceptIndex.set(k, arr);
  }
}

/** Related resources ranked by shared key-concepts, then same-topic affinity. */
export function relatedResources(resource: Resource, limit = 6): Resource[] {
  const scores = new Map<string, number>();
  for (const c of resource.keyConcepts) {
    for (const id of conceptIndex.get(conceptKey(c)) ?? []) {
      if (id === resource.id) continue;
      scores.set(id, (scores.get(id) ?? 0) + 2);
    }
  }
  // Small boost for same topic to keep suggestions coherent.
  for (const r of resourcesByTopic(resource.topicSlug)) {
    if (r.id === resource.id) continue;
    scores.set(r.id, (scores.get(r.id) ?? 0) + 0.5);
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => resourceById.get(id)!)
    .filter(Boolean);
}

/** Resources whose summary references this topic via a wikilink-like mention, or share tags. */
export function resourcesForTag(tag: string): Resource[] {
  const ids = conceptIndex.get(conceptKey(tag)) ?? [];
  return ids.map((id) => resourceById.get(id)!).filter(Boolean);
}

export const TYPES: Resource["type"][] = ["Blog", "Paper", "Video", "Course", "Book", "Repo", "News"];
