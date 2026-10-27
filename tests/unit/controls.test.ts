import assert from "node:assert/strict";
import { test } from "node:test";
import { filterOptions, moveOption } from "../../src/shared/ui/selection/optionModel";
import { selectFiles } from "../../src/shared/ui/files/fileSelection";
import { sortRecords, reconcileSelection } from "../../src/features/records/recordView";
import type { WorkRecord } from "../../src/contracts/records";

test("option navigation skips disabled choices, wraps, and handles empty searches", () => {
  const options = [
    { value: "a", label: "Alpha", disabled: true },
    { value: "b", label: "Beta", description: "Design" },
    { value: "c", label: "Gamma" },
  ];
  assert.equal(moveOption(options, null, "next"), "b");
  assert.equal(moveOption(options, "c", "next"), "b");
  assert.equal(moveOption(options, "b", "previous"), "c");
  assert.equal(moveOption(options, null, "last"), "c");
  assert.equal(
    moveOption(
      options.filter((option) => option.disabled),
      null,
      "next",
    ),
    null,
  );
  assert.deepEqual(
    filterOptions(options, " DESIGN ").map((option) => option.value),
    ["b"],
  );
  assert.equal(moveOption(filterOptions(options, "absent"), "b", "next"), null);
});

test("file selection rejects duplicate, disallowed, oversized and excess files without losing valid ones", () => {
  const constraints = { accept: [".txt", "image/*"], maxBytes: 10, maxFiles: 2 };
  const first = new File(["hello"], "notes.txt", { type: "text/plain", lastModified: 1 });
  const invalid = new File(["x"], "script.exe", { type: "application/octet-stream" });
  const big = new File(["01234567890"], "big.txt");
  const image = new File(["x"], "icon.png", { type: "image/png" });
  const extra = new File(["x"], "extra.txt");
  const result = selectFiles([first], [first, invalid, big, image, extra], constraints);
  assert.deepEqual(result.files, [first, image]);
  assert.deepEqual(
    result.rejected.map((item) => item.reason),
    [
      "Already selected.",
      "File type is not accepted.",
      "File exceeds the size limit.",
      "File count limit reached.",
    ],
  );
  assert.deepEqual(selectFiles([], [first], constraints).files, [first]);
});

test("record sorting is stable and does not mutate data; refreshed selections drop missing IDs", () => {
  const base = {
    owner: "Sam",
    category: "Document",
    status: "Ready",
    updated: "2026-10-27",
  } as const;
  const rows: readonly WorkRecord[] = [
    { ...base, id: "2", name: "Item 10" },
    { ...base, id: "1", name: "Item 2" },
  ];
  assert.deepEqual(
    sortRecords(rows, { columnId: "name", direction: "ascending" }).map((row) => row.id),
    ["1", "2"],
  );
  assert.equal(rows[0]?.id, "2");
  assert.deepEqual([...reconcileSelection(new Set(["1", "gone"]), rows)], ["1"]);
});
