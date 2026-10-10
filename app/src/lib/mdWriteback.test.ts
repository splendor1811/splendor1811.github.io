import { describe, expect, test } from "bun:test";
import { parseSubpage } from "@/data/parser/parse";
import { formatEntry, type DraftResource } from "./mdWriteback";

const draft: DraftResource = {
  title: "Repeated title",
  url: "https://example.com/article",
  type: "Paper",
  source: "Author",
  date: "2026-02",
  summary: "A useful finding.",
  keyConcepts: ["attention"],
  markers: { star: false, startHere: false, unverified: false },
};
const parse = (markdown: string, slug = "research") => parseSubpage({
  slug, markdown, title: "Research", icon: "BookOpen", short: "Research", color: "#123456",
}).resources;

describe("permanent identities in published Markdown", () => {
  test("omitting an ID retains the legacy entry format", () => {
    const markdown = formatEntry(draft);
    expect(markdown.startsWith("- **[")).toBe(true);
    expect(parse(markdown)[0].id).toBe("research__repeated-title");
  });

  test("identical titles remain distinct from each other and older entries", () => {
    const firstId = `resource__${crypto.randomUUID()}`;
    const secondId = `resource__${crypto.randomUUID()}`;
    const markdown = [formatEntry(draft), formatEntry(draft, firstId), formatEntry(draft, secondId)].join("\n\n");
    const resources = parse(markdown);
    expect(resources.map((resource) => resource.id)).toEqual(["research__repeated-title", firstId, secondId]);
    expect(new Set(resources.map((resource) => resource.id)).size).toBe(3);
    expect(resources.map((resource) => resource.dateSort)).toEqual(["2026-02-01", "2026-02-01", "2026-02-01"]);
  });

  test("an identity survives changed title, topic, and URL", () => {
    const id = "resource__94c66ee2-219e-46bd-ad7d-34f4177e2f83";
    expect(parse(formatEntry(draft, id))[0].id).toBe(id);
    const changed = { ...draft, title: "New title", url: "https://example.com/new-source" };
    expect(parse(formatEntry(changed, id), "another-topic")[0].id).toBe(id);
  });

  test("malformed IDs cannot inject Markdown comments or entries", () => {
    for (const id of ["", "contains space", "bad -->\n### Group", "<script>"]) {
      expect(() => formatEntry(draft, id)).toThrow("resource ID");
    }
  });
});
