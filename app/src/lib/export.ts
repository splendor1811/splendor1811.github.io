// Backup / restore of all personal state as a single JSON file.

import { db } from "@/lib/db";

export interface Backup {
  app: "second-brain";
  version: 1;
  exportedAt: string;
  data: Record<string, unknown[]>;
}

export async function exportData(): Promise<Backup> {
  const [progress, notes, highlights, favorites, reviews, activity, settings, overlay] =
    await Promise.all([
      db.progress.toArray(),
      db.notes.toArray(),
      db.highlights.toArray(),
      db.favorites.toArray(),
      db.reviews.toArray(),
      db.activity.toArray(),
      db.settings.toArray(),
      db.overlay.toArray(),
    ]);
  return {
    app: "second-brain",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: { progress, notes, highlights, favorites, reviews, activity, settings, overlay },
  };
}

export function downloadBackup(backup: Backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `second-brain-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importData(backup: Backup, mode: "merge" | "replace") {
  if (backup.app !== "second-brain") throw new Error("Not a Second Brain backup file.");
  const tables = {
    progress: db.progress,
    notes: db.notes,
    highlights: db.highlights,
    favorites: db.favorites,
    reviews: db.reviews,
    activity: db.activity,
    settings: db.settings,
    overlay: db.overlay,
  };
  await db.transaction("rw", Object.values(tables), async () => {
    for (const [name, table] of Object.entries(tables)) {
      const rows = backup.data[name] ?? [];
      if (mode === "replace") await table.clear();
      // Highlights/activity use auto-increment ids; bulkPut preserves supplied ids.
      await (table as { bulkPut: (r: unknown[]) => Promise<unknown> }).bulkPut(rows);
    }
  });
}

export async function resetAll() {
  await Promise.all([
    db.progress.clear(),
    db.notes.clear(),
    db.highlights.clear(),
    db.favorites.clear(),
    db.reviews.clear(),
    db.activity.clear(),
    db.overlay.clear(),
  ]);
}
