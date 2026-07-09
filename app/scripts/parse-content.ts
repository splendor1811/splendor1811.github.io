// Bun script: read ../Library/*.md (canonical Markdown), parse into a typed bundle,
// and write src/data/content.json. Runs automatically on predev/prebuild.

import { readFile, writeFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { TOPIC_STYLES } from "../src/data/topics";
import { parseSubpage, parsePriorityQueue, buildTags } from "../src/data/parser/parse";
import type { ContentBundle, Resource, Topic } from "../src/data/schema";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "..");
const libraryDir = join(appDir, "..", "Library");
const libraryIndex = join(appDir, "..", "Library.md");
const outFile = join(appDir, "src", "data", "content.json");

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

  console.log(
    `✓ Parsed ${resources.length} resources across ${topics.length} topics → src/data/content.json`,
  );
  console.log(`  ${bundle.tags.length} unique tags · ${priorityQueue.length} priority items`);
  if (missing.length) console.warn(`  ⚠ missing topic files: ${missing.join(", ")}`);
  if (orphanFiles.length)
    console.warn(`  ⚠ un-styled .md files (add to TOPIC_STYLES): ${orphanFiles.join(", ")}`);
}

main().catch((err) => {
  console.error("Failed to parse content:", err);
  process.exit(1);
});
