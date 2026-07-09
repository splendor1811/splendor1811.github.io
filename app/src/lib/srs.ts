// A compact SM-2 spaced-repetition scheduler. Grades: "forgot" | "fuzzy" | "remember".

import type { ReviewRow } from "@/lib/db";

export type Grade = "forgot" | "fuzzy" | "remember";

const GRADE_Q: Record<Grade, number> = { forgot: 2, fuzzy: 3, remember: 5 };
const DAY = 24 * 60 * 60 * 1000;

export function schedule(prev: Pick<ReviewRow, "ease" | "interval" | "reps"> | null, grade: Grade): {
  ease: number;
  interval: number;
  reps: number;
  dueDate: number;
} {
  const q = GRADE_Q[grade];
  let ease = prev?.ease ?? 2.5;
  let reps = prev?.reps ?? 0;
  let interval = prev?.interval ?? 0;

  if (q < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 4;
    else interval = Math.round(interval * ease);
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  }

  return { ease, interval, reps, dueDate: Date.now() + interval * DAY };
}

export function isDue(row: ReviewRow, now = Date.now()): boolean {
  return row.dueDate <= now;
}

export function newReview(resourceId: string): ReviewRow {
  return { resourceId, ease: 2.5, interval: 0, reps: 0, dueDate: Date.now() };
}
