import { useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { resources as baseResources } from "@/lib/content";
import { applyOverlay, pendingIds, type OverlayRecord } from "@/lib/overlay";
import { getGitHubConfig, isPublishingConfigured } from "@/lib/github";
import type { Resource } from "@/data/schema";

export function useOverlay(): OverlayRecord[] {
  return useLiveQuery(() => db.overlay.toArray() as Promise<OverlayRecord[]>, [], []);
}

/** Base content resources with local overlay (new + edited) applied. Reactive. */
export function useResources(): Resource[] {
  const overlay = useOverlay();
  return applyOverlay(baseResources, overlay);
}

/** ids of resources changed locally and awaiting the GitHub redeploy. */
export function usePendingIds(): Set<string> {
  const overlay = useOverlay();
  return pendingIds(overlay);
}

export interface AddedItem {
  resource: Resource;
  at: number;
}

/**
 * Resources you've added through the app, newest first. Sourced from the durable
 * "added" activity log (survives redeploys), resolved against current content.
 */
export function useRecentlyAdded(limit = 8): AddedItem[] {
  const resources = useResources();
  const events = useLiveQuery(
    () => db.activity.where("type").equals("added").toArray(),
    [],
    [],
  );
  return useMemo(() => {
    const byId = new Map(resources.map((r) => [r.id, r]));
    const seen = new Set<string>();
    const out: AddedItem[] = [];
    for (const e of [...(events ?? [])].sort((a, b) => b.at - a.at)) {
      if (!e.resourceId || seen.has(e.resourceId)) continue;
      const resource = byId.get(e.resourceId);
      if (!resource) continue;
      seen.add(e.resourceId);
      out.push({ resource, at: e.at });
      if (out.length >= limit) break;
    }
    return out;
  }, [events, resources, limit]);
}

/** Map of resourceId -> when you added it (latest add event). */
export function useAddedTimestamps(): Map<string, number> {
  const events = useLiveQuery(() => db.activity.where("type").equals("added").toArray(), [], []);
  return useMemo(() => {
    const m = new Map<string, number>();
    for (const e of events ?? []) {
      if (!e.resourceId) continue;
      const prev = m.get(e.resourceId);
      if (prev == null || e.at > prev) m.set(e.resourceId, e.at);
    }
    return m;
  }, [events]);
}

export function usePublishingConfigured(): boolean {
  return useLiveQuery(() => isPublishingConfigured(), [], false);
}

export function useGitHubConfig() {
  return useLiveQuery(() => getGitHubConfig(), []);
}
