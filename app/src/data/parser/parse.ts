// Pure Markdown parser for the Library. No filesystem access here so it can be unit-tested;
// scripts/parse-content.ts handles reading files and writing content.json.

import type {
  PriorityItem,
  Resource,
  ResourceMarkers,
  ResourceType,
  Topic,
} from "@/data/schema";
import { slugify } from "@/data/topics";

const RESOURCE_TYPES: ResourceType[] = [
  "Blog",
  "Paper",
  "Video",
  "Course",
  "Book",
  "Repo",
  "News",
];

export interface EntryHead {
  title: string;
  url: string;
  tail: string; // everything after ")**"
}

/**
 * Split a `- **[Title](url)** …` line into title, url, and the metadata tail.
 * Uses index scanning (not a regex) because titles contain `·`, `()` and `[]`,
 * and URLs contain `&`, `?`, `=`. Returns null if the line isn't an entry.
 */
export function parseEntryHead(line: string): EntryHead | null {
  const trimmed = line.replace(/^\s*-\s+/, "");
  if (!trimmed.startsWith("**[")) return null;
  const bracketOpen = trimmed.indexOf("[");
  const linkClose = trimmed.indexOf("](", bracketOpen);
  if (linkClose === -1) return null;
  const urlStart = linkClose + 2;
  const urlEnd = trimmed.indexOf(")**", urlStart);
  if (urlEnd === -1) return null;
  return {
    title: trimmed.slice(bracketOpen + 1, linkClose).trim(),
    url: trimmed.slice(urlStart, urlEnd).trim(),
    tail: trimmed.slice(urlEnd + 3),
  };
}

function parseMarkers(segments: string[]): ResourceMarkers {
  const joined = segments.join(" ");
  return {
    star: joined.includes("⭐"),
    startHere: joined.includes("🔁"),
    unverified: joined.includes("unverified") || joined.includes("⚠️"),
  };
}

/** Normalize a free-form date field to a sortable YYYY-MM-DD, or null when unknown. */
export function normalizeDate(raw: string): string | null {
  const cleaned = raw.replace(/[*]/g, "").trim();
  if (!cleaned || cleaned === "—" || cleaned === "-" || cleaned === "n.d.") return null;
  const match = cleaned.match(/(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!match) return null;
  const [, y, m, d] = match;
  // Guard against non-month/day numbers (e.g. "2025-26 (Sem I)") — fall back to coarser precision.
  const month = m && Number(m) >= 1 && Number(m) <= 12 ? m : "01";
  const day = month !== "01" || m === "01" ? (d && Number(d) >= 1 && Number(d) <= 31 ? d : "01") : "01";
  return `${y}-${month}-${day}`;
}

export interface ParsedEntry {
  head: EntryHead;
  type: ResourceType;
  source: string;
  dateRaw: string;
  markers: ResourceMarkers;
}

/** Parse the metadata line of an entry (Type · Source · *date* · markers…). */
export function parseEntryMeta(head: EntryHead): ParsedEntry | null {
  const segments = head.tail
    .trim()
    .replace(/^·\s*/, "") // drop the leading separator between `**` and the Type
    .split(" · ")
    .map((s) => s.trim())
    .filter(Boolean);
  if (segments.length < 3) return null;

  const type = segments[0].replace(/`/g, "").trim() as ResourceType;
  if (!RESOURCE_TYPES.includes(type)) return null;
  const source = segments[1];
  const dateRaw = segments[2].replace(/[*]/g, "").trim();
  const markers = parseMarkers(segments.slice(3));

  return { head, type, source, dateRaw, markers };
}

function extractWikilinks(text: string): string[] {
  const out: string[] = [];
  const re = /\[\[([^\]]+)\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const label = m[1].split("|")[0].trim();
    out.push(label);
  }
  return out;
}

export interface SubpageInput {
  slug: string;
  title: string;
  color: string;
  icon: string;
  short: string;
  markdown: string;
}

export interface SubpageResult {
  topic: Topic;
  resources: Resource[];
}

/** Parse a topic subpage into its Topic record + Resource entries. */
export function parseSubpage(input: SubpageInput): SubpageResult {
  const lines = input.markdown.split("\n");
  let intro = "";
  let readingOrder: string | null = null;
  let relatedSlugs: string[] = [];
  const groups: string[] = [];
  const resources: Resource[] = [];
  const seenIds = new Set<string>();

  let currentGroup = "";
  let sawBacklink = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const t = line.trim();

    if (t.startsWith("# ")) continue;
    if (t.startsWith("[[Library")) {
      sawBacklink = true;
      const related = t.split("Related:")[1] ?? "";
      relatedSlugs = extractWikilinks(related)
        .filter((label) => label.toLowerCase() !== "library")
        .map(slugify);
      continue;
    }
    if (t.startsWith("**Suggested reading order:**")) {
      readingOrder = t.replace("**Suggested reading order:**", "").trim();
      continue;
    }
    if (t.startsWith("### ")) {
      currentGroup = t.slice(4).trim();
      if (!groups.includes(currentGroup)) groups.push(currentGroup);
      continue;
    }
    if (t.startsWith(">") || t === "---" || t.startsWith("*Coverage")) continue;

    // Intro = first substantive paragraph after the back-link line.
    if (sawBacklink && !intro && t && !t.startsWith("- **[") && !t.startsWith("*")) {
      intro = t;
      continue;
    }

    if (t.startsWith("- **[")) {
      const head = parseEntryHead(line);
      if (!head) continue;
      const meta = parseEntryMeta(head);
      if (!meta) continue;

      // Gather summary + key concepts from the following indented lines.
      const summaryParts: string[] = [];
      let keyConcepts: string[] = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        const l = lines[j];
        const lt = l.trim();
        if (lt.startsWith("*Key concepts:*")) {
          keyConcepts = lt
            .replace("*Key concepts:*", "")
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);
          j++;
          break;
        }
        if (lt === "" || lt.startsWith("- **[") || lt.startsWith("### ") || lt.startsWith("---")) {
          break;
        }
        summaryParts.push(lt);
      }

      let id = `${input.slug}__${slugify(head.title)}`;
      let n = 2;
      while (seenIds.has(id)) id = `${input.slug}__${slugify(head.title)}-${n++}`;
      seenIds.add(id);

      resources.push({
        id,
        title: head.title,
        url: head.url,
        type: meta.type,
        source: meta.source,
        dateRaw: meta.dateRaw,
        dateSort: normalizeDate(meta.dateRaw),
        topicSlug: input.slug,
        group: currentGroup,
        summary: summaryParts.join(" ").trim(),
        keyConcepts,
        markers: meta.markers,
      });

      i = j - 1;
    }
  }

  return {
    topic: {
      slug: input.slug,
      title: input.title,
      intro,
      readingOrder,
      relatedSlugs,
      groups,
      color: input.color,
      icon: input.icon,
      short: input.short,
      resourceCount: resources.length,
    },
    resources,
  };
}

/** Parse the "Priority queue" bullets from Library.md (a different, simpler format). */
export function parsePriorityQueue(markdown: string): PriorityItem[] {
  const items: PriorityItem[] = [];
  let inQueue = false;
  for (const line of markdown.split("\n")) {
    const t = line.trim();
    if (t.startsWith("## ")) inQueue = t.toLowerCase().includes("priority queue");
    if (!inQueue || !t.startsWith("- **[")) continue;

    const head = parseEntryHead(line);
    if (!head) continue;
    const tail = head.tail;
    const marker: PriorityItem["marker"] = tail.includes("⭐")
      ? "star"
      : tail.includes("🔁")
        ? "startHere"
        : null;
    const wikilinks = extractWikilinks(tail);
    const topicSlug = wikilinks.length ? slugify(wikilinks[wikilinks.length - 1]) : null;
    // Blurb sits between the em dash and the arrow.
    let blurb = tail;
    const dash = tail.indexOf("—");
    const arrow = tail.indexOf("→");
    if (dash !== -1) blurb = tail.slice(dash + 1, arrow === -1 ? undefined : arrow);
    items.push({ title: head.title, url: head.url, blurb: blurb.trim(), topicSlug, marker });
  }
  return items;
}

/** Aggregate key concepts into a tag cloud (deduped case-insensitively). */
export function buildTags(resources: Resource[]): { name: string; count: number }[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const r of resources) {
    for (const concept of r.keyConcepts) {
      const key = concept.toLowerCase();
      const existing = map.get(key);
      if (existing) existing.count += 1;
      else map.set(key, { name: concept, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
