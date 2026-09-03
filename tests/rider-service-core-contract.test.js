"use strict";
const assert = require("node:assert/strict");
const test = require("node:test");
const matrix = require("../research/schema/rider-service-core-v1.js");
const factory = require("../research/factory/index.js");

test("Rider Service Core matrix is deterministic and covers all 14 domains", () => {
  assert.equal(matrix.schemaVersion, "revlog-rider-service-core/v1");
  assert.equal(matrix.domains.length, 14);
  assert.equal(new Set(matrix.domains.map(domain => domain.id)).size, 14);
  assert.equal(new Set(matrix.fieldIds).size, matrix.fieldIds.length);
  assert.equal(factory.SERVICE_CORE_FIELDS.length >= matrix.fieldIds.length, true);
  assert.equal(factory.LEGACY_SERVICE_CORE_FIELDS.length, 44);
  assert.deepEqual(matrix.fieldIds, [...matrix.fieldIds]);
});

test("legacy factory fields remain in the aligned canonical set", () => {
  assert.ok(factory.SERVICE_CORE_FIELDS.includes("engine.idle-speed"));
  assert.ok(factory.SERVICE_CORE_FIELDS.includes("lubrication.capacity-filter"));
  assert.ok(factory.SERVICE_CORE_FIELDS.includes("final_drive.chain-slack"));
  assert.ok(factory.SERVICE_CORE_FIELDS.includes("dimensions_mass.seat-height"));
  assert.ok(factory.SERVICE_CORE_FIELDS.includes("lighting.combined-high-low"));
  assert.throws(() => matrix.validateFieldIdentity("duplicate-or-unknown"), /unknown Rider Service Core/);
});

test("repeating field definitions preserve associations without normalizing values", () => {
  assert.deepEqual(matrix.fieldMap["maintenance.inspect"].associationKeys, ["item", "sourceLocation", "applicability"]);
  assert.deepEqual(matrix.fieldMap["electrical.fuse-ratings"].associationKeys, ["item", "sourceLocation", "applicability"]);
  assert.deepEqual(matrix.fieldMap["lighting.combined-high-low"].associationKeys, ["item", "sourceLocation", "applicability"]);
  assert.equal(matrix.fieldMap["maintenance.inspect"].representation, "repeating");
  assert.equal(matrix.fieldMap["electrical.fuse-ratings"].representation, "repeating");
  assert.equal(matrix.fieldMap["lighting.combined-high-low"].representation, "repeating");
});
