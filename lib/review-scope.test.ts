import { test } from "node:test";
import assert from "node:assert/strict";
import { pickReviewJournal } from "./review-scope";

// The isolation invariant: whatever an editor resolves to must be one of their
// assigned journals — never a journal they asked for but aren't assigned to.
test("editor cannot resolve to an unassigned journal", () => {
  const allowed = ["j-1", "j-2"];
  // forged ?journal= for a journal they don't have → clamps to their own set
  assert.equal(pickReviewJournal("editor", allowed, "j-9"), "j-1");
  assert.ok(allowed.includes(pickReviewJournal("editor", allowed, "j-9")!));
});

test("editor request for an assigned journal is honoured", () => {
  assert.equal(pickReviewJournal("editor", ["j-1", "j-2"], "j-2"), "j-2");
});

test("editor with no assignments resolves to nothing (not 'all')", () => {
  assert.equal(pickReviewJournal("editor", [], "j-1"), null);
  assert.equal(pickReviewJournal("editor", [], null), null);
});

test("admin may view all (null) or any single journal", () => {
  // admin's allowed set is every journal id; an out-of-list request → all
  assert.equal(pickReviewJournal("admin", ["j-1", "j-2", "j-3"], null), null);
  assert.equal(pickReviewJournal("admin", ["j-1", "j-2", "j-3"], "j-2"), "j-2");
});

test("writer/reader never resolve to an unscoped view", () => {
  // role below editor: same clamp, and with no assignments → null → empty list
  assert.equal(pickReviewJournal("writer", [], "j-1"), null);
  assert.equal(pickReviewJournal("reader", [], null), null);
});
