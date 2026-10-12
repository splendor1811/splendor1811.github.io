import { db, type ActivityRow, type FavoriteRow, type HighlightRow, type NoteRow, type ProgressRow, type ReviewRow } from "@/lib/db";

export interface PersonalSnapshot {
  progress: ProgressRow[];
  notes: NoteRow[];
  highlights: HighlightRow[];
  favorites: FavoriteRow[];
  reviews: ReviewRow[];
  activity: ActivityRow[];
}

export async function readPersonalSnapshot(): Promise<PersonalSnapshot> {
  const [progress, notes, highlights, favorites, reviews, activity] = await Promise.all([
    db.progress.toArray(), db.notes.toArray(), db.highlights.toArray(),
    db.favorites.toArray(), db.reviews.toArray(), db.activity.toArray(),
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

export async function replacePersonalSnapshot(snapshot: PersonalSnapshot): Promise<void> {
  await db.transaction("rw", [db.progress, db.notes, db.highlights, db.favorites, db.reviews, db.activity], async () => {
    await Promise.all([
      db.progress.clear(), db.notes.clear(), db.highlights.clear(),
      db.favorites.clear(), db.reviews.clear(), db.activity.clear(),
    ]);
    await Promise.all([
      db.progress.bulkPut(snapshot.progress), db.notes.bulkPut(snapshot.notes),
      db.highlights.bulkPut(snapshot.highlights), db.favorites.bulkPut(snapshot.favorites),
      db.reviews.bulkPut(snapshot.reviews), db.activity.bulkPut(snapshot.activity),
    ]);
  });
}
