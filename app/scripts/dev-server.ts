// Optional local writeback server (Bun + Hono). Run with `bun run serve` alongside `bun run dev`.
// Lets the "Add resource" form append entries back into the canonical Library Markdown,
// then regenerates content.json so the change shows up via Vite HMR.
// This is intentionally NOT part of the static build — the hosted site degrades to snippet-copy.

import { Hono } from "hono";
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { writeResourceEntry } from "./resource-writeback";

const here = dirname(fileURLToPath(import.meta.url));
const appDir = join(here, "..");
const libraryDir = join(appDir, "..", "Library");

const app = new Hono();

app.get("/api/health", (c) => c.json({ ok: true }));

app.post("/api/resources", async (c) => {
  const input = await c.req.json().catch(() => null);
  const result = await writeResourceEntry(input, {
    readTopic: (title) => readFile(join(libraryDir, `${title}.md`), "utf8"),
    writeTopic: (title, markdown) => writeFile(join(libraryDir, `${title}.md`), markdown, "utf8"),
    rebuild: () => spawnSync("bun", ["run", "scripts/parse-content.ts"], { cwd: appDir }).status === 0,
  }, c.req.header("Origin"));
  if (result.status !== 200) return c.text(result.message, result.status);
  return c.json({ ok: true, file: result.file });
});

const port = 5274;
console.log(`✓ Second Brain writeback server on http://127.0.0.1:${port}`);
export default { hostname: "127.0.0.1", port, fetch: app.fetch };
