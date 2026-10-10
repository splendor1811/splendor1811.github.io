// Optimistic overlay: newly published resources (and edits to existing ones) are
// stored locally so they show up immediately, before the GitHub redeploy bakes them
// into content.json (~1-2 min). Once the redeploy lands, the canonical data matches.

import { db } from "@/lib/db";
import { DEFAULT_RESOURCE_GROUP } from "@/lib/mdWriteback";
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
  // Serialize with other edits and reconciliation, including across browser tabs.
  await db.transaction("rw", db.overlay, async () => {
    const existing = await db.overlay.get(id) as OverlayRecord | undefined;
    await db.overlay.put(mergeOverlayPatch(id, patch, existing, Date.now()));
  });
}

/** Keep a not-yet-built addition whole, and retain fields from earlier edits. */
export function mergeOverlayPatch(
  id: string,
  patch: Partial<Resource>,
  existing: OverlayRecord | undefined,
  createdAt: number,
): OverlayRecord {
  if (patch.id !== undefined && patch.id !== id) throw new Error("An edit cannot change a resource's stable ID.");
  if (existing && existing.id !== id) throw new Error("Cannot merge overlays for different resources.");
  const data: OverlayPayload = existing?.data.kind === "new"
    ? { kind: "new", resource: { ...existing.data.resource, ...patch, id } }
    : { kind: "patch", patch: { ...(existing?.data.patch ?? {}), ...patch } };
  return { id, data, createdAt };
}

export async function clearOverlay(id: string) {
  await db.overlay.delete(id);
}

/**
 * Drop only older records whose latest values are present in this content build.
 * An unrelated or intermediate redeploy must never discard a pending add/edit.
 * `generatedAtMs` is the build timestamp of the loaded content bundle.
 */
export async function pruneStaleOverlay(generatedAtMs: number, base: Resource[]) {
  await db.transaction("rw", db.overlay, async () => {
    const rows = (await db.overlay.toArray()) as OverlayRecord[];
    const stale = confirmedOverlayIds(generatedAtMs, base, rows);
    if (stale.length) await db.overlay.bulkDelete(stale);
  });
}

export function confirmedOverlayIds(generatedAtMs: number, base: Resource[], rows: OverlayRecord[]): string[] {
  const byId = new Map(base.map(r => [r.id, r]));
  // A newer build may be unrelated to a pending publish. Remove only changes that
  // are actually present in the canonical bundle, never by timestamp alone.
  return rows.filter(row => {
    const resource = byId.get(row.id);
    if (!resource || row.createdAt >= generatedAtMs) return false;
    const expected = row.data.kind === "new" ? row.data.resource : row.data.patch;
    return Object.entries(expected).every(([key, value]) => {
      const canonical = resource[key as keyof Resource];
      // Older clients stored an empty group while publishing under this heading.
      if (key === "group" && row.data.kind === "new" && value === "" && canonical === DEFAULT_RESOURCE_GROUP) return true;
      return JSON.stringify(canonical) === JSON.stringify(value);
    });
  }).map(r => r.id);
}

/** Pending additions may contain newer edits than an intermediate content build. */
export function applyOverlay(base: Resource[], overlay: OverlayRecord[]): Resource[] {
  if (!overlay.length) return base;
  const byId = new Map(overlay.map((row) => [row.id, row.data]));
  const existingIds = new Set(base.map((r) => r.id));
  const merged = base.map((resource) => {
    const pending = byId.get(resource.id);
    if (!pending) return resource;
    const fields = pending.kind === "new" ? pending.resource : pending.patch;
    return { ...resource, ...fields, id: resource.id };
  });
  for (const [id, pending] of byId) {
    if (pending.kind === "new" && !existingIds.has(id)) merged.push({ ...pending.resource, id });
  }
  return merged;
}

/** Set of resource ids that are pending redeploy (newly added or edited locally). */
export function pendingIds(overlay: OverlayRecord[]): Set<string> {
  return new Set(overlay.map((r) => r.id));
}
