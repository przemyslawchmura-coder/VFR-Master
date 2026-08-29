"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const profile = require("../data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js");
const validator = require("../js/technical/technical-profile-validator.js");
const resolver = require("../js/technical/technical-profile-resolver.js");
const searchApi = require("../js/technical/technical-profile-search.js");
const qualityApi = require("../js/technical/technical-profile-quality-report.js");

const CATALOG_KEY = "honda.vfr800.rc46.vtec.gen1";
const BASE_CONTEXT = Object.freeze({
  catalogVariantKey: CATALOG_KEY,
  year: 2002,
  region: "EU",
  abs: false,
  equipment: []
});

function loadCatalog() {
  const context = vm.createContext({ window: {} });
  for (const file of ["data/motorcycle-catalog.js", "js/motorcycle-catalog.js"]) {
    const source = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
    vm.runInContext(source, context, { filename: file });
  }
  return context.window.MotorcycleCatalog;
}

function findEntry(id) {
  return profile.entries.find(entry => entry.id === id);
}

test("VFR800 2002 reference profile passes Technical Profile v1 validation", () => {
  assert.deepEqual(validator.validate(profile), { valid: true, errors: [], warnings: [] });
});

test("profile applicability is aligned with the existing motorcycle catalogue", () => {
  const catalog = loadCatalog();
  const variant = catalog.getVariantByKey(CATALOG_KEY);
  assert.ok(variant);
  assert.equal(variant.brand.name, "Honda");
  assert.equal(variant.variant.storedModel, "VFR800 VTEC");
  assert.ok(2002 >= variant.variant.yearFrom && 2002 <= variant.variant.yearTo);
  assert.deepEqual(profile.motorcycle.applicability.catalogVariantKeys, [CATALOG_KEY]);
  assert.deepEqual(profile.motorcycle.applicability.years, { from: 2002, to: 2002 });
});

test("all source, relation, and category references resolve without duplicates", () => {
  const report = qualityApi.buildQualityReport(profile, validator.validate(profile));
  assert.deepEqual(report.unresolvedReferences, {
    sourceIds: [],
    relatedEntryIds: [],
    categoryIds: []
  });
  assert.equal(new Set(profile.entries.map(entry => entry.id)).size, profile.entries.length);
  assert.equal(new Set(profile.categories.map(category => category.id)).size, profile.categories.length);
});

test("verified values always carry at least one existing citation", () => {
  const citationIds = new Set(Object.keys(profile.citations));
  for (const entry of profile.entries.filter(entry => entry.status === "verified")) {
    assert.ok(entry.sourceIds.length > 0, `${entry.id} has no citation`);
    assert.ok(entry.sourceIds.every(id => citationIds.has(id)), `${entry.id} has a broken citation`);
  }
});

test("quality report exposes factual coverage without a confidence score", () => {
  const report = qualityApi.buildQualityReport(profile, validator.validate(profile));
  assert.equal(report.totalEntries, 88);
  assert.equal(report.verified, 82);
  assert.equal(report.pendingVerification, 6);
  assert.equal(report.conflictingSources, 0);
  assert.equal(report.legacyUnverified, 0);
  assert.equal(report.citationsCount, 28);
  assert.equal(report.documentsCount, 6);
  assert.equal(report.variantsCount, 3);
  assert.equal(report.regionalVariantsCount, 3);
  assert.equal(Object.hasOwn(report, "confidenceScore"), false);
});

test("resolver handles profile year/key and USA standard-fuse ABS tri-state", () => {
  assert.equal(resolver.resolveProfileApplicability(profile, BASE_CONTEXT).status, "profile-applicable");
  assert.equal(resolver.resolveProfileApplicability(profile, { ...BASE_CONTEXT, year: 2003 }).status, "profile-not-applicable");
  assert.equal(resolver.resolveProfileApplicability(profile, { ...BASE_CONTEXT, catalogVariantKey: "wrong.key" }).status, "profile-not-applicable");

  const usa = { ...BASE_CONTEXT, region: "USA" };
  assert.equal(resolver.resolveEntry(findEntry("fuses.circuit.standard"), BASE_CONTEXT).status, "not-applicable");
  assert.equal(resolver.resolveEntry(findEntry("fuses.circuit.standard"), usa).status, "resolved");
  assert.equal(resolver.resolveEntry(findEntry("fuses.circuit.standard"), { ...usa, abs: null }).status, "ambiguous-context");
  assert.equal(resolver.resolveEntry(findEntry("fuses.circuit.standard"), { ...usa, abs: true }).status, "not-applicable");
  assert.equal(resolver.resolveEntry(findEntry("fuses.circuit.abs"), BASE_CONTEXT).status, "not-applicable");
  assert.equal(resolver.resolveEntry(findEntry("fuses.circuit.abs"), { ...BASE_CONTEXT, abs: true }).status, "resolved");
  assert.equal(resolver.resolveEntry(findEntry("fuses.circuit.abs"), { ...BASE_CONTEXT, abs: null }).status, "ambiguous-context");
});

test("standard-fuse evidence is USA-only and cannot leak into search without region or ABS context", () => {
  const entry = findEntry("fuses.circuit.standard");
  assert.deepEqual(entry.applicability, { regions: ["USA"], abs: false });

  for (const context of [
    { ...BASE_CONTEXT, region: null, abs: false },
    { ...BASE_CONTEXT, region: "USA", abs: null },
    { ...BASE_CONTEXT, region: "EU", abs: false }
  ]) {
    const item = searchApi.buildSearchIndex(profile, context).items
      .find(candidate => candidate.entryId === entry.id);
    if (item) {
      assert.notEqual(item.resolutionStatus, "resolved");
      assert.equal(item.rawValue, null);
      assert.equal(item.formattedValue, null);
    }
  }

  const resolved = searchApi.buildSearchIndex(profile, { ...BASE_CONTEXT, region: "USA", abs: false }).items
    .find(candidate => candidate.entryId === entry.id);
  assert.equal(resolved.resolutionStatus, "resolved");
});

test("verified clutch wording is limited to the directly sourced hydraulic-system claims", () => {
  const entry = findEntry("adjustments.clutch.system");
  assert.equal(entry.status, "verified");
  assert.deepEqual(entry.sourceIds, ["cite.honda.vfr800-2002.sm.clutch-system"]);
  assert.match(entry.value.text, /uruchamiane hydraulicznie/);
  assert.match(entry.value.text, /nie wymaga regulacji/);
  assert.doesNotMatch(entry.value.text, /luz[u]? linki/);
});

test("regional headlight variants resolve explicitly and missing region stays ambiguous", () => {
  const entry = findEntry("lighting.headlight");
  const eu = resolver.resolveEntry(entry, BASE_CONTEXT);
  const usa = resolver.resolveEntry(entry, { ...BASE_CONTEXT, region: "USA" });
  const unknown = resolver.resolveEntry(entry, { ...BASE_CONTEXT, region: null });
  assert.equal(eu.entry.value.text, "12 V 55 W");
  assert.equal(eu.selectedVariantId, "lighting.headlight.eu-uk-au");
  assert.equal(usa.entry.value.text, "12 V 60/55 W");
  assert.equal(usa.selectedVariantId, "lighting.headlight.usa");
  const japan = resolver.resolveEntry(entry, { ...BASE_CONTEXT, region: "JP" });
  assert.equal(japan.status, "resolved");
  assert.equal(japan.selectedVariantId, "lighting.headlight.jp");
  assert.equal(japan.entry.value.text, "Mijania: H4R 45 W ×2; drogowe: H7 55 W ×2");
  assert.equal(japan.entry.quantity.amount, 4);
  assert.equal(unknown.status, "ambiguous-context");
  assert.ok(unknown.requiredContext.includes("region"));
});

test("wave 2 OEM evidence closes dimensions, fuel capacity, PGM-FI fuse and Japan-only CBS", () => {
  const expectedQuantities = {
    "general.chassis.overall-length": [2120, "mm"],
    "general.chassis.overall-width": [735, "mm"],
    "general.chassis.overall-height": [1195, "mm"],
    "general.chassis.wheelbase": [1460, "mm"],
    "general.chassis.seat-height": [805, "mm"],
    "general.chassis.ground-clearance": [125, "mm"],
    "general.chassis.trail": [95, "mm"],
    "general.suspension.front-travel": [120, "mm"],
    "general.suspension.rear-travel": [120, "mm"],
    "general.fuel-tank.capacity": [22, "L"],
    "fuses.pgm-fi": [20, "A"]
  };
  for (const [id, [amount, unit]] of Object.entries(expectedQuantities)) {
    const entry = findEntry(id);
    assert.equal(entry.status, "verified", id);
    assert.equal(entry.value.amount, amount, id);
    assert.equal(entry.value.unit, unit, id);
    assert.ok(entry.sourceIds.length > 0, id);
  }
  assert.equal(findEntry("general.chassis.rake").value.text, "25°30′");
  assert.match(findEntry("fuses.pgm-fi").location, /akumulatorze/);

  const cbs = findEntry("brakes.system.linked-cbs");
  assert.deepEqual(cbs.applicability, { regions: ["JP"] });
  assert.equal(resolver.resolveEntry(cbs, { ...BASE_CONTEXT, region: "JP" }).status, "resolved");
  assert.equal(resolver.resolveEntry(cbs, { ...BASE_CONTEXT, region: "USA" }).status, "not-applicable");
  assert.equal(resolver.resolveEntry(cbs, { ...BASE_CONTEXT, region: null }).status, "ambiguous-context");
});

test("search index builds for the production profile", () => {
  const index = searchApi.buildSearchIndex(profile, BASE_CONTEXT);
  assert.equal(index.profileId, profile.profile.id);
  assert.ok(index.items.length > 60);
});

test("key workshop queries find expected VFR800 entries", () => {
  const index = searchApi.buildSearchIndex(profile, BASE_CONTEXT);
  const expected = {
    olej: "lubrication.engine-oil.specification",
    "korek oleju": "torque.engine.oil-drain-bolt",
    "świeca": "ignition.spark-plug.standard",
    zawory: "maintenance.valve-clearance.inspect",
    opona: "wheels.tire.front.size",
    "łańcuch": "final-drive.chain.slack",
    "bezpiecznik FI": "fuses.pgm-fi",
    "PGM-FI": "fuses.pgm-fi",
    "żarówka": "lighting.headlight",
    akumulator: "electrical.battery.specification",
    "ładowanie": "electrical.generator.output"
  };

  for (const [query, expectedId] of Object.entries(expected)) {
    const results = searchApi.search(index, query);
    assert.ok(results.some(result => result.entryId === expectedId), `${query} did not find ${expectedId}`);
  }
});

test("missing region search never exposes the headlight base as a certain value", () => {
  const index = searchApi.buildSearchIndex(profile, { ...BASE_CONTEXT, region: null });
  const result = searchApi.search(index, "światło mijania")
    .find(item => item.entryId === "lighting.headlight");
  assert.ok(result);
  assert.equal(result.resolutionStatus, "ambiguous-context");
  assert.equal(result.rawValue, null);
  assert.equal(result.formattedValue, null);
});

test("profile, quality report, resolver, and search remain non-mutating", () => {
  const before = JSON.stringify(profile);
  const validation = validator.validate(profile);
  qualityApi.buildQualityReport(profile, validation);
  resolver.resolveProfileApplicability(profile, BASE_CONTEXT);
  const index = searchApi.buildSearchIndex(profile, BASE_CONTEXT);
  searchApi.search(index, "olej");
  assert.equal(JSON.stringify(profile), before);
});
