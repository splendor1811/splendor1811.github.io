import type { Resource } from "@/data/schema";
import type { IntakeEntry } from "@/lib/intake-filters";

/** Public capture time, never the publication date of the source. */
export function capturedTimestamp(resource: Resource): number | undefined {
  const raw = resource.provenance?.capturedAt;
  if (!raw) return undefined;
  const at = Date.parse(raw);
  return Number.isFinite(at) ? at : undefined;
}

/** Reposts discovered since the last snapshot, still awaiting source review. */
export function recentPendingReposts(entries: readonly IntakeEntry[], limit = 3): IntakeEntry[] {
  return entries
    .filter(entry => entry.id.startsWith("x-repost-") && entry.status === "needs-review" && entry.capturedAt)
    .sort((a, b) => Date.parse(b.capturedAt!) - Date.parse(a.capturedAt!))
    .slice(0, limit);
}
