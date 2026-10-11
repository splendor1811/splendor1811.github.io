import { expect, test } from "bun:test";
import content from "../../data/content.json";
import { LEARNING_PATHS } from "./paths";

const resources = new Map(content.resources.map(resource => [resource.id, resource]));

test("guided paths reference distinct, reviewed library sources in ordered stages", () => {
  expect(Object.keys(LEARNING_PATHS).sort()).toEqual(["diffusion-flow-matching", "post-training-alignment", "reinforcement-learning"]);

  for (const [slug, path] of Object.entries(LEARNING_PATHS)) {
    expect(path.topicSlug).toBe(slug);
    expect(path.stages.length).toBeGreaterThanOrEqual(5);
    const stageIds = new Set<string>();
    const resourceIds = new Set<string>();
    const urls = new Set<string>();

    for (const stage of path.stages) {
      expect(stageIds.has(stage.id)).toBe(false);
      stageIds.add(stage.id);
      expect(stage.resourceIds.length).toBeGreaterThanOrEqual(2);
      expect(stage.checkpoint.length).toBeGreaterThan(0);

      for (const id of stage.resourceIds) {
        const resource = resources.get(id);
        expect(resource, `${slug}: missing ${id}`).toBeDefined();
        expect(resource!.markers.unverified, `${slug}: unverified ${id}`).toBe(false);
        expect(resourceIds.has(id), `${slug}: repeated ${id}`).toBe(false);
        resourceIds.add(id);
        const url = new URL(resource!.url);
        const canonical = `${url.hostname}${url.pathname.replace(/\/$/, "")}`;
        expect(urls.has(canonical), `${slug}: duplicate source ${resource!.url}`).toBe(false);
        urls.add(canonical);
      }
    }
  }
});
