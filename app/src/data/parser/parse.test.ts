import { expect, test, describe } from "bun:test";
import {
  parseEntryHead,
  parseEntryMeta,
  normalizeDate,
  parseSubpage,
  parsePriorityQueue,
} from "./parse";

describe("parseEntryHead", () => {
  test("normal entry", () => {
    const head = parseEntryHead(
      "- **[RLHF Book (Nathan Lambert)](https://rlhfbook.com/book.pdf)** · `Book` · rlhfbook.com · *2026-07-07*",
    );
    expect(head?.title).toBe("RLHF Book (Nathan Lambert)");
    expect(head?.url).toBe("https://rlhfbook.com/book.pdf");
  });

  test("title containing a middle dot is not mistaken for a delimiter", () => {
    const head = parseEntryHead(
      "- **[What are RLVR environments for LLMs? (Policy · Rollouts · Rubrics)](https://www.youtube.com/watch?v=52UlnK-SW7I)** · `Video` · Yacine Mahdid (YouTube) · *2025-10-15* · ⚠️unverified",
    );
    expect(head?.title).toBe("What are RLVR environments for LLMs? (Policy · Rollouts · Rubrics)");
    expect(head?.url).toBe("https://www.youtube.com/watch?v=52UlnK-SW7I");
  });

  test("url with query params & ampersands", () => {
    const head = parseEntryHead(
      "- **[RLHF & Post-Training Course (Nathan Lambert)](https://www.youtube.com/watch?v=jQPiH-KB4B0&list=PLL1tdVxB1CpVpEtMHxwuR4uI4Lxjw00_y)** · `Video` · YouTube · *—* · ⚠️unverified",
    );
    expect(head?.url).toBe(
      "https://www.youtube.com/watch?v=jQPiH-KB4B0&list=PLL1tdVxB1CpVpEtMHxwuR4uI4Lxjw00_y",
    );
  });

  test("non-entry line returns null", () => {
    expect(parseEntryHead("### Some heading")).toBeNull();
    expect(parseEntryHead("  *Key concepts:* a, b, c")).toBeNull();
  });
});

describe("parseEntryMeta", () => {
  test("multiple markers (star + unverified)", () => {
    const head = parseEntryHead(
      "- **[EfficientML.ai Lecture 20 — Distributed Training Part 2 (MIT 6.5940)](https://www.youtube.com/watch?v=jb91nEH2g_0)** · `Video` · YouTube (MIT HAN Lab) · *2024* · ⭐ · ⚠️unverified",
    )!;
    const meta = parseEntryMeta(head)!;
    expect(meta.type).toBe("Video");
    expect(meta.source).toBe("YouTube (MIT HAN Lab)");
    expect(meta.dateRaw).toBe("2024");
    expect(meta.markers).toEqual({ star: true, startHere: false, unverified: true });
  });

  test("start-here marker", () => {
    const head = parseEntryHead(
      "- **[Hands-On Modern RL](https://github.com/walkinglabs/hands-on-modern-rl)** · `Repo` · GitHub (walkinglabs) · *2026-06-18* · 🔁",
    )!;
    const meta = parseEntryMeta(head)!;
    expect(meta.markers.startHere).toBe(true);
    expect(meta.markers.star).toBe(false);
  });
});

describe("normalizeDate", () => {
  test("iso, partial, year, unknown", () => {
    expect(normalizeDate("*2026-07-07*")).toBe("2026-07-07");
    expect(normalizeDate("2026-01")).toBe("2026-01-01");
    expect(normalizeDate("2024")).toBe("2024-01-01");
    expect(normalizeDate("—")).toBeNull();
    expect(normalizeDate("*—*")).toBeNull();
    expect(normalizeDate("2025-26 (Sem I)")).toBe("2025-01-01"); // invalid month -> coarse to year
  });
});

describe("parseSubpage", () => {
  const md = `# Reinforcement Learning

[[Library|← Back to Library index]] · Related: [[Async & Infrastructure RL]] · [[On-Policy Distillation]]

Reinforcement Learning has become the engine behind modern reasoning LLMs.

**Suggested reading order:** hands-on-modern-rl 🔁 → RLHF book.

### Courses & books (start here)
- **[Hands-On Modern RL](https://github.com/walkinglabs/hands-on-modern-rl)** · \`Repo\` · GitHub (walkinglabs) · *2026-06-18* · 🔁
  A practice-first, open-source curriculum from classical control to modern LLM post-training.
  *Key concepts:* deep RL fundamentals, RLHF/DPO/GRPO/RLVR, preference optimization

### Policy optimization & tricks
- **[GRPO++: Tricks for Making RL Actually Work](https://cameronrwolfe.substack.com/p/grpo-tricks)** · \`Blog\` · Cameron R. Wolfe (Substack) · *2026-01-05*
  A deep dive into Group Relative Policy Optimization and the tricks that make it stable.
  *Key concepts:* group-relative advantages, decoupled clipping, entropy collapse
`;
  const { topic, resources } = parseSubpage({
    slug: "reinforcement-learning",
    title: "Reinforcement Learning",
    color: "#4ADE9E",
    icon: "Target",
    short: "RL",
    markdown: md,
  });

  test("topic metadata", () => {
    expect(topic.intro).toContain("engine behind modern reasoning");
    expect(topic.readingOrder).toContain("hands-on-modern-rl");
    expect(topic.relatedSlugs).toEqual(["async-infrastructure-rl", "on-policy-distillation"]);
    expect(topic.groups).toEqual(["Courses & books (start here)", "Policy optimization & tricks"]);
    expect(topic.resourceCount).toBe(2);
  });

  test("resources parsed with group, markers, concepts", () => {
    expect(resources).toHaveLength(2);
    expect(resources[0].title).toBe("Hands-On Modern RL");
    expect(resources[0].group).toBe("Courses & books (start here)");
    expect(resources[0].markers.startHere).toBe(true);
    expect(resources[0].keyConcepts).toContain("preference optimization");
    expect(resources[1].type).toBe("Blog");
    expect(resources[1].dateSort).toBe("2026-01-05");
  });
});

describe("parsePriorityQueue", () => {
  const md = `# Library

## ⭐ Priority queue (read/watch first)

- **[On-Policy Distillation](https://thinkingmachines.ai/blog/on-policy-distillation/)** — canonical OPD writeup → [[On-Policy Distillation]]
- **[Hands-On Modern RL](https://github.com/walkinglabs/hands-on-modern-rl)** 🔁 — recommended starting course → [[Reinforcement Learning]]

## Sections
- **[not a priority item](https://example.com)** · other
`;
  test("extracts queue items with topic + marker, ignores later sections", () => {
    const items = parsePriorityQueue(md);
    expect(items).toHaveLength(2);
    expect(items[0].topicSlug).toBe("on-policy-distillation");
    expect(items[0].blurb).toBe("canonical OPD writeup");
    expect(items[1].marker).toBe("startHere");
    expect(items[1].topicSlug).toBe("reinforcement-learning");
  });
});
