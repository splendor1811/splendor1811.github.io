import type { Resource } from "@/data/schema";
import type { IntakeEntry } from "@/lib/intake-filters";

/** First addition to the Library, independent of publication and capture. */
export function libraryAddedTimestamp(resource: Resource): number | undefined {
  const raw = resource.addedAt;
  if (!raw) return undefined;
  const at = Date.parse(raw);
  return Number.isFinite(at) ? at : undefined;
}

/** Unknown addition dates sort last; publication date never breaks a tie. */
export function compareRecentlyAdded(a: Resource, b: Resource, addedAt: ReadonlyMap<string, number>): number {
  return (addedAt.get(b.id) ?? 0) - (addedAt.get(a.id) ?? 0) || a.title.localeCompare(b.title);
}

export function formatAddedDate(at: number): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(at));
}

/** Reposts discovered since the last snapshot, still awaiting source review. */
export function recentPendingReposts(entries: readonly IntakeEntry[], limit = 3): IntakeEntry[] {
  return entries
    .filter(entry => entry.id.startsWith("x-repost-") && entry.status === "needs-review" && entry.capturedAt)
    .sort((a, b) => Date.parse(b.capturedAt!) - Date.parse(a.capturedAt!))
    .slice(0, limit);
}
