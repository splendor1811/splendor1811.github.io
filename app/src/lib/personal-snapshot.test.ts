import { expect, test } from "bun:test";
import Dexie from "dexie";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

Dexie.dependencies.indexedDB = indexedDB;
Dexie.dependencies.IDBKeyRange = IDBKeyRange;
const database = await import("./db");
const { eraseUserCache, switchPersonalDatabase } = database;
const { readPersonalSnapshot, replacePersonalSnapshot } = await import("./personal-snapshot");
const { portableSettings, resetAll } = await import("./export");

test("account caches stay separate, and a reset retains the pending cloud deletion", async () => {
  const accountA = "test-account-a";
  const accountB = "test-account-b";
  // Other test modules may have imported db before this file installed IndexedDB.
  switchPersonalDatabase("test-initialization");
  switchPersonalDatabase(null);
  try {
    await database.db.progress.put({ resourceId: "guest-only", status: "completed", updatedAt: 1 });
    switchPersonalDatabase(accountA);
    expect(await database.db.progress.get("guest-only")).toBeUndefined();
    await database.db.progress.put({ resourceId: "private-a", status: "reading", updatedAt: 2 });
    await database.db.settings.put({ key: "cloud-sync", value: { revision: 4, dirty: false } });
    switchPersonalDatabase(accountB);
    expect(await database.db.progress.get("private-a")).toBeUndefined();
    await database.db.progress.put({ resourceId: "private-b", status: "completed", updatedAt: 3 });
    switchPersonalDatabase(accountA);
    expect((await readPersonalSnapshot()).progress.map(row => row.resourceId)).toEqual(["private-a"]);
    await resetAll();
    expect((await readPersonalSnapshot()).progress).toEqual([]);
    expect((await database.db.settings.get("cloud-sync"))?.value).toEqual({ revision: 4, dirty: true });
    expect(portableSettings(await database.db.settings.toArray())).toEqual([]);
    await replacePersonalSnapshot({
      progress: [{ resourceId: "from-cloud", status: "completed", updatedAt: 5 }],
      notes: [], highlights: [], favorites: [], reviews: [], activity: [],
    });
    expect((await readPersonalSnapshot()).progress[0]?.resourceId).toBe("from-cloud");
    switchPersonalDatabase(null);
    expect(await database.db.progress.get("guest-only")).toBeDefined();
    expect(await database.db.progress.get("from-cloud")).toBeUndefined();
    switchPersonalDatabase(accountB);
    expect(await database.db.progress.get("private-b")).toBeDefined();
  } finally {
    switchPersonalDatabase(null);
    await database.db.progress.delete("guest-only");
    await eraseUserCache(accountA);
    await eraseUserCache(accountB);
  }
});
