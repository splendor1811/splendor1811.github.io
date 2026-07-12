// Optimistic overlay: newly published resources (and edits to existing ones) are
// stored locally so they show up immediately, before the GitHub redeploy bakes them
// into content.json (~1-2 min). Once the redeploy lands, the canonical data matches.

import { db } from "@/lib/db";
import type { Resource } from "@/data/schema";

export type OverlayPayload =
  | { kind: "new"; resource: Resource }
  | { kind: "patch"; patch: Partial<Resource> };

export interface OverlayRecord {
  id: string;
  data: OverlayPayload;
  createdAt: number;
}

export async function addOverlayNew(resource: Resource) {
  await db.overlay.put({ id: resource.id, data: { kind: "new", resource }, createdAt: Date.now() });
}

export async function addOverlayPatch(id: string, patch: Partial<Resource>) {
  await db.overlay.put({ id, data: { kind: "patch", patch }, createdAt: Date.now() });
}

export async function clearOverlay(id: string) {
  await db.overlay.delete(id);
}

/**
 * Drop overlay records that predate the current content build — once a redeploy
 * bakes an add/edit into content.json, its optimistic overlay is redundant.
 * `generatedAtMs` is the build timestamp of the loaded content bundle.
 */
export async function pruneStaleOverlay(generatedAtMs: number) {
  const rows = (await db.overlay.toArray()) as OverlayRecord[];
  const stale = rows.filter((r) => r.createdAt < generatedAtMs).map((r) => r.id);
  if (stale.length) await db.overlay.bulkDelete(stale);
}

/** Merge overlay records onto a base resource list: apply patches, append new ones. */
export function applyOverlay(base: Resource[], overlay: OverlayRecord[]): Resource[] {
  if (!overlay.length) return base;
  const patches = new Map<string, Partial<Resource>>();
  const additions: Resource[] = [];
  for (const row of overlay) {
    if (row.data.kind === "patch") patches.set(row.id, row.data.patch);
    else additions.push(row.data.resource);
  }
  const existingIds = new Set(base.map((r) => r.id));
  const merged = base.map((r) => (patches.has(r.id) ? { ...r, ...patches.get(r.id) } : r));
  // Only append additions that aren't already present in the canonical data.
  for (const add of additions) if (!existingIds.has(add.id)) merged.push(add);
  return merged;
}

/** Set of resource ids that are pending redeploy (newly added or edited locally). */
export function pendingIds(overlay: OverlayRecord[]): Set<string> {
  return new Set(overlay.map((r) => r.id));
}
