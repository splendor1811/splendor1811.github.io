import type { Resource } from "@/data/schema";

type SourceReference = Pick<Resource, "url" | "source">;

/** Keep attribution intact while grouping articles from the same named publisher. */
export function sourceFacet(resource: SourceReference): string {
  try {
    const host = new URL(resource.url).hostname.replace(/^www\./, "").toLowerCase();
    if (host === "thinkingmachines.ai") return "Thinking Machines";
    if (host === "lilianweng.github.io") return "Lilian Weng";
  } catch {
    // Legacy malformed URLs can still be found through their original attribution.
  }
  return resource.source;
}

export function matchesSource(resource: SourceReference, selected: string): boolean {
  const query = selected.trim().toLocaleLowerCase();
  return sourceFacet(resource).toLocaleLowerCase() === query || resource.source.toLocaleLowerCase() === query;
}
