import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { canonicalUrl } from "../src/lib/canonical-url";
import { validateLibraryReferences } from "./validate-library";

const repo = resolve(import.meta.dir, "../..");
const localAudit = resolve(repo, ".local-audit/weekly-sync");
const intakePath = resolve(repo, "Library/intake.json");
const capturePath = resolve(import.meta.dir, "capture-x.ts");
const publicRepo = "https://github.com/splendor1811/splendor1811.github.io.git";
const now = new Date();
const checkedAt = now.toISOString();
const lastRunPath = resolve(localAudit, "last-run.json");
const results = { checkedAt, x: "skipped", xCandidates: 0, lilianCandidates: 0, published: false, reason: "" };
mkdirSync(localAudit, { recursive: true });

let lastRun: Record<string, any> = {};
try { lastRun = JSON.parse(readFileSync(lastRunPath, "utf8")); } catch (error) {
  if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
}

function command(program: string, args: string[], options: { cwd?: string; maxBuffer?: number; timeout?: number } = {}) {
  return execFileSync(program, args, {
    cwd: options.cwd ?? repo,
    encoding: "utf8",
    timeout: options.timeout ?? 30_000,
    maxBuffer: options.maxBuffer ?? 4 * 1024 * 1024,
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  }).trim();
}

function atomicWrite(path: string, value: unknown) {
  const temp = `${path}.tmp`;
  writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  renameSync(temp, path);
}

function checkWorkingTree(): boolean {
  if (command("git", ["status", "--porcelain"])) {
    throw new Error("Local worktree has user changes; weekly sync skipped without staging them.");
  }
  if (command("git", ["branch", "--show-current"]) !== "main") {
    throw new Error("Weekly sync publishes only from the main branch.");
  }
  const remoteSha = command("gh", ["api", "repos/splendor1811/splendor1811.github.io/commits/main", "--jq", ".sha"]);
  const head = command("git", ["rev-parse", "HEAD"]);
  if (head === remoteSha) return false;
  const parent = command("git", ["rev-parse", "HEAD^"]);
  const subject = command("git", ["log", "-1", "--format=%s"]);
  if (parent === remoteSha && subject.startsWith("Second Brain weekly inbox sync ")) {
    command("git", ["-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential", "push", publicRepo, "main"]);
    results.published = true;
    results.reason = "Recovered and published the previous weekly inbox sync commit.";
    return true;
  }
  throw new Error("Local main differs from GitHub main; sync skipped until the repository is caught up.");
}

function locateRepostTab(): { windowId: string; tabId: string } | null {
  try { command("pgrep", ["-x", "Microsoft Edge"], { maxBuffer: 100_000 }); }
  catch { return null; }
  const jxa = `const app=Application("Microsoft Edge");const matches=[];for(const w of app.windows()){for(const t of w.tabs()){if(/^https:\\/\\/(?:www\\.)?(?:x|twitter)\\.com\\/Splendor1811\\/reposts(?:[/?#]|$)/i.test(t.url()))matches.push({windowId:String(w.id()),tabId:String(t.id())})}}JSON.stringify(matches)`;
  const matches = JSON.parse(command("osascript", ["-l", "JavaScript", "-e", jxa], { maxBuffer: 100_000 })) as { windowId: string; tabId: string }[];
  // A stale renderer can time out even while a newer repost tab works. Prefer
  // the most recently opened matching tab instead of Edge's window order.
  return matches.sort((a, b) => Number(b.tabId) - Number(a.tabId))[0] ?? null;
}

function parseXmlText(value: string): string {
  return value.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").trim();
}

function xmlTag(item: string, tag: string): string | null {
  const found = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return found ? parseXmlText(found[1]) : null;
}

async function lilianCandidates(existingUrls: Set<string>) {
  const response = await fetch("https://lilianweng.github.io/index.xml", { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Lilian Weng RSS returned HTTP ${response.status}`);
  const xml = await response.text();
  const previousCheck = Date.parse(lastRun.lilianFeedCheckedAt ?? "");
  const cutoff = Number.isFinite(previousCheck) ? previousCheck - 7 * 24 * 60 * 60 * 1000 : now.getTime() - 90 * 24 * 60 * 60 * 1000;
  const rows = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].flatMap(([_, item]) => {
    const title = xmlTag(item, "title");
    const url = xmlTag(item, "link");
    const rawDate = xmlTag(item, "pubDate");
    const published = rawDate ? Date.parse(rawDate) : NaN;
    if (!title || !url || !Number.isFinite(published) || published < cutoff) return [];
    let parsed: URL;
    try { parsed = new URL(url); } catch { return []; }
    if (parsed.hostname !== "lilianweng.github.io" || !parsed.pathname.startsWith("/posts/")) return [];
    const normalized = `${parsed.origin}${parsed.pathname}`;
    if (existingUrls.has(normalized)) return [];
    const id = `lilianweng-${createHash("sha256").update(normalized).digest("hex").slice(0, 20)}`;
    return [{ id, title, url: normalized, source: "Lilian Weng / Lil’Log", status: "needs-review", note: `Automatically detected in the public RSS feed on ${now.toISOString().slice(0, 10)} (published ${new Date(published).toISOString().slice(0, 10)}). Article content has not been reviewed or summarized.` }];
  });
  return { entries: rows, checkedAt };
}

async function main() {
  if (checkWorkingTree()) {
    atomicWrite(lastRunPath, { ...lastRun, ...results });
    console.log(JSON.stringify(results));
    return;
  }
  command("bun", ["run", "scripts/parse-content.ts"], { cwd: resolve(repo, "app"), timeout: 60_000 });
  const intake = JSON.parse(readFileSync(intakePath, "utf8"));
  const content = JSON.parse(readFileSync(resolve(import.meta.dir, "../src/data/content.json"), "utf8"));
  const provenance = JSON.parse(readFileSync(resolve(repo, "Library/provenance.json"), "utf8"));
  const existingUrls = new Set<string>([
    ...content.resources.map((resource: any) => canonicalUrl(resource.url)),
    ...intake.entries.map((entry: any) => canonicalUrl(entry.url)),
  ]);
  const candidates: Record<string, unknown>[] = [];

  const tab = locateRepostTab();
  if (tab) {
    try {
      const captured = command("bun", [capturePath, "--window", tab.windowId, "--tab", tab.tabId, "--pages", "60", "--preserve-scroll", "--skip-focused"], { maxBuffer: 8 * 1024 * 1024, timeout: 180_000 });
      const reportLine = captured.split("\n").reverse().find(line => line.startsWith("{"));
      const report = reportLine ? JSON.parse(reportLine) : null;
      if (!report?.output || report.stopReason === "capture-error" || report.stopReason === "scheduled-capture-stopped-when-tab-became-focused") throw new Error("X timeline capture did not complete; details are in the local sync log.");
      const snapshot = JSON.parse(readFileSync(report.output, "utf8"));
      const seen = new Set(intake.entries.map((entry: any) => entry.id));
      const roots = snapshot.posts.filter((post: any) => ["You reposted", "Bạn đã đăng lại"].includes(post.socialContext));
      const relevant = roots.filter((post: any) => {
        const text = `${post.text ?? ""} ${post.links?.map((link: any) => link.label).join(" ") ?? ""}`;
        // An external link alone is not enough: finance/lifestyle reposts do
        // not belong in the public AI research inbox.
        return /\b(ai|ml|llm|model|training|inference|serving|reinforcement|rlvr|grpo|diffusion|flow matching|gpu|cuda|kernel|agent|benchmark|evaluation|eval|dataset|tokenizer|post-training|distillation|transformer|attention|neural|speech|audio)\b/i.test(text);
      });
      for (const post of relevant.slice(0, 50)) {
        const idPart = post.statusUrl?.match(/\/status\/(\d+)/)?.[1];
        const author = post.statusUrl?.match(/^https:\/\/x\.com\/([A-Za-z0-9_]{1,15})\/status\//)?.[1];
        if (!idPart || !author) continue;
        const id = `x-repost-${idPart}`;
        if (seen.has(id)) continue;
        candidates.push({
          id,
          capturedAt: checkedAt,
          title: `X repost for source review · @${author}`,
          url: post.statusUrl,
          source: `X · @${author}`,
          status: "needs-review",
          note: `Captured automatically from the visible repost timeline on ${now.toISOString().slice(0, 10)}. Check the post, the author’s replies for source links, and any linked material. Exact repost time is unavailable; no technical summary has been reviewed.`,
        });
        seen.add(id);
      }
      results.x = "checked";
      results.xCandidates = candidates.length;
    } catch (error) {
      results.x = "skipped";
      results.reason = String(error);
    }
  } else {
    results.reason = "No open Edge tab matched Splendor1811/reposts; X capture was skipped.";
  }

  try {
    const urlSet = new Set(existingUrls);
    for (const candidate of candidates) urlSet.add(canonicalUrl(String(candidate.url)));
    const lilian = await lilianCandidates(urlSet);
    candidates.push(...lilian.entries);
    results.lilianCandidates = lilian.entries.length;
    lastRun.lilianFeedCheckedAt = lilian.checkedAt;
  } catch (error) {
    results.reason = [results.reason, `Lilian Weng feed: ${String(error)}`].filter(Boolean).join(" ");
  }

  if (!candidates.length) {
    atomicWrite(lastRunPath, { ...lastRun, ...results });
    console.log(JSON.stringify(results));
    return;
  }
  intake.entries.push(...candidates);
  intake.updatedAt = checkedAt;
  intake.coverage.xStatus = `${intake.coverage.xStatus} Weekly sync checked ${checkedAt.slice(0, 10)}; ${candidates.length} unreviewed references were added.`;
  validateLibraryReferences({ resources: content.resources, topicSlugs: new Set(content.topics.map((topic: any) => topic.slug)), provenance, intake });
  atomicWrite(intakePath, intake);
  command("git", ["add", "--", "Library/intake.json"]);
  command("git", ["commit", "-m", `Second Brain weekly inbox sync ${checkedAt.slice(0, 10)}`]);
  try {
    command("git", ["-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential", "push", publicRepo, "main"]);
    results.published = true;
  } catch (error) {
    results.reason = `Inbox commit created locally but push failed: ${String(error)}`;
    throw error;
  }
  atomicWrite(lastRunPath, { ...lastRun, ...results });
  console.log(JSON.stringify(results));
}

try {
  await main();
} catch (error) {
  results.reason = String(error);
  atomicWrite(lastRunPath, { ...lastRun, ...results });
  console.error(JSON.stringify(results));
  process.exitCode = 1;
}
