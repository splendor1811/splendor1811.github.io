import { db, type ActivityRow, type FavoriteRow, type HighlightRow, type NoteRow, type ProgressRow, type ReviewRow } from "@/lib/db";

export interface PersonalSnapshot {
  progress: ProgressRow[];
  notes: NoteRow[];
  highlights: HighlightRow[];
  favorites: FavoriteRow[];
  reviews: ReviewRow[];
  activity: ActivityRow[];
}

export async function readPersonalSnapshot(sourceDb: typeof db = db): Promise<PersonalSnapshot> {
  const [progress, notes, highlights, favorites, reviews, activity] = await Promise.all([
    sourceDb.progress.toArray(), sourceDb.notes.toArray(), sourceDb.highlights.toArray(),
    sourceDb.favorites.toArray(), sourceDb.reviews.toArray(), sourceDb.activity.toArray(),
  ]);
  return { progress, notes, highlights, favorites, reviews, activity };
}

export function parsePersonalSnapshot(value: unknown): PersonalSnapshot {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid cloud state");
  const source = value as Record<string, unknown>;
  const rows = (name: keyof PersonalSnapshot): unknown[] => {
    if (!Array.isArray(source[name])) throw new Error(`Invalid cloud state: ${name}`);
    return source[name];
  };
  return {
    progress: rows("progress") as ProgressRow[], notes: rows("notes") as NoteRow[],
    highlights: rows("highlights") as HighlightRow[], favorites: rows("favorites") as FavoriteRow[],
    reviews: rows("reviews") as ReviewRow[], activity: rows("activity") as ActivityRow[],
  };
}

export async function replacePersonalSnapshot(snapshot: PersonalSnapshot, targetDb: typeof db = db): Promise<void> {
  await targetDb.transaction("rw", [targetDb.progress, targetDb.notes, targetDb.highlights, targetDb.favorites, targetDb.reviews, targetDb.activity], async () => {
    await Promise.all([
      targetDb.progress.clear(), targetDb.notes.clear(), targetDb.highlights.clear(),
      targetDb.favorites.clear(), targetDb.reviews.clear(), targetDb.activity.clear(),
    ]);
    await Promise.all([
      targetDb.progress.bulkPut(snapshot.progress), targetDb.notes.bulkPut(snapshot.notes),
      targetDb.highlights.bulkPut(snapshot.highlights), targetDb.favorites.bulkPut(snapshot.favorites),
      targetDb.reviews.bulkPut(snapshot.reviews), targetDb.activity.bulkPut(snapshot.activity),
    ]);
  });
}
