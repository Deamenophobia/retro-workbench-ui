import assert from "node:assert/strict";
import { test } from "node:test";
import { getPagination, pageNumbers } from "../../src/shared/ui/paginationModel";

test("pagination handles empty collections, partial final pages, and shrinking totals", () => {
  assert.deepEqual(getPagination(0, 12, 5), {
    total: 0,
    pageSize: 5,
    pageCount: 1,
    page: 1,
    startIndex: 0,
    endIndex: 0,
  });
  assert.deepEqual(getPagination(13, 3, 5), {
    total: 13,
    pageSize: 5,
    pageCount: 3,
    page: 3,
    startIndex: 10,
    endIndex: 13,
  });
  assert.equal(getPagination(6, 3, 5).page, 2);
  assert.equal(getPagination(13, 3, 25).page, 1);
});

test("pagination normalizes invalid numeric input instead of emitting unusable controls", () => {
  assert.deepEqual(getPagination(-3, NaN, 0), getPagination(0, 1, 1));
  assert.deepEqual(getPagination(Infinity, -2, NaN), getPagination(0, 1, 1));
  assert.deepEqual(getPagination(9.8, 1.9, 3.9), getPagination(9, 1, 3));
});

test("page windows stay bounded, ordered and include the current and boundary pages", () => {
  for (const total of [1, 7, 8, 100, 1_000_000]) {
    for (const page of new Set([1, Math.ceil(total / 2), total])) {
      const items = pageNumbers(page, total);
      const numbers = items.filter((value) => typeof value === "number");
      assert.ok(items.length <= 7);
      assert.equal(numbers[0], 1);
      assert.equal(numbers.at(-1), total);
      assert.ok(numbers.includes(page));
      assert.equal(new Set(numbers).size, numbers.length);
      assert.deepEqual(
        numbers,
        [...numbers].sort((a, b) => a - b),
      );
    }
  }
  assert.deepEqual(pageNumbers(5, 20), [1, "gap-start", 4, 5, 6, "gap-end", 20]);
});
