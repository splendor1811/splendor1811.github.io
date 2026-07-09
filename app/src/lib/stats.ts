import type { ActivityRow, ReadStatus } from "@/lib/db";
import { resources } from "@/lib/content";

export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

/** Consecutive-day streak ending today (or yesterday, so a day isn't lost before midnight actions). */
export function computeStreak(timestamps: number[]): number {
  if (!timestamps.length) return 0;
  const days = new Set(timestamps.map(dayKey));
  const cursor = new Date();
  if (!days.has(dayKey(cursor.getTime()))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(dayKey(cursor.getTime()))) return 0;
  }
  let streak = 0;
  while (days.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface OverallStats {
  total: number;
  completed: number;
  reading: number;
  unread: number;
  pct: number;
}

export function overallStats(progress: Map<string, ReadStatus>): OverallStats {
  const total = resources.length;
  let completed = 0;
  let reading = 0;
  for (const r of resources) {
    const s = progress.get(r.id);
    if (s === "completed") completed += 1;
    else if (s === "reading") reading += 1;
  }
  return {
    total,
    completed,
    reading,
    unread: total - completed - reading,
    pct: total ? completed / total : 0,
  };
}

/** Build a GitHub-style contribution grid: array of weeks, each 7 day-cells, last N weeks. */
export function contributionGrid(activity: ActivityRow[], weeks = 26) {
  const counts = new Map<string, number>();
  for (const a of activity) counts.set(dayKey(a.at), (counts.get(dayKey(a.at)) ?? 0) + 1);

  const cells: { date: Date; count: number }[] = [];
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  // Align to the end of the current week (Saturday).
  const start = new Date(end);
  start.setDate(start.getDate() - (weeks * 7 - 1) - end.getDay());
  for (let i = 0; i < weeks * 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push({ date: d, count: counts.get(dayKey(d.getTime())) ?? 0 });
  }
  const grid: { date: Date; count: number }[][] = [];
  for (let w = 0; w < weeks; w++) grid.push(cells.slice(w * 7, w * 7 + 7));
  return grid;
}
