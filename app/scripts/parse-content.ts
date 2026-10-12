// Bun script: read ../Library/*.md (canonical Markdown), parse into a typed bundle,
// and write src/data/content.json. Runs automatically on predev/prebuild.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TOPIC_STYLES } from "../src/data/topics";
import { parseSubpage, parsePriorityQueue, buildTags } from "../src/data/parser/parse";
import type { ContentBundle, Resource, Topic } from "../src/data/schema";
import { validateLibraryReferences } from "./validate-library";
import { additionDate, firstSeenFromHistory } from "./library-added-at";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "..");
const libraryDir = join(appDir, "..", "Library");
const libraryIndex = join(appDir, "..", "Library.md");
const outFile = join(appDir, "src", "data", "content.json");
const intakeFile = join(appDir, "src", "data", "intake.json");

async function readOptionalJson<T>(path: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw error;
  }
}

async function main() {
  const files = await readdir(libraryDir);
  const mdFiles = new Set(files.filter((f) => f.endsWith(".md")));

  const topics: Topic[] = [];
  const resources: Resource[] = [];
  const missing: string[] = [];

  for (const style of TOPIC_STYLES) {
    const filename = `${style.title}.md`;
    if (!mdFiles.has(filename)) {
      missing.push(filename);
      continue;
    }
    const markdown = await readFile(join(libraryDir, filename), "utf8");
    const { topic, resources: topicResources } = parseSubpage({
      slug: style.slug,
      title: style.title,
      color: style.color,
      icon: style.icon,
      short: style.short,
      markdown,
    });
    topics.push(topic);
    resources.push(...topicResources);
  }

  // Any .md file not covered by TOPIC_STYLES is a new topic the styles list should learn about.
  const knownFiles = new Set(TOPIC_STYLES.map((s) => `${s.title}.md`));
  const orphanFiles = [...mdFiles].filter((f) => !knownFiles.has(f));
  if (missing.length) throw new Error(`Missing topic files: ${missing.join(", ")}`);
  if (orphanFiles.length) throw new Error(`Unregistered topic files: ${orphanFiles.join(", ")}`);

  const ids = new Set<string>();
  for (const resource of resources) {
    if (ids.has(resource.id)) throw new Error(`Duplicate resource ID across topics: ${resource.id}`);
    ids.add(resource.id);
  }

  const provenance = await readOptionalJson<Record<string, NonNullable<Resource["provenance"]>>>(join(libraryDir, "provenance.json"), {});
  const intake = await readOptionalJson(join(libraryDir, "intake.json"), { updatedAt: null, coverage: {}, entries: [] });
  validateLibraryReferences({ resources, topicSlugs: new Set(topics.map(topic => topic.slug)), provenance, intake });
  const firstSeen = firstSeenFromHistory(join(appDir, ".."));
  const urlCounts = new Map<string, number>();
  for (const resource of resources) urlCounts.set(resource.url, (urlCounts.get(resource.url) ?? 0) + 1);
  for (const resource of resources) {
    if (Object.prototype.hasOwnProperty.call(provenance, resource.id)) resource.provenance = provenance[resource.id];
    resource.addedAt = resource.provenance?.addedAt ?? additionDate(resource, firstSeen, urlCounts);
  }
  const withoutAdditionDate = resources.filter(resource => !resource.addedAt).map(resource => resource.id);
  if (withoutAdditionDate.length) {
    const message = `No Library addition date for ${withoutAdditionDate.length} resources: ${withoutAdditionDate.slice(0, 5).join(", ")}`;
    if (process.env.CI) throw new Error(message);
    console.warn(`⚠ ${message} (uncommitted entries are expected during local editing)`);
  }

  let priorityQueue: ContentBundle["priorityQueue"] = [];
  try {
    priorityQueue = parsePriorityQueue(await readFile(libraryIndex, "utf8"));
  } catch {
    // Library.md is optional for the app to function.
  }

  const bundle: ContentBundle = {
    generatedAt: new Date().toISOString(),
    resources,
    topics,
    priorityQueue,
    tags: buildTags(resources),
  };

  await writeFile(outFile, JSON.stringify(bundle, null, 2) + "\n", "utf8");
  await writeFile(intakeFile, JSON.stringify(intake, null, 2) + "\n", "utf8");

  console.log(
    `✓ Parsed ${resources.length} resources across ${topics.length} topics → src/data/content.json`,
  );
  console.log(`  ${bundle.tags.length} unique tags · ${priorityQueue.length} priority items`);
}

main().catch((err) => {
  console.error("Failed to parse content:", err);
  process.exit(1);
});
