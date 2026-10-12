// GitHub Pages serves a directory's index.html with HTTP 200. Give every known
// BrowserRouter URL a copy of Vite's entry shell, without rewriting its asset URLs.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SOURCE_TOPIC_REDIRECTS, TOPIC_ALIASES } from "../src/data/topics";

export const APP_ROUTES = [
  "/", "/library", "/sources", "/topics", "/graph", "/roadmap",
  "/review", "/activity", "/favorites", "/settings", "/add", "/account",
] as const;

interface RouteContent {
  resources: { id: string }[];
  topics: { slug: string }[];
}

function safeSegment(segment: string): string {
  // IDs may contain the parser's colon separator, but never paths, URL escapes,
  // query strings, fragments, dot segments, or a Windows drive designation.
  if (!/^[A-Za-z0-9][A-Za-z0-9_:-]*$/.test(segment) || /^[A-Za-z]:$/.test(segment)) {
    throw new Error(`Unsafe static route segment: ${JSON.stringify(segment)}`);
  }
  return segment;
}

export function buildRoutePaths(content: RouteContent): string[] {
  const routes: string[] = [...APP_ROUTES];
  for (const resource of content.resources) routes.push(`/resource/${safeSegment(resource.id)}`);
  const topicSlugs = [
    ...content.topics.map(topic => topic.slug),
    ...Object.keys(TOPIC_ALIASES),
    ...Object.keys(SOURCE_TOPIC_REDIRECTS),
  ];
  for (const slug of topicSlugs) routes.push(`/topics/${safeSegment(slug)}`);
  return [...new Set(routes)].sort();
}

/** Map only a clean app pathname to a file strictly inside the build directory. */
export function routeIndexPath(distDir: string, route: string): string {
  if (!route.startsWith("/") || route.startsWith("//")) throw new Error("Expected an absolute app pathname");
  const pathname = route === "/" ? "" : route.replace(/\/$/, "").slice(1);
  const segments = pathname ? pathname.split("/").map(safeSegment) : [];
  const root = resolve(distDir);
  const target = resolve(root, ...segments, "index.html");
  const within = relative(root, target);
  if (within.startsWith("..") || isAbsolute(within)) throw new Error("Static route escapes the build directory");
  return target;
}

export async function generateRouteShells(distDir: string, content: RouteContent): Promise<number> {
  // Validate the entire route list before creating any output files.
  const routes = buildRoutePaths(content);
  const files = routes.filter(route => route !== "/").map(route => routeIndexPath(distDir, route));
  const html = await readFile(join(distDir, "index.html"), "utf8");
  await Promise.all(files.map(async file => {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html, "utf8");
  }));
  // Unknown or optimistic resource IDs still boot the client through Pages' 404.
  await writeFile(join(distDir, "404.html"), html, "utf8");
  return routes.length;
}

if (import.meta.main) {
  const appDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
  const content = JSON.parse(await readFile(join(appDir, "src/data/content.json"), "utf8")) as RouteContent;
  const count = await generateRouteShells(join(appDir, "dist"), content);
  console.log(`✓ Generated ${count} static route shells and a 404.html fallback`);
}
