import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalUrl as canonical } from "../src/lib/canonical-url";

// Read tab metadata only. Never reads cookies, credentials, or browser databases.
const script = `const app = Application("Microsoft Edge"); JSON.stringify(app.windows().map(w => ({id:w.id(), tabs:w.tabs().map(t=>({id:t.id(),title:t.title(),url:t.url()}))})))`;
const windows = JSON.parse(execFileSync("osascript", ["-l", "JavaScript", "-e", script], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 }));
const capturedAt = new Date().toISOString();
const dir = resolve(import.meta.dir, "../../.local-audit");
mkdirSync(dir, { recursive: true });
const resources = JSON.parse(readFileSync(resolve(import.meta.dir, "../src/data/content.json"), "utf8")).resources;
const groups = new Map<string, any>();
for (const w of windows) for (const t of w.tabs) {
  const key = canonical(t.url);
  let row = groups.get(key);
  if (!row) {
    row = { title: t.title, url: t.url, canonicalUrl: key, occurrences: [], existingResources: resources.filter((r: any) => canonical(r.url) === key).map((r: any) => ({id: r.id, title: r.title, topicSlug: r.topicSlug})), reviewStatus: "pending" };
    groups.set(key, row);
  }
  row.occurrences.push({windowId: w.id, tabId: t.id, url: t.url, title: t.title});
}
const snapshot = { capturedAt, windowCount: windows.length, tabCount: windows.reduce((n: number, w: any) => n+w.tabs.length,0), windows };
const inventory = { capturedAt, windowCount: snapshot.windowCount, tabCount: snapshot.tabCount, uniqueCount: groups.size, entries: [...groups.values()] };
writeFileSync(resolve(dir, "edge-tabs.json"), JSON.stringify(snapshot, null, 2)+"\n");
writeFileSync(resolve(dir, "source-inventory.json"), JSON.stringify(inventory, null, 2)+"\n");
console.log(JSON.stringify({ windows: snapshot.windowCount, tabs: snapshot.tabCount, unique: groups.size, alreadyInLibrary: inventory.entries.filter(r=>r.existingResources.length).length, needsReview: inventory.entries.filter(r=>!r.existingResources.length).length, output: dir }));
