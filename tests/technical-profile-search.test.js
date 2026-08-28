"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const fixture = require("./fixtures/technical-profile-v1.fixture.js");
const formatter = require("../js/technical/technical-value-formatter.js");
const resolver = require("../js/technical/technical-profile-resolver.js");
const searchApi = require("../js/technical/technical-profile-search.js");

const BASE_CONTEXT = Object.freeze({
  catalogVariantKey: "fixture.synthetic-1000.gen1",
  year: 2099,
  region: "EU",
  abs: false,
  equipment: []
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function build(context = BASE_CONTEXT, profile = fixture) {
  return searchApi.buildSearchIndex(profile, context);
}

function first(index, query, options) {
  return searchApi.search(index, query, options)[0];
}

test("text matching covers exact label, alias, partial label, tags, and category", () => {
  const index = build();
  assert.equal(first(index, "Akumulator").entryId, "electrical.battery.nominal-voltage");
  assert.equal(first(index, "śruba spustowa oleju").entryId, "torque.engine.oil-drain-bolt");
  assert.equal(first(index, "Korek spustowy").entryId, "torque.engine.oil-drain-bolt");
  assert.equal(first(index, "tylne koło").entryId, "wheels.rear-tire.specification");
  assert.equal(first(index, "Momenty dokręcania").entryType, "torque");
});

test("normalization handles Polish diacritics, case, and repeated whitespace", () => {
  const index = build();
  assert.equal(first(index, "ŚWIECA").entryId, "ignition.spark-plug.primary");
  assert.equal(first(index, "swieca").entryId, "ignition.spark-plug.primary");
  assert.equal(first(index, "zarowka").entryId, "lighting.headlight.low-beam");
  assert.equal(first(index, "  korek    spustowy   oleju ").entryId, "torque.engine.oil-drain-bolt");
});

test("central synonyms expand aku, tire slang, and świeczka", () => {
  const index = build();
  assert.equal(first(index, "aku").entryId, "electrical.battery.nominal-voltage");
  assert.equal(first(index, "kapeć").entryId, "wheels.rear-tire.specification");
  assert.equal(first(index, "laczek").entryId, "wheels.rear-tire.specification");
  assert.equal(first(index, "świeczka").entryId, "ignition.spark-plug.primary");
});

test("numeric unit queries accept canonical and common input forms", () => {
  const index = build();
  assert.equal(first(index, "29 Nm").entryId, "torque.engine.oil-drain-bolt");
  assert.equal(first(index, "29 N·m").entryId, "torque.engine.oil-drain-bolt");
  assert.equal(first(index, "12V").entryId, "electrical.battery.nominal-voltage");
  assert.equal(first(index, "250 kPa").entryId, "fuel.pressure.nominal");
  assert.equal(first(index, "2,5 bar").entryId, "fuel.pressure.nominal");
  assert.doesNotThrow(() => searchApi.search(index, "2,,5 nonsense"));
});

test("part numbers support OEM, replacements, and outrank descriptive text", () => {
  const profile = clone(fixture);
  profile.entries.push({
    id: "specification.generic-reference",
    type: "specification",
    categoryId: "consumables",
    label: "Testowa wzmianka katalogowa",
    status: "verified",
    sourceIds: ["cite.fixture.synthetic-manual.general"],
    description: "Tekst zawiera numer 15410-FIX-003 wyłącznie jako wzmiankę.",
    value: { type: "text", text: "Informacja testowa" }
  });
  const index = build(BASE_CONTEXT, profile);
  const oem = searchApi.search(index, "15410-FIX-003");
  assert.equal(oem[0].entryId, "consumables.oil-filter");
  assert.ok(oem[0].matchedFields.includes("partNumbers"));
  assert.ok(oem[0].score > oem[1].score);
  assert.equal(first(index, "HF-FIX-204").entryId, "consumables.oil-filter");
  assert.equal(first(index, "Fixture Filters HF-FIX-204").entryId, "consumables.oil-filter");
});

test("ranking prioritizes label, alias, and exact part number with explicit reasons", () => {
  const index = build();
  const exact = first(index, "Akumulator");
  const alias = first(index, "śruba spustowa oleju");
  const part = first(index, "15410-FIX-003");
  assert.equal(exact.score, searchApi.SCORE.exactLabel);
  assert.equal(alias.score, searchApi.SCORE.exactAlias);
  assert.equal(part.score, searchApi.SCORE.exactPartNumber);
  assert.ok(exact.matchedFields.includes("label"));
  assert.ok(alias.matchedFields.includes("aliases"));
  assert.ok(part.reasons.some(reason => reason.startsWith("exact part number:")));
});

test("equal scores have deterministic label then entry ID ordering", () => {
  const profile = clone(fixture);
  for (const [id, label] of [["specification.tie-z", "Zulu"], ["specification.tie-a", "Alfa"]]) {
    profile.entries.push({
      id,
      type: "specification",
      categoryId: "electrical",
      label,
      tags: ["wspólny-test"],
      status: "verified",
      sourceIds: ["cite.fixture.synthetic-manual.general"],
      value: { type: "text", text: "Fixture" }
    });
  }
  const results = searchApi.search(build(BASE_CONTEXT, profile), "wspólny-test");
  assert.deepEqual(results.slice(0, 2).map(result => result.label), ["Alfa", "Zulu"]);
});

test("category and entry type filters are applied before ranking", () => {
  const index = build();
  const byCategory = searchApi.search(index, "olej", { categoryId: "lubrication" });
  assert.ok(byCategory.length > 0);
  assert.ok(byCategory.every(result => result.categoryId === "lubrication"));
  const byType = searchApi.search(index, "olej", { entryTypes: ["torque"] });
  assert.ok(byType.length > 0);
  assert.ok(byType.every(result => result.entryType === "torque"));
});

test("empty and one-character non-identifying queries return no database dump", () => {
  const index = build();
  assert.deepEqual(searchApi.search(index, ""), []);
  assert.deepEqual(searchApi.search(index, "a"), []);
});

test("resolver integration indexes EU and USA resolved values", () => {
  const eu = first(build(BASE_CONTEXT), "H7");
  const usa = first(build({ ...BASE_CONTEXT, region: "USA" }), "H7");
  assert.equal(eu.formattedValue, "H7");
  assert.ok(eu.structuredValues.some(value => value.amount === 55 && value.unit === "W"));
  assert.equal(eu.selectedVariantId, "lighting.headlight.low-beam.eu");
  assert.equal(usa.formattedValue, "H7");
  assert.ok(usa.structuredValues.some(value => value.amount === 65 && value.unit === "W"));
  assert.equal(usa.selectedVariantId, "lighting.headlight.low-beam.usa-2099");
});

test("missing region preserves ambiguity without exposing a resolved value", () => {
  const index = build({ ...BASE_CONTEXT, region: null });
  const result = first(index, "H7");
  assert.equal(result.resolutionStatus, "ambiguous-context");
  assert.equal(result.rawValue, null);
  assert.equal(result.formattedValue, null);
  assert.ok(result.requiredContext.includes("region"));
});

test("ABS context produces the correct resolved entry", () => {
  const nonAbs = first(build(BASE_CONTEXT), "bezpiecznik główny");
  const abs = first(build({ ...BASE_CONTEXT, abs: true }), "bezpiecznik główny");
  assert.equal(nonAbs.formattedValue, "30 A");
  assert.equal(abs.formattedValue, "40 A");
  assert.equal(abs.selectedVariantId, "fuses.main.abs");
});

test("builder and search do not mutate their inputs", () => {
  const profile = clone(fixture);
  const beforeProfile = JSON.stringify(profile);
  const index = build(BASE_CONTEXT, profile);
  const beforeIndex = JSON.stringify(index);
  searchApi.search(index, "29 Nm");
  assert.equal(JSON.stringify(profile), beforeProfile);
  assert.equal(JSON.stringify(index), beforeIndex);
});

test("formatter, resolver, and search pipeline does not mutate source data", () => {
  const profile = clone(fixture);
  const before = JSON.stringify(profile);
  const resolved = resolver.resolveEntry(profile.entries[0], BASE_CONTEXT);
  formatter.formatValue(resolved.entry.value, { locale: "pl-PL" });
  const index = searchApi.buildSearchIndex(profile, BASE_CONTEXT);
  searchApi.search(index, "olej");
  assert.equal(JSON.stringify(profile), before);
});

test("constructed large index is built once and supports repeated searches", { timeout: 10000 }, () => {
  const profile = clone(fixture);
  const template = profile.entries.find(entry => entry.id === "electrical.battery.nominal-voltage");
  for (let number = 0; number < 1000; number += 1) {
    profile.entries.push({
      ...clone(template),
      id: `electrical.fixture-${number}`,
      label: `Element testowy ${number}`,
      aliases: [`element-${number}`]
    });
  }
  const started = Date.now();
  const index = build(BASE_CONTEXT, profile);
  for (let run = 0; run < 50; run += 1) {
    assert.equal(first(index, "element-777").entryId, "electrical.fixture-777");
  }
  assert.equal(index.items.length, profile.entries.length);
  assert.ok(Date.now() - started < 5000, "construction and repeated lookup exceeded 5 seconds");
});
