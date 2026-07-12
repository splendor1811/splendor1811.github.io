// Online publishing layer. Lets the deployed UI commit changes straight to the
// canonical Library Markdown in the GitHub repo — no local checkout, no code.
// A fine-grained token (Contents: Read/Write on this repo) is stored locally in
// IndexedDB and only ever sent to api.github.com.

import { getSetting, setSetting } from "@/lib/db";
import { TOPIC_STYLES } from "@/data/topics";

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

/** Guess owner/repo from the deployment URL (e.g. splendor1811.github.io). */
function detectRepo(): { owner: string; repo: string } {
  if (typeof location === "undefined") return { owner: "", repo: "" };
  const host = location.hostname; // <owner>.github.io for user sites
  const owner = host.endsWith(".github.io") ? host.replace(".github.io", "") : "";
  // The build-time base path tells project sites their repo (/<repo>/); user sites use "/".
  const base = import.meta.env.BASE_URL.replace(/\//g, ""); // "" for root, "<repo>" for /<repo>/
  const repo = base || (owner ? `${owner}.github.io` : "");
  return { owner, repo };
}

export const DEFAULT_GITHUB_CONFIG: GitHubConfig = {
  token: "",
  ...detectRepo(),
  branch: "main",
};

export async function getGitHubConfig(): Promise<GitHubConfig> {
  const stored = await getSetting<Partial<GitHubConfig>>("github", {});
  return { ...DEFAULT_GITHUB_CONFIG, ...stored };
}

export async function saveGitHubConfig(patch: Partial<GitHubConfig>) {
  const current = await getGitHubConfig();
  await setSetting("github", { ...current, ...patch });
}

export async function isPublishingConfigured(): Promise<boolean> {
  const c = await getGitHubConfig();
  return Boolean(c.token && c.owner && c.repo);
}

// ---- UTF-8 safe base64 (btoa/atob mangle emoji + accents) ----
function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}
function decodeBase64(b64: string): string {
  const bin = atob(b64.replace(/\n/g, ""));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function api(cfg: GitHubConfig, path: string) {
  return `https://api.github.com/repos/${cfg.owner}/${cfg.repo}${path}`;
}
function headers(cfg: GitHubConfig): HeadersInit {
  return {
    Authorization: `Bearer ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface ConnectionResult {
  ok: boolean;
  canWrite: boolean;
  message: string;
}

export async function testConnection(cfg: GitHubConfig): Promise<ConnectionResult> {
  if (!cfg.token) return { ok: false, canWrite: false, message: "Add a token first." };
  try {
    const res = await fetch(api(cfg, ""), { headers: headers(cfg) });
    if (res.status === 404)
      return { ok: false, canWrite: false, message: "Repo not found — check owner/name or token scope." };
    if (res.status === 401)
      return { ok: false, canWrite: false, message: "Token rejected (401). Check it hasn't expired." };
    if (!res.ok) return { ok: false, canWrite: false, message: `GitHub returned ${res.status}.` };
    const json = await res.json();
    const canWrite = Boolean(json.permissions?.push);
    return {
      ok: true,
      canWrite,
      message: canWrite
        ? `Connected to ${json.full_name}.`
        : "Connected, but this token can't write. Grant Contents: Read/Write.",
    };
  } catch {
    return { ok: false, canWrite: false, message: "Network error reaching GitHub." };
  }
}

function fileForTopic(topicSlug: string): string {
  const style = TOPIC_STYLES.find((s) => s.slug === topicSlug);
  if (!style) throw new Error(`Unknown topic: ${topicSlug}`);
  return `Library/${style.title}.md`;
}

interface FetchedFile {
  content: string;
  sha: string;
}

async function getFile(cfg: GitHubConfig, path: string): Promise<FetchedFile> {
  const res = await fetch(api(cfg, `/contents/${encodeURIComponent(path)}?ref=${cfg.branch}`), {
    headers: headers(cfg),
  });
  if (!res.ok) throw new Error(`Couldn't read ${path} (${res.status})`);
  const json = await res.json();
  return { content: decodeBase64(json.content), sha: json.sha };
}

async function putFile(cfg: GitHubConfig, path: string, content: string, sha: string, message: string) {
  const res = await fetch(api(cfg, `/contents/${encodeURIComponent(path)}`), {
    method: "PUT",
    headers: { ...headers(cfg), "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: encodeBase64(content), sha, branch: cfg.branch }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Commit failed (${res.status})`);
  }
  return res.json();
}

/** Insert a new entry block under the given `### group` (or append a new group). */
export async function publishNewEntry(
  cfg: GitHubConfig,
  topicSlug: string,
  group: string,
  entryMarkdown: string,
): Promise<void> {
  const path = fileForTopic(topicSlug);
  const { content, sha } = await getFile(cfg, path);
  const lines = content.split("\n");

  let inserted = false;
  if (group) {
    const idx = lines.findIndex((l) => l.trim() === `### ${group}`);
    if (idx !== -1) {
      // Insert after the last entry currently in this group (before the next heading).
      let end = idx + 1;
      while (end < lines.length && !lines[end].trim().startsWith("### ")) end++;
      lines.splice(end, 0, entryMarkdown);
      inserted = true;
    }
  }
  if (!inserted) lines.push("", `### ${group || "Added via app"}`, entryMarkdown);

  await putFile(cfg, path, lines.join("\n"), sha, `Add resource: ${firstTitle(entryMarkdown)}`);
}

/** Replace an existing entry (matched by its URL) with new Markdown. */
export async function publishEditEntry(
  cfg: GitHubConfig,
  topicSlug: string,
  url: string,
  newEntryMarkdown: string,
): Promise<void> {
  const path = fileForTopic(topicSlug);
  const { content, sha } = await getFile(cfg, path);
  const lines = content.split("\n");

  const start = lines.findIndex((l) => l.trim().startsWith("- **[") && l.includes(`(${url})`));
  if (start === -1) throw new Error("Couldn't locate this entry in the Markdown — it may have changed.");
  // Entry block runs until its "*Key concepts:*" line (inclusive).
  let end = start;
  while (end < lines.length && !lines[end].trim().startsWith("*Key concepts:*")) end++;

  lines.splice(start, end - start + 1, ...newEntryMarkdown.split("\n"));
  await putFile(cfg, path, lines.join("\n"), sha, `Edit resource: ${firstTitle(newEntryMarkdown)}`);
}

/** Remove an entry (matched by URL). */
export async function publishDeleteEntry(cfg: GitHubConfig, topicSlug: string, url: string): Promise<void> {
  const path = fileForTopic(topicSlug);
  const { content, sha } = await getFile(cfg, path);
  const lines = content.split("\n");
  const start = lines.findIndex((l) => l.trim().startsWith("- **[") && l.includes(`(${url})`));
  if (start === -1) throw new Error("Entry not found in Markdown.");
  let end = start;
  while (end < lines.length && !lines[end].trim().startsWith("*Key concepts:*")) end++;
  lines.splice(start, end - start + 1);
  await putFile(cfg, path, lines.join("\n"), sha, `Remove resource`);
}

function firstTitle(entryMarkdown: string): string {
  const m = entryMarkdown.match(/\*\*\[([^\]]+)\]/);
  return m ? m[1] : "entry";
}

export function actionsUrl(cfg: GitHubConfig): string {
  return `https://github.com/${cfg.owner}/${cfg.repo}/actions`;
}
