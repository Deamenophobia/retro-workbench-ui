import assert from "node:assert/strict";
import { test } from "node:test";
import { createAppearanceStore, appearanceKey } from "../../src/integrations/appearance";
import { createSettingsStore, settingsKey } from "../../src/integrations/settings";
import { createRecordsSource, parseRecords } from "../../src/integrations/demoRecords";
import { defaultSettings } from "../../src/contracts/settings";
import { resolveTheme } from "../../src/themes/themes";

function memoryStorage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
}

test("appearance defaults safely and remembers an explicit choice", () => {
  const storage = memoryStorage();
  const store = createAppearanceStore(storage);
  assert.equal(store.read(), "classic");
  assert.equal(store.save("studio"), true);
  assert.equal(createAppearanceStore(storage).read(), "studio");
  storage.setItem(appearanceKey, "corrupted");
  assert.equal(store.read(), "classic");
  assert.equal(resolveTheme("__proto__"), "classic");
});

test("unavailable storage is reported without breaking appearance or settings", () => {
  const blocked = {
    getItem(): never {
      throw new Error("Denied");
    },
    setItem(): never {
      throw new Error("Full");
    },
  };
  for (const storage of [undefined, blocked]) {
    assert.equal(createAppearanceStore(storage).read(), "classic");
    assert.equal(createAppearanceStore(storage).save("studio"), false);
    assert.deepEqual(createSettingsStore(storage).read().value, defaultSettings);
    assert.ok(createSettingsStore(storage).read().warning);
    assert.equal(createSettingsStore(storage).save(defaultSettings), false);
  }
});

test("settings round-trip and reject corrupt or invalid saved values", () => {
  const storage = memoryStorage();
  const store = createSettingsStore(storage);
  const settings = { name: "Design room", startPage: "records" as const, showHints: false };
  assert.equal(store.save(settings), true);
  assert.deepEqual(store.read().value, settings);
  for (const raw of [
    "not json",
    "null",
    '{"name":3}',
    JSON.stringify({ ...settings, startPage: "unknown" }),
  ]) {
    storage.setItem(settingsKey, raw);
    assert.deepEqual(store.read().value, defaultSettings);
    assert.ok(store.read().warning);
  }
  assert.equal(store.save({ ...settings, name: " " }), false);
  assert.equal(store.save({ ...settings, name: "x".repeat(61) }), false);
});

const record = {
  id: "1",
  name: "Guide",
  owner: "Alex",
  status: "Ready",
  category: "Document",
  updated: "2026-10-01",
};

test("records validate external data and filter names, owners and IDs", async () => {
  const source = createRecordsSource("/records", async () => Response.json([record]));
  const signal = new AbortController().signal;
  assert.equal((await source.list(" ALEX ", signal)).length, 1);
  assert.equal((await source.list("1", signal)).length, 1);
  assert.equal((await source.list("absent", signal)).length, 0);
  assert.throws(() => parseRecords({ rows: [] }), /Invalid/);
  assert.throws(() => parseRecords([record, record]), /Duplicate/);
  assert.throws(() => parseRecords([{ ...record, status: "unknown" }]), /Invalid/);
});

test("records reject HTTP errors and respect cancellation even if transport ignores it", async () => {
  await assert.rejects(
    createRecordsSource("/records", async () => new Response("", { status: 503 })).list(
      "",
      new AbortController().signal,
    ),
    /failed/,
  );
  const controller = new AbortController();
  const source = createRecordsSource("/records", async (_url, init) => {
    assert.equal(init?.signal, controller.signal);
    controller.abort();
    return Response.json([record]);
  });
  await assert.rejects(source.list("", controller.signal), { name: "AbortError" });
});
