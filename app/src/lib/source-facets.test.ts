import { expect, test } from "bun:test";
import { matchesSource, sourceFacet } from "./source-facets";

test("publisher filtering includes author-qualified attribution without rewriting it", () => {
  const article = {url:"https://thinkingmachines.ai/blog/on-policy-distillation/",source:"Kevin Lu / Thinking Machines Lab"};
  expect(sourceFacet(article)).toBe("Thinking Machines");
  expect(matchesSource(article, "Thinking Machines")).toBe(true);
  expect(matchesSource(article, "Kevin Lu / Thinking Machines Lab")).toBe(true);
  expect(article.source).toBe("Kevin Lu / Thinking Machines Lab");
  expect(matchesSource({...article,url:"https://unrelated.example/blog"}, "Thinking Machines")).toBe(false);
});

test("Lilian and unrecognized publishers retain predictable source facets", () => {
  expect(sourceFacet({url:"https://lilianweng.github.io/posts/example/",source:"Lilian Weng / Lil’Log"})).toBe("Lilian Weng");
  expect(sourceFacet({url:"not a URL",source:"Original source"})).toBe("Original source");
});
