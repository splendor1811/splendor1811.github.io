import { TOPIC_STYLES } from "../src/data/topics";
import { parseSubpage } from "../src/data/parser/parse";
import { insertMarkdownEntry } from "../src/lib/markdownEntries";

interface WritebackStorage {
  readTopic: (title: string) => Promise<string>;
  writeTopic: (title: string, markdown: string) => Promise<void>;
  rebuild: () => boolean | Promise<boolean>;
}

type WritebackResult = { status: 200; file: string } | { status: 400 | 403 | 500; message: string };

/** Browsers may write only from local development origins; CLI clients omit Origin. */
export function isLocalWritebackOrigin(origin: string | undefined): boolean {
  if (origin === undefined) return true;
  try {
    const url = new URL(origin);
    return ["http:", "https:"].includes(url.protocol)
      && ["localhost", "127.0.0.1"].includes(url.hostname)
      && !url.username && !url.password && url.pathname === "/" && !url.search && !url.hash;
  } catch {
    return false;
  }
}

/** Storage is injected so validation and retry behavior can be tested without disk writes. */
export async function writeResourceEntry(input: unknown, storage: WritebackStorage, origin?: string): Promise<WritebackResult> {
  if (!isLocalWritebackOrigin(origin)) return { status: 403, message: "Cross-origin writeback is not allowed" };
  if (!input || typeof input !== "object" || Array.isArray(input)) return { status: 400, message: "Malformed request" };
  const { topicSlug, group = "", markdown } = input as Record<string, unknown>;
  const style = TOPIC_STYLES.find((topic) => topic.slug === topicSlug);
  if (!style) return { status: 400, message: "Unknown topic" };
  if (typeof markdown !== "string" || typeof group !== "string") return { status: 400, message: "Malformed entry" };

  let updated: string;
  let original: string;
  try {
    // Accept one well-formed legacy entry or one with its permanent ID comment.
    const parsed = parseSubpage({ ...style, markdown });
    if (parsed.resources.length !== 1) return { status: 400, message: "Expected exactly one valid resource entry" };
    original = await storage.readTopic(style.title);
    updated = insertMarkdownEntry(original, group, markdown);
  } catch (error) {
    return { status: 400, message: error instanceof Error ? error.message : "Malformed entry" };
  }

  if (updated !== original) await storage.writeTopic(style.title, updated);
  // Retry regeneration even when a previous attempt already wrote the same ID.
  if (!await storage.rebuild()) return { status: 500, message: "Saved entry but failed to regenerate content" };
  return { status: 200, file: `${style.title}.md` };
}
