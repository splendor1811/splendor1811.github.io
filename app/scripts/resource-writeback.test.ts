import { expect, test } from "bun:test";
import { TOPIC_STYLES } from "../src/data/topics";
import { parseSubpage } from "../src/data/parser/parse";
import { formatEntry, type DraftResource } from "../src/lib/mdWriteback";
import { isLocalWritebackOrigin, writeResourceEntry } from "./resource-writeback";

const topic = TOPIC_STYLES[0];
const draft: DraftResource = {
  title: "A new resource", url: "https://example.com/article", type: "Blog", source: "Example",
  date: "2026-10", summary: "A short summary.", keyConcepts: [],
  markers: { star: false, startHere: false, unverified: false },
};
function memoryStorage() {
  let content = "# Research\n";
  let writes = 0;
  let rebuilds = 0;
  let rebuildOk = true;
  return {
    readTopic: async () => content,
    writeTopic: async (_title: string, markdown: string) => { content = markdown; writes++; },
    rebuild: () => { rebuilds++; return rebuildOk; },
    inspect: () => ({ content, writes, rebuilds }),
    failRebuild: () => { rebuildOk = false; },
    restoreRebuild: () => { rebuildOk = true; },
  };
}

test("local writeback accepts stable ID comments and retries without duplicate writes", async () => {
  const storage = memoryStorage();
  const input = { topicSlug: topic.slug, group: "", markdown: formatEntry(draft, "resource__local-test") };
  expect((await writeResourceEntry(input, storage)).status).toBe(200);
  expect((await writeResourceEntry(input, storage)).status).toBe(200);
  const { content, writes, rebuilds } = storage.inspect();
  expect(writes).toBe(1);
  expect(rebuilds).toBe(2);
  const resources = parseSubpage({ ...topic, markdown: content }).resources;
  expect(resources).toHaveLength(1);
  expect(resources[0].id).toBe("resource__local-test");
  expect(resources[0].group).toBe("Added via app");
  expect(resources[0].dateRaw).toBe("2026-10");
});

test("local writeback still accepts legacy snippets without ID comments", async () => {
  const storage = memoryStorage();
  expect((await writeResourceEntry({ topicSlug: topic.slug, markdown: formatEntry(draft) }, storage)).status).toBe(200);
  expect(storage.inspect().content).toContain(formatEntry(draft));
  expect(storage.inspect().writes).toBe(1);
});

test("malformed requests and conflicting IDs leave stored Markdown untouched", async () => {
  const storage = memoryStorage();
  for (const input of [null, [], { topicSlug: "../../private", markdown: formatEntry(draft) },
    { topicSlug: topic.slug, markdown: 123 }, { topicSlug: topic.slug, markdown: "<!-- resource-id: orphan -->" },
    { topicSlug: topic.slug, markdown: "- **[Bad](https://example.com)** no metadata" },
    { topicSlug: topic.slug, markdown: [formatEntry(draft), formatEntry(draft)].join("\n\n") }]) {
    expect((await writeResourceEntry(input, storage)).status).toBe(400);
  }
  expect(storage.inspect().writes).toBe(0);
  const input = { topicSlug: topic.slug, markdown: formatEntry(draft, "resource__same") };
  await writeResourceEntry(input, storage);
  const before = storage.inspect().content;
  const conflicting = { ...input, markdown: formatEntry({ ...draft, summary: "Changed after publishing." }, "resource__same") };
  expect((await writeResourceEntry(conflicting, storage)).status).toBe(400);
  expect(storage.inspect().content).toBe(before);
  expect(storage.inspect().writes).toBe(1);
});

test("a failed regeneration is safe to retry without appending the resource again", async () => {
  const storage = memoryStorage();
  storage.failRebuild();
  const input = { topicSlug: topic.slug, markdown: formatEntry(draft, "resource__rebuild") };
  expect((await writeResourceEntry(input, storage)).status).toBe(500);
  storage.restoreRebuild();
  expect((await writeResourceEntry(input, storage)).status).toBe(200);
  expect(storage.inspect().writes).toBe(1);
  expect(storage.inspect().rebuilds).toBe(2);
});

test("local browser origins and CLI requests are accepted, remote and opaque origins are rejected", async () => {
  for (const origin of [undefined, "http://localhost:5273", "http://127.0.0.1:5173", "https://localhost:5273"]) {
    expect(isLocalWritebackOrigin(origin)).toBe(true);
  }
  const storage = memoryStorage();
  const input = { topicSlug: topic.slug, markdown: formatEntry(draft, "resource__origin-test") };
  for (const origin of ["null", "", "https://example.com", "http://192.168.1.1:5273", "http://localhost.example.com", "http://localhost@evil.example", "file://localhost", "http://localhost/path", "http://localhost?target=evil"]) {
    expect(isLocalWritebackOrigin(origin)).toBe(false);
    expect((await writeResourceEntry(input, storage, origin)).status).toBe(403);
  }
  expect(storage.inspect().writes).toBe(0);
  expect(storage.inspect().rebuilds).toBe(0);
  expect((await writeResourceEntry(input, storage, "http://127.0.0.1:5273")).status).toBe(200);
});
