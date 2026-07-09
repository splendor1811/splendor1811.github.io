// Optional local writeback server (Bun + Hono). Run with `bun run serve` alongside `bun run dev`.
// Lets the "Add resource" form append entries back into the canonical Library Markdown,
// then regenerates content.json so the change shows up via Vite HMR.
// This is intentionally NOT part of the static build — the hosted site degrades to snippet-copy.

import { Hono } from "hono";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { TOPIC_STYLES } from "../src/data/topics";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "..");
const libraryDir = join(appDir, "..", "Library");

const app = new Hono();

app.get("/api/health", (c) => c.json({ ok: true }));

app.post("/api/resources", async (c) => {
  const { topicSlug, group, markdown } = await c.req.json();
  const style = TOPIC_STYLES.find((s) => s.slug === topicSlug);
  if (!style) return c.text(`Unknown topic: ${topicSlug}`, 400);
  if (!markdown?.startsWith("- **[")) return c.text("Malformed entry", 400);

  const file = join(libraryDir, `${style.title}.md`);
  const original = await readFile(file, "utf8");
  const lines = original.split("\n");

  // Insert after the target "### group" heading, else append a new group at end of file.
  let inserted = false;
  if (group) {
    const idx = lines.findIndex((l) => l.trim() === `### ${group}`);
    if (idx !== -1) {
      lines.splice(idx + 1, 0, markdown);
      inserted = true;
    }
  }
  if (!inserted) {
    lines.push("", `### ${group || "Added via app"}`, markdown);
  }

  await writeFile(file, lines.join("\n"), "utf8");

  // Regenerate content.json so the app picks it up (Vite HMR on the JSON import).
  const result = spawnSync("bun", ["run", "scripts/parse-content.ts"], { cwd: appDir });
  if (result.status !== 0) return c.text("Wrote file but failed to reparse", 500);

  return c.json({ ok: true, file: `${style.title}.md` });
});

const port = 5274;
console.log(`✓ Second Brain writeback server on http://localhost:${port}`);
export default { port, fetch: app.fetch };
