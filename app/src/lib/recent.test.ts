import { expect, test } from "bun:test";
import { compareRecentlyAdded, formatAddedDate, formatAddedLabel, INITIAL_LIBRARY_SNAPSHOT, libraryAddedTimestamp, recentPendingReposts } from "./recent";
import type { IntakeEntry } from "./intake-filters";
import type { Resource } from "@/data/schema";
import { intake } from "./intake";
import { resources } from "./content";

const entry = (id: string, capturedAt?: string, status: IntakeEntry["status"] = "needs-review"): IntakeEntry => ({
  id, capturedAt, status, title: id, url: `https://x.com/example/status/${id.replace(/\D/g, "") || "1"}`,
  source: "X", note: "Source review pending.",
});

test("recent reposts use capture time, not original post time or personal activity", () => {
  const items = recentPendingReposts([
    entry("x-repost-1", "2026-10-11T00:00:00Z"),
    entry("x-repost-2", "2026-10-12T00:00:00Z"),
    entry("x-repost-3", undefined),
    entry("x-repost-4", "2026-10-13T00:00:00Z", "imported"),
    entry("edge-5", "2026-10-14T00:00:00Z"),
  ]);
  expect(items.map(item => item.id)).toEqual(["x-repost-2", "x-repost-1"]);
});

test("all four recent research reposts link directly to Library entries, including Harvard CS2680", () => {
  const ids = ["x-repost-2109441921471205608", "x-repost-2109040425122349373", "x-repost-2108991371864318410", "x-repost-2108784183732740134"];
  const imported = intake.entries.filter(item => ids.includes(item.id));
  expect(imported).toHaveLength(4);
  expect(imported.every(item => item.status === "imported" && resources.some(resource => resource.id === item.resourceId))).toBe(true);
  const dates = new Map(resources.map(resource => [resource.id, libraryAddedTimestamp(resource) ?? 0]));
  expect(new Set([...resources].sort((a, b) => compareRecentlyAdded(a, b, dates)).slice(0, 4).map(resource => resource.id)))
    .toEqual(new Set(imported.map(item => item.resourceId!)));
});

test("recently added means Library insertion, never source publication or capture", () => {
  const older = { id: "older", title: "Older addition", dateSort: "2027-01-01", addedAt: "2026-09-01T00:00:00Z", provenance: { capturedAt: "2026-10-12T00:00:00Z" } } as Resource;
  const newer = { id: "newer", title: "Newer addition", dateSort: "2020-01-01", addedAt: "2026-10-12T00:00:00Z", provenance: { capturedAt: "2026-08-01T00:00:00Z" } } as Resource;
  const dates = new Map([older, newer].map(resource => [resource.id, libraryAddedTimestamp(resource)!]));
  expect([older, newer].sort((a, b) => compareRecentlyAdded(a, b, dates)).map(resource => resource.id)).toEqual(["newer", "older"]);
});

test("addition labels preserve the Library's Vietnam calendar date and initial-snapshot uncertainty", () => {
  const baseline = { addedAt: INITIAL_LIBRARY_SNAPSHOT } as Resource;
  expect(formatAddedLabel(baseline, Date.parse(INITIAL_LIBRARY_SNAPSHOT))).toBe("In Library by Jul 9, 2026");
  expect(formatAddedDate(Date.parse("2026-10-10T00:15:00+07:00"))).toBe("Oct 10, 2026");
  const later = { addedAt: "2026-08-09T20:50:55+07:00" } as Resource;
  expect(formatAddedLabel(later, Date.parse(later.addedAt!))).toBe("Added Aug 9, 2026");
});
