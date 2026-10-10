import { expect, test } from "bun:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { SOURCE_TOPIC_REDIRECTS, TOPIC_ALIASES } from "../src/data/topics";
import { APP_ROUTES, buildRoutePaths, generateRouteShells, routeIndexPath } from "./generate-routes";

test("static page list stays in sync with the declared BrowserRouter routes", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  const declared = [...app.matchAll(/<Route\b[^>]*\bpath="([^"]+)"/g)]
    .map(match => match[1]).filter(route => !route.includes(":") && route !== "*");
  const expected: string[] = [...APP_ROUTES];
  expect(expected.sort()).toEqual(declared.sort());
});

test("known pages, resources, canonical topics, and legacy redirects get unique shells", () => {
  const routes = buildRoutePaths({
    resources: [{ id: "topic__article" }, { id: "resource__uuid:part" }, { id: "topic__article" }],
    topics: [{ slug: "foundations-math" }, { slug: "foundations-math" }],
  });
  for (const route of APP_ROUTES) expect(routes).toContain(route);
  expect(routes).toContain("/resource/topic__article");
  expect(routes).toContain("/resource/resource__uuid:part");
  expect(routes).toContain("/topics/foundations-math");
  for (const slug of [...Object.keys(TOPIC_ALIASES), ...Object.keys(SOURCE_TOPIC_REDIRECTS)]) {
    expect(routes).toContain(`/topics/${slug}`);
  }
  expect(routes.length).toBe(new Set(routes).size);
  expect(routes).toEqual([...routes].sort());
});

test("unsafe IDs and topic slugs cannot introduce traversal or URL components", () => {
  for (const value of ["", ".", "..", "../outside", "/absolute", "nested/id", "back\\slash", "%2e%2e", "a?query", "a#hash", "with space", "bad\0id", "C:"]) {
    expect(() => buildRoutePaths({ resources: [{ id: value }], topics: [] })).toThrow("Unsafe static route segment");
    expect(() => buildRoutePaths({ resources: [], topics: [{ slug: value }] })).toThrow("Unsafe static route segment");
  }
});

test("route paths stay inside dist and tolerate one trailing slash", () => {
  const dist = join(tmpdir(), "route-path-test");
  expect(routeIndexPath(dist, "/")).toBe(join(dist, "index.html"));
  expect(routeIndexPath(dist, "/library")).toBe(join(dist, "library", "index.html"));
  expect(routeIndexPath(dist, "/library/")).toBe(routeIndexPath(dist, "/library"));
  for (const route of ["library", "//other-host", "/../outside", "/topics/../../outside", "/topics//bad", "/library//", "/library?q=test", "/library#saved", "/topics/%2e%2e", "/C:/outside"]) {
    expect(() => routeIndexPath(dist, route)).toThrow();
  }
});

test("generated route and fallback HTML preserve Vite's root or project-site asset paths", async () => {
  for (const base of ["/", "/Second_Brain/"]) {
    const dist = await mkdtemp(join(tmpdir(), "research-atlas-routes-"));
    try {
      const html = `<!doctype html><script type="module" src="${base}assets/app.js"></script><div id="root"></div>`;
      await writeFile(join(dist, "index.html"), html, "utf8");
      const content = { resources: [{ id: "stable__resource" }], topics: [{ slug: "canonical-topic" }] };
      expect(await generateRouteShells(dist, content)).toBe(buildRoutePaths(content).length);
      for (const route of buildRoutePaths(content)) expect(await readFile(routeIndexPath(dist, route), "utf8")).toBe(html);
      expect(await readFile(join(dist, "404.html"), "utf8")).toBe(html);
    } finally {
      await rm(dist, { recursive: true, force: true });
    }
  }
});
