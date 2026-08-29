"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const contextApi = require("../js/technical/motorcycle-technical-context.js");
const bridge = require("../js/technical/motorcycle-technical-profile-bridge.js");
const searchApi = require("../js/technical/technical-profile-search.js");

const STORED_MOTORCYCLE = Object.freeze({
  id: "bike-1",
  user_id: "user-1",
  brand: "Honda",
  model: "VFR800 VTEC",
  year: 2002,
  mileage: 42000,
  vin: null,
  nickname: "Turystyk",
  catalogVariantKey: "honda.vfr800.rc46.vtec.gen1",
  created_at: "2026-08-29T10:00:00Z",
  services: [],
  costs: [],
  history: []
});

test("stored motorcycle produces a ready discovery context", () => {
  assert.equal(contextApi.buildTechnicalContext(STORED_MOTORCYCLE).status, "ready");
});

test("year is transferred without inference", () => {
  assert.equal(contextApi.buildTechnicalContext(STORED_MOTORCYCLE).context.year, 2002);
});

test("catalogVariantKey is transferred without brand/model matching", () => {
  assert.equal(
    contextApi.buildTechnicalContext(STORED_MOTORCYCLE).context.catalogVariantKey,
    "honda.vfr800.rc46.vtec.gen1"
  );
});

test("unknown region remains null", () => {
  assert.equal(contextApi.buildTechnicalContext(STORED_MOTORCYCLE).context.region, null);
});

test("unknown ABS remains null", () => {
  assert.equal(contextApi.buildTechnicalContext(STORED_MOTORCYCLE).context.abs, null);
});

test("missing equipment remains unknown rather than invented", () => {
  assert.equal(contextApi.buildTechnicalContext(STORED_MOTORCYCLE).context.equipment, null);
});

test("explicit resolution fields are preserved and equipment is normalized", () => {
  const result = contextApi.buildTechnicalContext({
    ...STORED_MOTORCYCLE,
    region: "EU",
    abs: false,
    equipment: ["heated-grips", "heated-grips", " luggage ", 10]
  });
  assert.equal(result.context.region, "EU");
  assert.equal(result.context.abs, false);
  assert.deepEqual(result.context.equipment, ["heated-grips", "luggage"]);
});

test("missing year is reported explicitly", () => {
  const result = contextApi.buildTechnicalContext({ ...STORED_MOTORCYCLE, year: null });
  assert.equal(result.status, "insufficient-context");
  assert.deepEqual(result.requiredContext, ["year"]);
});

test("missing catalogVariantKey is reported explicitly", () => {
  const result = contextApi.buildTechnicalContext({ ...STORED_MOTORCYCLE, catalogVariantKey: null });
  assert.equal(result.status, "insufficient-context");
  assert.deepEqual(result.requiredContext, ["catalogVariantKey"]);
});

test("legacy brand/model text is never mapped heuristically", () => {
  const result = contextApi.buildTechnicalContext({ brand: "Honda", model: "VFR800 VTEC", year: 2002 });
  assert.equal(result.status, "insufficient-context");
  assert.equal(result.context.catalogVariantKey, null);
});

test("null and empty input return normal insufficient-context results", () => {
  for (const input of [null, {}, [], undefined]) {
    const result = contextApi.buildTechnicalContext(input);
    assert.equal(result.status, "insufficient-context");
    assert.deepEqual(result.requiredContext, ["catalogVariantKey", "year"]);
  }
});

test("context from motorcycle discovers and loads the registered profile", async () => {
  const result = await bridge.openProfileForMotorcycle(STORED_MOTORCYCLE);
  assert.equal(result.status, "loaded");
  assert.equal(result.discovery.status, "found");
  assert.equal(result.profile.profile.id, "honda.vfr800.rc46-vtec-gen1.2002");
});

test("runtime confirms loaded profile applicability", async () => {
  const result = await bridge.openProfileForMotorcycle(STORED_MOTORCYCLE);
  assert.equal(result.applicability.status, "profile-applicable");
});

test("bridge resolves an entry independent of region and ABS", async () => {
  const result = await bridge.resolveEntryForMotorcycle(STORED_MOTORCYCLE, "torque.engine.oil-drain-bolt");
  assert.equal(result.entryResolution.status, "resolved");
  assert.deepEqual(result.entryResolution.entry.value, { type: "quantity", amount: 30, unit: "N·m" });
});

test("search works through motorcycle context, registry, and loader", async () => {
  const opened = await bridge.openProfileForMotorcycle(STORED_MOTORCYCLE);
  const index = searchApi.buildSearchIndex(opened.profile, opened.technicalContext);
  assert.equal(searchApi.search(index, "korek oleju")[0].entryId, "torque.engine.oil-drain-bolt");
});

test("missing region keeps the headlight entry ambiguous", async () => {
  const result = await bridge.resolveEntryForMotorcycle(STORED_MOTORCYCLE, "lighting.headlight");
  assert.equal(result.entryResolution.status, "ambiguous-context");
  assert.ok(result.entryResolution.requiredContext.includes("region"));
  assert.equal(result.entryResolution.entry, undefined);
});

test("missing ABS does not select either ABS-dependent fuse entry", async () => {
  const result = await bridge.resolveEntryForMotorcycle(STORED_MOTORCYCLE, "fuses.circuit.abs");
  assert.equal(result.entryResolution.status, "ambiguous-context");
  assert.ok(result.entryResolution.requiredContext.includes("abs"));
  assert.equal(result.entryResolution.entry, undefined);
});

test("unsupported motorcycle returns not-found without throwing", async () => {
  const result = await bridge.openProfileForMotorcycle({
    ...STORED_MOTORCYCLE,
    catalogVariantKey: "unsupported.brand.model.variant"
  });
  assert.equal(result.status, "not-found");
});

test("year without an available profile returns not-found", async () => {
  const result = await bridge.openProfileForMotorcycle({ ...STORED_MOTORCYCLE, year: 2003 });
  assert.equal(result.status, "not-found");
});

test("adapter and complete bridge pipeline do not mutate inputs or profile", async () => {
  const motorcycle = JSON.parse(JSON.stringify(STORED_MOTORCYCLE));
  const motorcycleBefore = JSON.stringify(motorcycle);
  const opened = await bridge.openProfileForMotorcycle(motorcycle);
  const contextBefore = JSON.stringify(opened.technicalContext);
  const profileBefore = JSON.stringify(opened.profile);

  await bridge.resolveEntryForMotorcycle(motorcycle, "lighting.headlight");
  searchApi.search(searchApi.buildSearchIndex(opened.profile, opened.technicalContext), "korek oleju");

  assert.equal(JSON.stringify(motorcycle), motorcycleBefore);
  assert.equal(JSON.stringify(opened.technicalContext), contextBefore);
  assert.equal(JSON.stringify(opened.profile), profileBefore);
});
