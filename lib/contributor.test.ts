import test from "node:test";
import assert from "node:assert/strict";
import { roleFromFlags, kindsFromFlags } from "./contributor";

test("roleFromFlags: admin > editor > writer > reader", () => {
  assert.equal(roleFromFlags({ writer: true, editor: true, admin: true }), "admin");
  assert.equal(roleFromFlags({ writer: true, editor: true, admin: false }), "editor");
  assert.equal(roleFromFlags({ writer: true, editor: false, admin: false }), "writer");
  assert.equal(roleFromFlags({ writer: false, editor: false, admin: false }), "reader");
});

test("kindsFromFlags: writer -> author", () => {
  assert.deepEqual(kindsFromFlags({ writer: true, editor: false }), ["author"]);
  assert.deepEqual(kindsFromFlags({ writer: true, editor: true }), ["author", "editor"]);
  assert.deepEqual(kindsFromFlags({ writer: false, editor: false }), []);
});
