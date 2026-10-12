import { expect, test } from "bun:test";
import { additionDate } from "./library-added-at";

test("a unique URL keeps the earliest Library commit when stable IDs were introduced later", () => {
  const history = {
    byId: new Map([["resource", "2026-10-10T00:00:00Z"]]),
    byUrl: new Map([["https://example.com/paper", "2026-07-09T00:00:00Z"]]),
  };
  expect(additionDate({ id: "resource", url: "https://example.com/paper" }, history, new Map([["https://example.com/paper", 1]])))
    .toBe("2026-07-09T00:00:00Z");
  expect(additionDate({ id: "resource", url: "https://example.com/paper" }, history, new Map([["https://example.com/paper", 2]])))
    .toBe("2026-10-10T00:00:00Z");
});
