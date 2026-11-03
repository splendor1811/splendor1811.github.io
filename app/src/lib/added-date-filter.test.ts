import { expect, test } from "bun:test";
import type { Resource } from "@/data/schema";
import { addedDateRange, matchesAddedDate } from "./added-date-filter";

const resource = (addedAt: string) => ({ addedAt } as Resource);
const now = Date.parse("2026-11-03T12:00:00+07:00");

test("added-date presets use Vietnam calendar days and Monday-based weeks", () => {
  expect(matchesAddedDate(resource("2026-11-03T00:00:00+07:00"), addedDateRange("today", now))).toBe(true);
  expect(matchesAddedDate(resource("2026-11-02T23:59:59+07:00"), addedDateRange("today", now))).toBe(false);
  expect(matchesAddedDate(resource("2026-11-02T10:00:00+07:00"), addedDateRange("this-week", now))).toBe(true);
  expect(matchesAddedDate(resource("2026-11-01T23:59:59+07:00"), addedDateRange("this-week", now))).toBe(false);
  expect(matchesAddedDate(resource("2026-10-31T10:00:00+07:00"), addedDateRange("last-month", now))).toBe(true);
});

test("custom ranges include both selected calendar days", () => {
  const range = addedDateRange("custom", now, "2026-10-30", "2026-11-02");
  expect(matchesAddedDate(resource("2026-10-30T00:00:00+07:00"), range)).toBe(true);
  expect(matchesAddedDate(resource("2026-11-02T23:59:59+07:00"), range)).toBe(true);
  expect(matchesAddedDate(resource("2026-11-03T00:00:00+07:00"), range)).toBe(false);
});
