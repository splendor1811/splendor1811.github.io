import { parseEntryHead, parseResourceIdComment } from "@/data/parser/parse";
import { DEFAULT_RESOURCE_GROUP } from "@/lib/mdWriteback";

interface EntryRange {
  start: number;
  end: number;
  id: string | null;
}

/** Resolve one exact entry, including its identity comment, without consuming its neighbour. */
function findEntry(lines: string[], url: string, resourceId?: string): EntryRange {
  const candidates: EntryRange[] = [];
  for (let entryStart = 0; entryStart < lines.length; entryStart++) {
    const head = parseEntryHead(lines[entryStart]);
    if (!head || head.url !== url) continue;
    let preceding = entryStart - 1;
    while (preceding >= 0 && !lines[preceding].trim()) preceding--;
    const id = preceding >= 0 ? parseResourceIdComment(lines[preceding]) : null;
    let end = entryStart + 1;
    while (end < lines.length && !lines[end].trim().startsWith("*Key concepts:*")) {
      if (parseEntryHead(lines[end]) || parseResourceIdComment(lines[end]) || /^#{1,3} /.test(lines[end].trim())) {
        throw new Error("This entry has no Key concepts line; repair its Markdown before editing.");
      }
      end++;
    }
    if (end >= lines.length) throw new Error("This entry has no Key concepts line; repair its Markdown before editing.");
    candidates.push({ start: id ? preceding : entryStart, end: end + 1, id });
  }

  if (resourceId) {
    const exact = candidates.filter((entry) => entry.id === resourceId);
    if (exact.length === 1) return exact[0];
    // Older files may not have explicit IDs yet. A unique URL is safe only when
    // it does not already belong to a different explicit identity.
    if (exact.length === 0 && candidates.length === 1 && !candidates[0].id) return candidates[0];
  } else if (candidates.length === 1) {
    return candidates[0];
  }
  if (candidates.length > 1) throw new Error("More than one entry has this URL. Select the resource by its stable ID.");
  throw new Error("Couldn't locate this resource in the Markdown — it may have changed.");
}

/** Insert once per stable identity, including after an ambiguous network failure. */
export function insertMarkdownEntry(content: string, group: string, entryMarkdown: string): string {
  const entryLines = entryMarkdown.trim().split("\n");
  const resourceId = parseResourceIdComment(entryLines[0] ?? "");
  const head = parseEntryHead(entryLines[resourceId ? 1 : 0] ?? "");
  if (!head) throw new Error("The new resource is not a valid Markdown entry.");

  const lines = content.split("\n");
  const destination = group.trim() || DEFAULT_RESOURCE_GROUP;
  if (resourceId && lines.some((line) => parseResourceIdComment(line) === resourceId)) {
    const existing = findEntry(lines, head.url, resourceId);
    let existingGroup = "";
    for (let index = existing.start - 1; index >= 0; index--) {
      const line = lines[index].trim();
      if (line.startsWith("### ")) {
        existingGroup = line.slice(4).trim();
        break;
      }
    }
    const existingMarkdown = lines.slice(existing.start, existing.end).join("\n").trim();
    if (existingGroup === destination && existingMarkdown === entryLines.join("\n")) return content;
    throw new Error("This resource ID was already published. Open the existing resource to make further changes.");
  }

  const groupIndex = lines.findIndex((line) => line.trim() === `### ${destination}`);
  if (groupIndex !== -1) {
    let end = groupIndex + 1;
    while (end < lines.length && !lines[end].trim().startsWith("### ")) end++;
    lines.splice(end, 0, entryLines.join("\n"));
  } else {
    lines.push("", `### ${destination}`, entryLines.join("\n"));
  }
  return lines.join("\n");
}

export function replaceMarkdownEntry(content: string, url: string, replacement: string, resourceId?: string): string {
  const lines = content.split("\n");
  const entry = findEntry(lines, url, resourceId);
  const replacementLines = replacement.trim().split("\n");
  const suppliedId = parseResourceIdComment(replacementLines[0]);
  const stableId = entry.id ?? resourceId ?? suppliedId;
  if (suppliedId && stableId && suppliedId !== stableId) throw new Error("An edit cannot change a resource's stable ID.");
  if (suppliedId) replacementLines.shift();
  if (!parseEntryHead(replacementLines[0] ?? "")) throw new Error("The replacement is not a valid resource entry.");
  if (stableId) replacementLines.unshift(`<!-- resource-id: ${stableId} -->`);
  lines.splice(entry.start, entry.end - entry.start, ...replacementLines);
  return lines.join("\n");
}

export function deleteMarkdownEntry(content: string, url: string, resourceId?: string): string {
  const lines = content.split("\n");
  const entry = findEntry(lines, url, resourceId);
  lines.splice(entry.start, entry.end - entry.start);
  return lines.join("\n");
}
