import { expect, test } from "bun:test";
import { canonicalUrl } from "./canonical-url";

test("playlists keep their identity, watch links deduplicate independent of playlist context", () => {
  expect(canonicalUrl("https://www.youtube.com/playlist?list=AAA")).not.toBe(canonicalUrl("https://www.youtube.com/playlist?list=BBB"));
  expect(canonicalUrl("https://www.youtube.com/watch?v=abc&list=AAA&t=5")).toBe(canonicalUrl("https://youtu.be/abc?si=123"));
});
test("preserves meaningful queries and matches paper variants", () => {
  expect(canonicalUrl("https://example.com/article?list=1&ref=abc")).toContain("list=1&ref=abc");
  expect(canonicalUrl("https://arxiv.org/pdf/2509.24650v2.pdf")).toBe(canonicalUrl("https://arxiv.org/abs/2509.24650"));
});
