/** Stable public addition dates: first Git commit that contained a Library entry.
 * Acquisition/capture and publication dates are deliberately separate.
 */
import { spawnSync } from "node:child_process";
import { parseEntryHead, parseResourceIdComment } from "../src/data/parser/parse";
import type { Resource } from "../src/data/schema";

interface FirstSeen { byId: Map<string, string>; byUrl: Map<string, string> }

function git(repoRoot: string, args: string[]): string {
  const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`Cannot read Library Git history: git ${args[0]} exited ${result.status}: ${result.stderr.trim()}`);
  return result.stdout;
}

export function firstSeenFromHistory(repoRoot: string): FirstSeen {
  const byId = new Map<string, string>();
  const byUrl = new Map<string, string>();
  const commits = git(repoRoot, ["log", "--reverse", "--format=%H%x09%cI", "--", "Library"])
    .split("\n").filter(line => /^[a-f0-9]{40}\t/.test(line));
  for (const line of commits) {
    const [sha, at] = line.split("\t");
    const matches = git(repoRoot, ["grep", "-h", "-F", "-e", "resource-id:", "-e", "- **[", sha, "--", "Library"]);
    for (const source of matches.split("\n")) {
      const id = parseResourceIdComment(source);
      if (id && !byId.has(id)) byId.set(id, at);
      const entry = parseEntryHead(source);
      if (entry && !byUrl.has(entry.url)) byUrl.set(entry.url, at);
    }
  }
  return { byId, byUrl };
}

export function additionDate(resource: Pick<Resource, "id" | "url">, firstSeen: FirstSeen, urlCounts: Map<string, number>): string | undefined {
  const byId = firstSeen.byId.get(resource.id);
  const byUrl = urlCounts.get(resource.url) === 1 ? firstSeen.byUrl.get(resource.url) : undefined;
  if (!byId) return byUrl;
  if (!byUrl) return byId;
  return Date.parse(byUrl) < Date.parse(byId) ? byUrl : byId;
}
