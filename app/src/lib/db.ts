// Personal state (progress, notes, highlights, favorites, reviews, activity, settings).
// Local-first via IndexedDB (Dexie). Everything here is exportable/importable as JSON.

import Dexie, { type Table } from "dexie";

export type ReadStatus = "unread" | "reading" | "completed" | "archived";

export type ActivityType =
  | "started"
  | "completed"
  | "noted"
  | "highlighted"
  | "favorited"
  | "unfavorited"
  | "reviewed"
  | "added"
  | "edited";

export interface ProgressRow {
  resourceId: string;
  status: ReadStatus;
  rating?: number; // 1..5, optional personal rating
  startedAt?: number;
  completedAt?: number;
  updatedAt: number;
}

export interface NoteRow {
  resourceId: string;
  body: string;
  updatedAt: number;
}

export type HighlightColor = "amber" | "indigo" | "green" | "rose";

export interface HighlightRow {
  id?: number;
  resourceId: string;
  text: string;
  note?: string;
  color: HighlightColor;
  createdAt: number;
}

export interface FavoriteRow {
  resourceId: string;
  createdAt: number;
}

export interface ReviewRow {
  resourceId: string;
  ease: number; // SM-2 ease factor
  interval: number; // days
  reps: number;
  dueDate: number; // epoch ms
  lastReviewed?: number;
}

export interface ActivityRow {
  id?: number;
  type: ActivityType;
  resourceId?: string;
  topicSlug?: string;
  at: number;
}

export interface SettingRow {
  key: string;
  value: unknown;
}

/** UI-added resources not yet written back to Markdown. Mirrors the Resource shape. */
export interface OverlayResourceRow {
  id: string;
  data: unknown; // Resource
  createdAt: number;
}

class SecondBrainDB extends Dexie {
  progress!: Table<ProgressRow, string>;
  notes!: Table<NoteRow, string>;
  highlights!: Table<HighlightRow, number>;
  favorites!: Table<FavoriteRow, string>;
  reviews!: Table<ReviewRow, string>;
  activity!: Table<ActivityRow, number>;
  settings!: Table<SettingRow, string>;
  overlay!: Table<OverlayResourceRow, string>;

  constructor() {
    super("second-brain");
    this.version(1).stores({
      progress: "resourceId, status, updatedAt",
      notes: "resourceId, updatedAt",
      highlights: "++id, resourceId, createdAt",
      favorites: "resourceId, createdAt",
      reviews: "resourceId, dueDate",
      activity: "++id, type, at, resourceId",
      settings: "key",
      overlay: "id, createdAt",
    });
  }
}

export const db = new SecondBrainDB();

// ---- Mutations (each also logs activity where meaningful) ----

export async function logActivity(row: Omit<ActivityRow, "id" | "at">) {
  await db.activity.add({ ...row, at: Date.now() });
}

export async function setStatus(resourceId: string, status: ReadStatus, topicSlug?: string) {
  const now = Date.now();
  const existing = await db.progress.get(resourceId);
  const row: ProgressRow = {
    resourceId,
    status,
    rating: existing?.rating,
    startedAt: existing?.startedAt ?? (status !== "unread" ? now : undefined),
    completedAt: status === "completed" ? now : existing?.completedAt,
    updatedAt: now,
  };
  await db.progress.put(row);
  if (status === "reading" && existing?.status !== "reading")
    await logActivity({ type: "started", resourceId, topicSlug });
  if (status === "completed" && existing?.status !== "completed")
    await logActivity({ type: "completed", resourceId, topicSlug });
}

export async function setRating(resourceId: string, rating: number) {
  const existing = await db.progress.get(resourceId);
  await db.progress.put({
    resourceId,
    status: existing?.status ?? "reading",
    rating,
    startedAt: existing?.startedAt,
    completedAt: existing?.completedAt,
    updatedAt: Date.now(),
  });
}

export async function saveNote(resourceId: string, body: string, topicSlug?: string) {
  const existing = await db.notes.get(resourceId);
  await db.notes.put({ resourceId, body, updatedAt: Date.now() });
  if (!existing && body.trim()) await logActivity({ type: "noted", resourceId, topicSlug });
}

export async function addHighlight(row: Omit<HighlightRow, "id" | "createdAt">, topicSlug?: string) {
  await db.highlights.add({ ...row, createdAt: Date.now() });
  await logActivity({ type: "highlighted", resourceId: row.resourceId, topicSlug });
}

export async function removeHighlight(id: number) {
  await db.highlights.delete(id);
}

export async function toggleFavorite(resourceId: string, topicSlug?: string) {
  const existing = await db.favorites.get(resourceId);
  if (existing) {
    await db.favorites.delete(resourceId);
    await logActivity({ type: "unfavorited", resourceId, topicSlug });
  } else {
    await db.favorites.put({ resourceId, createdAt: Date.now() });
    await logActivity({ type: "favorited", resourceId, topicSlug });
  }
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await db.settings.get(key);
  return (row?.value as T) ?? fallback;
}

export async function setSetting(key: string, value: unknown) {
  await db.settings.put({ key, value });
}
