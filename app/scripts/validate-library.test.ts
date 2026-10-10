import { describe, expect, test } from "bun:test";
import { validateLibraryReferences, validatePublicReference } from "./validate-library";

function fixture() {
  return {
    resources: [{ id: "paper", url: "https://arxiv.org/abs/2601.00001", topicSlug: "rl" }],
    topicSlugs: new Set(["rl", "systems"]),
    provenance: { paper: {
      origin: "x", verification: "primary", sourceUrl: "https://arxiv.org/abs/2601.00001",
      note: "Abstract read; full paper not reviewed.", relatedDomains: ["systems"],
      discoveryLinks: [{ url: "https://x.com/author/status/123", label: "Author's source-link reply" }],
    } },
    intake: { updatedAt: null, coverage: {}, entries: [{ id: "x-123", title: "Paper", source: "Author", url: "https://x.com/author/status/123", status: "imported", resourceId: "paper", domainSlug: "rl", note: "Curated abstract." }] },
  };
}

describe("public library reference validation", () => {
  test("accepts a coherent sourced library and empty optional sidecars", () => {
    expect(() => validateLibraryReferences(fixture())).not.toThrow();
    expect(() => validateLibraryReferences({ ...fixture(), provenance: {}, intake: { updatedAt: null, coverage: {}, entries: [] } })).not.toThrow();
  });
  test("rejects orphan provenance and broken intake resource references", () => {
    const data = fixture();
    expect(() => validateLibraryReferences({ ...data, provenance: { missing: data.provenance.paper } })).toThrow("unknown resource");
    data.intake.entries[0].resourceId = "missing";
    expect(() => validateLibraryReferences(data)).toThrow("unknown resource");
  });
  test("rejects unknown domains in resources, provenance, and intake", () => {
    for (const change of [
      (data: ReturnType<typeof fixture>) => { data.resources[0].topicSlug = "missing"; },
      (data: ReturnType<typeof fixture>) => { data.provenance.paper.relatedDomains = ["missing"]; },
      (data: ReturnType<typeof fixture>) => { data.intake.entries[0].domainSlug = "missing"; },
    ]) {
      const data = fixture(); change(data);
      expect(() => validateLibraryReferences(data)).toThrow("unknown domain");
    }
  });
  test("requires review scope and source URL for primary verification", () => {
    const data = fixture(); data.provenance.paper.note = "";
    expect(() => validateLibraryReferences(data)).toThrow("review scope");
    data.provenance.paper.note = "Read abstract"; data.provenance.paper.sourceUrl = "";
    expect(() => validateLibraryReferences(data)).toThrow("sourceUrl");
  });
  test("rejects duplicate intake IDs and invalid status", () => {
    const data = fixture(); data.intake.entries.push({ ...data.intake.entries[0] });
    expect(() => validateLibraryReferences(data)).toThrow("Duplicate intake ID");
    data.intake.entries.pop(); data.intake.entries[0].status = "complete";
    expect(() => validateLibraryReferences(data)).toThrow("status is invalid");
  });
  test("allows pending entries without a linked resource, but not imported entries", () => {
    const data = fixture();
    const { resourceId: _, ...entry } = data.intake.entries[0];
    expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, entries: [{ ...entry, status: "needs-review" }] } })).not.toThrow();
    expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, entries: [entry] } })).toThrow("resourceId");
  });
  test("does not reject historical duplicate URLs with distinct stable IDs", () => {
    const data = fixture(); data.resources.push({ ...data.resources[0], id: "historical-notes" });
    expect(() => validateLibraryReferences(data)).not.toThrow();
  });
  test("checks discovery-link URLs and labels", () => {
    const data = fixture(); data.provenance.paper.discoveryLinks[0].url = "file:///Users/example/secret";
    expect(() => validateLibraryReferences(data)).toThrow("public HTTP(S)");
    data.provenance.paper.discoveryLinks[0].url = "https://x.com/author/status/123";
    data.provenance.paper.discoveryLinks[0].label = "";
    expect(() => validateLibraryReferences(data)).toThrow("label");
  });
  test("accepts public URLs without altering their spelling or query", () => {
    for (const url of ["https://example.org/Article?version=2#abstract", "http://papers.example.edu/", "https://8.8.8.8/"]) {
      expect(() => validatePublicReference(url, "test")).not.toThrow();
    }
  });
  test("rejects malformed sidecar containers and entries before publication", () => {
    const data = fixture();
    for (const bad of [null, [], false, "not an object"]) {
      expect(() => validateLibraryReferences({ ...data, provenance: bad })).toThrow("Provenance must be an object");
      expect(() => validateLibraryReferences({ ...data, intake: bad })).toThrow("Intake must be an object");
      expect(() => validateLibraryReferences({ ...data, provenance: { paper: bad } })).toThrow("must be an object");
      expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, entries: [bad] } })).toThrow("must be an object");
    }
    expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, entries: {} } })).toThrow("entries must be an array");
  });
  test("checks the coverage shape and types consumed by the inbox", () => {
    const data = fixture();
    for (const coverage of [undefined, null, [], "missing"]) {
      expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, coverage } })).toThrow("Intake.coverage");
    }
    for (const coverage of [{ edgeTabs: "198" }, { edgeWindows: -1 }, { edgeUniqueUrls: 1.5 }, { edgeTabs: NaN }, { xStatus: {} }, { xComplete: "false" }]) {
      expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, coverage } })).toThrow("Intake.coverage");
    }
    expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, coverage: { edgeTabs: 0, edgeWindows: 4, edgeUniqueUrls: 190, xStatus: "Partial review", xComplete: false } } })).not.toThrow();
  });
  test("accepts ISO record dates without requiring timestamps or altering publication precision", () => {
    const data = fixture();
    for (const date of ["2026-10-10", "2024-02-29", "2026-10-10T04:00:00Z", "2026-10-10T11:00:00.123+07:00", "2026-10-10T00:30-03:00"]) {
      expect(() => validateLibraryReferences({
        ...data,
        provenance: { paper: { ...data.provenance.paper, capturedAt: date, verifiedAt: date } },
        intake: { ...data.intake, updatedAt: date, entries: [{ ...data.intake.entries[0], verifiedAt: date }] },
      })).not.toThrow();
    }
  });
  test("rejects invalid or ambiguous record dates that can crash date rendering", () => {
    const data = fixture();
    for (const date of [undefined, "", "not a date", 2026, {}, "2026-02-30", "2026-13-01", "2026-10-10T04:00:00", "10/10/2026"]) {
      expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, updatedAt: date } })).toThrow("Intake.updatedAt");
      if (date === undefined) continue;
      expect(() => validateLibraryReferences({ ...data, intake: { ...data.intake, entries: [{ ...data.intake.entries[0], verifiedAt: date }] } })).toThrow("verifiedAt");
      for (const key of ["capturedAt", "verifiedAt"]) {
        expect(() => validateLibraryReferences({ ...data, provenance: { paper: { ...data.provenance.paper, [key]: date } } })).toThrow(key);
      }
    }
  });
  test("checks optional provenance notes even without primary verification", () => {
    const data = fixture();
    expect(() => validateLibraryReferences({ ...data, provenance: { paper: { verification: "metadata-only", note: {} } } })).toThrow("note must be a string");
  });
  test.each([
    "file:///Users/example/private", "javascript:alert(1)", "/relative", "https://name:secret@example.com/",
    "http://localhost:5273/", "https://sub.localhost/", "http://machine.local/", "http://127.0.0.1/",
    "http://127.1/", "http://2130706433/", "http://10.1.2.3/", "http://172.16.0.1/", "http://192.168.1.1/",
    "http://169.254.169.254/", "http://0.0.0.0/", "http://[::1]/", "http://[::]/", "http://[fc00::1]/",
    "http://[fe80::1]/", "http://[::ffff:127.0.0.1]/",
  ])("rejects non-public reference %s", url => {
    expect(() => validatePublicReference(url, "test")).toThrow();
  });
});
