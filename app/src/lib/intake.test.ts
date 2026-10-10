import { expect, test } from "bun:test";
import { filterIntakeEntries, getIntakeOrigin, parseIntakeOrigin, type IntakeEntry } from "./intake";

const entry = (id: string, fields: Partial<IntakeEntry> = {}): IntakeEntry => ({
  id, title: "A research source", url: "https://example.org/research", source: "Author / arXiv",
  status: "needs-review", note: "Awaiting source review", ...fields,
});

test("acquisition origins use exact stable ID prefixes, with an explicit other fallback", () => {
  for (const origin of ["edge", "x", "lilianweng", "followup"] as const) {
    expect(getIntakeOrigin(entry(`${origin}-001`))).toBe(origin);
  }
  expect(getIntakeOrigin(entry("edge-003", { source: "X repost" }))).toBe("edge");
  for (const id of ["", "x", "xray-001", "not-edge-001", "future-001"]) {
    expect(getIntakeOrigin(entry(id))).toBe("other");
  }
});

test("URL origin values are validated without hiding the inventory for unknown values", () => {
  for (const origin of ["edge", "x", "lilianweng", "followup", "other"] as const) {
    expect(parseIntakeOrigin(origin)).toBe(origin);
  }
  for (const value of [null, "", "all", "invalid", "Edge", "edge-001"]) {
    expect(parseIntakeOrigin(value)).toBe("");
  }
});

test("origin, domain, status, and search filters combine rather than replace one another", () => {
  const rows = [
    entry("edge-001", { domainSlug: "rl", status: "imported" }),
    entry("x-001", { domainSlug: "rl", status: "imported" }),
    entry("x-002", { domainSlug: "rl", status: "needs-review" }),
    entry("x-003", { domainSlug: "vision", status: "imported" }),
    entry("x-004", { domainSlug: "rl", status: "imported", url: "https://example.org/different" }),
  ];
  expect(filterIntakeEntries(rows, { origin: "x", domain: "rl", status: "imported", query: "https://example.org/research" }).map(row => row.id)).toEqual(["x-001"]);
  expect(filterIntakeEntries(rows, { origin: "x", domain: "rl" }).map(row => row.id)).toEqual(["x-001", "x-002", "x-004"]);
  expect(filterIntakeEntries(rows, { origin: "followup" })).toEqual([]);
  expect(rows).toHaveLength(5);
});

test("inventory search includes pasted URLs, accents, notes, publishers, and domain names", () => {
  const rows = [entry("followup-001", { title: "Đánh giá mô hình", url: "https://example.org/paper?id=42", source: "Research Lab", note: "Primary evidence", domainSlug: "evaluation" })];
  const domainTitle = (slug: string) => slug === "evaluation" ? "Data and Evaluation" : undefined;
  for (const query of [" https://example.org/paper?id=42 ", "EXAMPLE.ORG", "danh gia mo hinh", "research lab", "primary evidence", "data and evaluation", "evaluation"]) {
    expect(filterIntakeEntries(rows, { query }, domainTitle)).toEqual(rows);
  }
  expect(filterIntakeEntries(rows, { query: "unrelated" }, domainTitle)).toEqual([]);
});

test("cleared filters retain original ordering and unknown origins remain discoverable", () => {
  const rows = [entry("future-001"), entry("edge-001"), entry("lilianweng-001")];
  expect(filterIntakeEntries(rows, { origin: "other" })).toEqual([rows[0]]);
  expect(filterIntakeEntries(rows, { origin: "", status: "all", query: "  ", domain: "" })).toEqual(rows);
  expect(filterIntakeEntries(rows)).toEqual(rows);
});
