import test from "node:test";
import assert from "node:assert/strict";
import { formatDate } from "./format";

test("formatDate: null/empty/invalid -> empty string (no 'Invalid Date')", () => {
  assert.equal(formatDate(null), "");
  assert.equal(formatDate(undefined), "");
  assert.equal(formatDate(""), "");
  assert.equal(formatDate("not-a-date"), "");
});

test("formatDate: real date renders", () => {
  assert.equal(formatDate("2026-01-15"), "15 January 2026");
  assert.equal(formatDate("2026-01-15", { month: "short", year: "numeric" }), "Jan 2026");
});
