import { describe, expect, test } from "bun:test";
import { deleteMarkdownEntry, insertMarkdownEntry, replaceMarkdownEntry } from "./markdownEntries";
import { DEFAULT_RESOURCE_GROUP } from "./mdWriteback";
import { parseSubpage } from "@/data/parser/parse";

const url = "https://example.com/shared-source";
const block = (id: string, title: string) => `<!-- resource-id: ${id} -->\n- **[${title}](${url})** · \`Blog\` · Example · *2026-01-01*\n  Summary for ${title}.\n  *Key concepts:* a, b`;
const first = block("old-topic__first", "First");
const second = block("publisher-topic__second", "Second");
const content = "# Topic\n\n### Group\n" + first + "\n\n" + second + "\n";
const replacement = `- **[New title](https://example.com/new-url)** · \`Blog\` · Example · *2026-02-02*\n  Updated summary.\n  *Key concepts:* c`;

describe("Markdown entry edits preserve stable identities", () => {
  test("an ID disambiguates two entries with the same URL", () => {
    const edited = replaceMarkdownEntry(content, url, replacement, "publisher-topic__second");
    expect(edited).toContain(first);
    expect(edited).toContain("<!-- resource-id: publisher-topic__second -->\n" + replacement);
    expect(edited).not.toContain("[Second]");
    const parsed = parseSubpage({ slug: "new-domain", title: "New domain", icon: "BookOpen", short: "New", color: "#123456", markdown: edited });
    expect(parsed.resources.map((resource) => resource.id)).toEqual(["old-topic__first", "publisher-topic__second"]);
  });

  test("an ambiguous URL cannot overwrite the first duplicate", () => {
    expect(() => replaceMarkdownEntry(content, url, replacement)).toThrow("stable ID");
  });

  test("delete removes the identity comment with exactly its own entry", () => {
    const deleted = deleteMarkdownEntry(content, url, "old-topic__first");
    expect(deleted).not.toContain("old-topic__first");
    expect(deleted).not.toContain("[First]");
    expect(deleted).toContain(second);
  });

  test("a first edit adds an ID to an older unmarked entry", () => {
    const unmarked = first.split("\n").slice(1).join("\n");
    expect(replaceMarkdownEntry(unmarked, url, replacement, "old-topic__first")).toBe("<!-- resource-id: old-topic__first -->\n" + replacement);
  });

  test("a replacement cannot change an established identity", () => {
    expect(() => replaceMarkdownEntry(first, url, "<!-- resource-id: wrong-id -->\n" + replacement, "old-topic__first")).toThrow("stable ID");
  });

  test("a malformed entry cannot consume the following resource", () => {
    const broken = "<!-- resource-id: broken -->\n- **[Broken](" + url + ")** · `Blog` · Example · *—*\n  Missing concepts.\n" + second;
    expect(() => deleteMarkdownEntry(broken, url, "broken")).toThrow("Key concepts");
  });
});

describe("new resource insertion is safe to retry", () => {
  test("a repeated stable-ID publish is a no-op", () => {
    const inserted = insertMarkdownEntry(content, "Group", block("new-resource", "New"));
    expect(insertMarkdownEntry(inserted, "Group", block("new-resource", "New"))).toBe(inserted);
    expect(inserted.match(/resource-id: new-resource/g)).toHaveLength(1);
    expect(inserted).toContain(first);
    expect(inserted).toContain(second);
  });

  test("a duplicate ID with changed content or destination cannot be appended", () => {
    expect(() => insertMarkdownEntry(content, "Group", block("old-topic__first", "Changed"))).toThrow("already published");
    expect(() => insertMarkdownEntry(content, "Another group", first)).toThrow("already published");
    expect(() => insertMarkdownEntry(content, "Group", first.replace(url, "https://example.com/different"))).toThrow();
  });

  test("different IDs may share a URL and title", () => {
    const inserted = insertMarkdownEntry(content, "Group", block("new-resource", "First"));
    const parsed = parseSubpage({ slug: "research", title: "Research", icon: "BookOpen", short: "R", color: "#123456", markdown: inserted });
    expect(parsed.resources.map((resource) => resource.id)).toEqual(["old-topic__first", "publisher-topic__second", "new-resource"]);
    expect(parsed.resources.map((resource) => resource.url)).toEqual([url, url, url]);
  });

  test("blank groups reuse the same canonical default heading", () => {
    const firstInsert = insertMarkdownEntry("# Research", "", first);
    const secondInsert = insertMarkdownEntry(firstInsert, "", second);
    expect(secondInsert.match(new RegExp(`### ${DEFAULT_RESOURCE_GROUP}`, "g"))).toHaveLength(1);
    const parsed = parseSubpage({ slug: "research", title: "Research", icon: "BookOpen", short: "R", color: "#123456", markdown: secondInsert });
    expect(parsed.resources.map((resource) => resource.group)).toEqual([DEFAULT_RESOURCE_GROUP, DEFAULT_RESOURCE_GROUP]);
    expect(insertMarkdownEntry(secondInsert, "", second)).toBe(secondInsert);
  });

  test("legacy entries without explicit IDs still publish", () => {
    const inserted = insertMarkdownEntry("# Research", "Papers", replacement);
    expect(inserted).toContain("### Papers\n" + replacement);
    expect(inserted).not.toContain("resource-id:");
  });
});
