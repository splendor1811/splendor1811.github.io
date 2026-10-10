// Turn a form into the exact Library Markdown entry format, and (when the local
// writeback server is running) append it to the right topic file.

import type { ResourceType } from "@/data/schema";

export const DEFAULT_RESOURCE_GROUP = "Added via app";

export interface DraftResource {
  title: string;
  url: string;
  type: ResourceType;
  source: string;
  date: string;
  summary: string;
  keyConcepts: string[];
  markers: { star: boolean; startHere: boolean; unverified: boolean };
}

/** New entries carry an explicit identity; omitted IDs retain the legacy format. */
export function formatEntry(d: DraftResource, resourceId?: string): string {
  if (resourceId !== undefined && !/^[A-Za-z0-9][A-Za-z0-9_:-]*$/.test(resourceId)) {
    throw new Error("A resource ID must contain only letters, numbers, underscores, colons, or hyphens.");
  }
  const markers: string[] = [];
  if (d.markers.star) markers.push("⭐");
  if (d.markers.startHere) markers.push("🔁");
  if (d.markers.unverified) markers.push("⚠️unverified");
  const markerStr = markers.length ? " · " + markers.join(" · ") : "";
  const date = d.date.trim() || "—";
  const concepts = d.keyConcepts.length ? d.keyConcepts.join(", ") : "—";
  return [
    ...(resourceId ? [`<!-- resource-id: ${resourceId} -->`] : []),
    `- **[${d.title}](${d.url})** · \`${d.type}\` · ${d.source} · *${date}*${markerStr}`,
    `  ${d.summary}`,
    `  *Key concepts:* ${concepts}`,
  ].join("\n");
}

export async function isWritebackAvailable(): Promise<boolean> {
  try {
    const res = await fetch("/api/health", { signal: AbortSignal.timeout(800) });
    return res.ok;
  } catch {
    return false;
  }
}

export async function writeBack(topicSlug: string, group: string, markdown: string): Promise<void> {
  const res = await fetch("/api/resources", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ topicSlug, group, markdown }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Writeback failed (${res.status})`);
  }
}
