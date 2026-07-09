// Reactive hooks over the personal-state DB. Components re-render when IndexedDB changes.

import { useLiveQuery } from "dexie-react-hooks";
import { db, type ReadStatus } from "@/lib/db";
import { isDue } from "@/lib/srs";

export function useStatus(resourceId: string): ReadStatus {
  return useLiveQuery(() => db.progress.get(resourceId).then((r) => r?.status ?? "unread"), [resourceId], "unread");
}

export function useProgressMap(): Map<string, ReadStatus> {
  return useLiveQuery(
    async () => {
      const rows = await db.progress.toArray();
      return new Map(rows.map((r) => [r.resourceId, r.status]));
    },
    [],
    new Map<string, ReadStatus>(),
  );
}

export function useIsFavorite(resourceId: string): boolean {
  return useLiveQuery(() => db.favorites.get(resourceId).then(Boolean), [resourceId], false);
}

export function useFavoriteIds(): Set<string> {
  return useLiveQuery(
    async () => new Set((await db.favorites.toArray()).map((f) => f.resourceId)),
    [],
    new Set<string>(),
  );
}

export function useNote(resourceId: string) {
  return useLiveQuery(() => db.notes.get(resourceId), [resourceId]);
}

export function useHighlights(resourceId: string) {
  return useLiveQuery(
    () => db.highlights.where("resourceId").equals(resourceId).reverse().sortBy("createdAt"),
    [resourceId],
    [],
  );
}

export function useNotedIds(): Set<string> {
  return useLiveQuery(
    async () => new Set((await db.notes.toArray()).filter((n) => n.body.trim()).map((n) => n.resourceId)),
    [],
    new Set<string>(),
  );
}

export function useDueReviews() {
  return useLiveQuery(async () => {
    const rows = await db.reviews.toArray();
    return rows.filter((r) => isDue(r));
  }, []);
}

export function useReviewCount() {
  return useLiveQuery(async () => {
    const rows = await db.reviews.toArray();
    return { total: rows.length, due: rows.filter((r) => isDue(r)).length };
  }, [], { total: 0, due: 0 });
}
