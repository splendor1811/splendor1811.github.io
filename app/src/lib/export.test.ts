import { expect, test } from "bun:test";
import { portableSettings } from "./export";

test("downloadable settings never include stored publishing or AI credentials", () => {
  expect(portableSettings([
    { key: "github", value: { token: "secret" } },
    { key: "ai", value: { apiKey: "secret" } },
    { key: "cloud-sync", value: { revision: 3, dirty: true } },
    { key: "reading-density", value: "comfortable" },
  ])).toEqual([{ key: "reading-density", value: "comfortable" }]);
});
