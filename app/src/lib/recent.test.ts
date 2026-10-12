import { expect, test } from "bun:test";
import { capturedTimestamp, recentPendingReposts } from "./recent";
import type { IntakeEntry } from "./intake-filters";
import type { Resource } from "@/data/schema";
import { intake } from "./intake";

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

test("the three newly inventoried research reposts appear in the public inbox feed", () => {
  expect(recentPendingReposts(intake.entries).map(item => item.id)).toEqual([
    "x-repost-2109040425122349373",
    "x-repost-2108991371864318410",
    "x-repost-2108784183732740134",
  ]);
});

test("recently added library ordering can use public provenance independent of publication", () => {
  const resource = { dateSort: "2023-01-01", provenance: { capturedAt: "2026-10-11T00:53:00Z" } } as Resource;
  expect(capturedTimestamp(resource)).toBe(Date.parse("2026-10-11T00:53:00Z"));
});
