import { expect, test } from "bun:test";
import { fileURLToPath } from "node:url";
import { resources } from "../src/lib/content";
import { additionDate, firstSeenFromHistory } from "./library-added-at";

const legacyOverrides = new Map([
  ["on-policy-distillation__on-policy-distillation", "2026-07-09T12:00:50+07:00"],
  ["thinking-machines-lab__on-policy-distillation", "2026-07-09T12:00:50+07:00"],
  ["llm-architecture-scaling-laws__linear-attention-explained", "2026-08-06T22:02:47+07:00"],
  ["llm-architecture-scaling-laws__linear-attention-explained-part-1", "2026-08-06T22:06:10+07:00"],
  ["gpu-cuda-kernels__inside-nvidia-gpus-anatomy-of-high-performance-matmul-kernels", "2026-08-09T20:50:55+07:00"],
  ["gpu-cuda-kernels__inside-nvidia-gpus-anatomy-of-high-performance-matmul-kernels-2", "2026-07-09T12:00:50+07:00"],
  ["reinforcement-learning__cs-185-285-deep-reinforcement-learning-decision-making-and-control-spring-2026", "2026-08-23T23:41:31+07:00"],
]);

test("a unique URL keeps the earliest Library commit when stable IDs were introduced later", () => {
  const history = {
    byId: new Map([["resource", "2026-10-10T00:00:00Z"]]),
    byUrl: new Map([["https://example.com/paper", "2026-07-09T00:00:00Z"]]),
  };
  expect(additionDate({ id: "resource", url: "https://example.com/paper" }, history, new Map([["https://example.com/paper", 1]])))
    .toBe("2026-07-09T00:00:00Z");
  expect(additionDate({ id: "resource", url: "https://example.com/paper" }, history, new Map([["https://example.com/paper", 2]])))
    .toBe("2026-10-10T00:00:00Z");
});

test("every published addition date is backed by Git history or an audited legacy identity", () => {
  const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
  const firstSeen = firstSeenFromHistory(repoRoot);
  const urlCounts = new Map<string, number>();
  for (const resource of resources) urlCounts.set(resource.url, (urlCounts.get(resource.url) ?? 0) + 1);

  expect(resources.length).toBeGreaterThanOrEqual(461);
  expect(resources.filter(resource => !resource.addedAt)).toEqual([]);
  expect(resources.filter(resource => resource.addedAt === "2026-07-09T12:00:50+07:00")).toHaveLength(178);
  expect(resources.filter(resource => resource.addedAt! < "2026-10")).toHaveLength(213);
  for (const resource of resources) {
    expect(resource.addedAt).toBe(legacyOverrides.get(resource.id) ?? additionDate(resource, firstSeen, urlCounts));
    if (legacyOverrides.has(resource.id)) expect(resource.provenance?.addedAt).toBe(legacyOverrides.get(resource.id));
  }
});
