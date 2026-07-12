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

export function usePublishingConfigured(): boolean {
  return useLiveQuery(() => isPublishingConfigured(), [], false);
}

export function useGitHubConfig() {
  return useLiveQuery(() => getGitHubConfig(), []);
}
