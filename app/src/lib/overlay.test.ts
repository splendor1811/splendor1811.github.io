import { expect, test } from "bun:test";
import { applyOverlay, confirmedOverlayIds, mergeOverlayPatch, type OverlayRecord } from "./overlay";
import { DEFAULT_RESOURCE_GROUP } from "./mdWriteback";
import type { Resource } from "@/data/schema";

const article: Resource = { id:"stable-id",title:"Article",url:"https://example.com/article",type:"Paper",source:"Author",dateRaw:"2026",dateSort:"2026-01-01",topicSlug:"research",group:"Papers",summary:"Verified summary",keyConcepts:["attention"],markers:{star:false,startHere:false,unverified:false}};
test("unrelated rebuild never drops a pending addition or unconfirmed edit", () => {
  const rows: OverlayRecord[] = [
    {id:"new",createdAt:1,data:{kind:"new",resource:{...article,id:"new"}}},
    {id:article.id,createdAt:1,data:{kind:"patch",patch:{summary:"Pending edit"}}},
  ];
  expect(confirmedOverlayIds(100,[article],rows)).toEqual([]);
  expect(applyOverlay([article], rows).map(r=>r.summary)).toEqual(["Pending edit","Verified summary"]);
});
test("only confirmed changes older than the bundle are reconciled", () => {
  const edit: OverlayRecord = {id:article.id,createdAt:1,data:{kind:"patch",patch:{summary:article.summary}}};
  expect(confirmedOverlayIds(100,[article],[edit])).toEqual([article.id]);
  expect(confirmedOverlayIds(0,[article],[edit])).toEqual([]);
  expect(confirmedOverlayIds(100,[],[edit])).toEqual([]);
});

test("editing a new resource keeps it visible before its first build", () => {
  const addition: OverlayRecord = { id: article.id, createdAt: 1, data: { kind: "new", resource: article } };
  const edited = mergeOverlayPatch(article.id, { summary: "Latest edit" }, addition, 2);
  expect(edited.data.kind).toBe("new");
  expect(edited.createdAt).toBe(2);
  expect(applyOverlay([], [edited])).toEqual([{ ...article, summary: "Latest edit" }]);
  expect(addition.data).toEqual({ kind: "new", resource: article });
  expect(confirmedOverlayIds(100, [], [edited])).toEqual([]);
});

test("an intermediate build cannot hide edits to a pending addition", () => {
  const addition: OverlayRecord = { id: article.id, createdAt: 1, data: { kind: "new", resource: article } };
  const edited = mergeOverlayPatch(article.id, { summary: "Latest edit" }, addition, 2);
  const withProvenance: Resource = { ...article, provenance: { origin: "manual" } };
  expect(applyOverlay([withProvenance], [edited])).toEqual([{ ...withProvenance, summary: "Latest edit" }]);
  expect(confirmedOverlayIds(100, [article], [edited])).toEqual([]);
  expect(confirmedOverlayIds(100, [{ ...article, summary: "Latest edit" }], [edited])).toEqual([article.id]);
});

test("successive partial edits retain every pending field", () => {
  const first = mergeOverlayPatch(article.id, { summary: "First edit" }, undefined, 1);
  const second = mergeOverlayPatch(article.id, { source: "Updated author" }, first, 2);
  const third = mergeOverlayPatch(article.id, { summary: "Latest edit" }, second, 3);
  expect(third).toEqual({
    id: article.id,
    createdAt: 3,
    data: { kind: "patch", patch: { summary: "Latest edit", source: "Updated author" } },
  });
  expect(applyOverlay([article], [third])).toEqual([{ ...article, summary: "Latest edit", source: "Updated author" }]);
  expect(confirmedOverlayIds(100, [{ ...article, summary: "Latest edit" }], [third])).toEqual([]);
  expect(first.data).toEqual({ kind: "patch", patch: { summary: "First edit" } });
});

test("edits cannot replace a resource identity or cross resource records", () => {
  const addition: OverlayRecord = { id: article.id, createdAt: 1, data: { kind: "new", resource: article } };
  expect(() => mergeOverlayPatch(article.id, { id: "other-id" }, addition, 2)).toThrow("stable ID");
  expect(() => mergeOverlayPatch("other-id", { summary: "Wrong resource" }, addition, 2)).toThrow("different resources");
});

test("legacy blank default groups reconcile only when all other fields match", () => {
  const addition: OverlayRecord = { id: article.id, createdAt: 1, data: { kind: "new", resource: { ...article, group: "" } } };
  const canonical = { ...article, group: DEFAULT_RESOURCE_GROUP };
  expect(confirmedOverlayIds(100, [canonical], [addition])).toEqual([article.id]);
  expect(confirmedOverlayIds(100, [{ ...canonical, summary: "An older version" }], [addition])).toEqual([]);
  expect(confirmedOverlayIds(100, [{ ...canonical, group: "Other group" }], [addition])).toEqual([]);
  const groupEdit: OverlayRecord = { id: article.id, createdAt: 1, data: { kind: "patch", patch: { group: "" } } };
  expect(confirmedOverlayIds(100, [canonical], [groupEdit])).toEqual([]);
});

test("matching values are still retained until a build newer than the latest edit", () => {
  const edited = mergeOverlayPatch(article.id, { summary: article.summary }, undefined, 20);
  expect(confirmedOverlayIds(20, [article], [edited])).toEqual([]);
  expect(confirmedOverlayIds(21, [article], [edited])).toEqual([article.id]);
});
