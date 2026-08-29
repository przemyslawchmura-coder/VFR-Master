"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");

const registry = require("../js/technical/technical-profile-registry.js");
const loader = require("../js/technical/technical-profile-loader.js");
const runtime = require("../js/technical/technical-profile-runtime.js");
const resolver = require("../js/technical/technical-profile-resolver.js");
const searchApi = require("../js/technical/technical-profile-search.js");

const PROFILE_ID = "honda.vfr800.rc46-vtec-gen1.2002";
const CONTEXT = Object.freeze({
  catalogVariantKey: "honda.vfr800.rc46.vtec.gen1",
  year: 2002,
  region: "EU",
  abs: false,
  equipment: []
});

function descriptor(id, from, to, moduleId = "synthetic.js") {
  return {
    profileId: id,
    catalogVariantKeys: ["test.brand.model.variant"],
    years: { from, to },
    moduleId,
    status: "review",
    schemaVersion: "revlog-technical-profile/v1"
  };
}

test("registry contains the VFR800 2002 Reference Production Profile", () => {
  assert.ok(registry.listProfiles().some(item => item.profileId === PROFILE_ID));
});

test("listProfiles returns isolated descriptor data", () => {
  const first = registry.listProfiles();
  first[0].years.from = 1999;
  assert.equal(registry.listProfiles()[0].years.from, 2002);
});

test("exact profileId lookup works and unknown IDs return null", () => {
  assert.equal(registry.getProfileDescriptor(PROFILE_ID).profileId, PROFILE_ID);
  assert.equal(registry.getProfileDescriptor("missing.profile"), null);
});

test("catalogVariantKey and year discover VFR800 2002 deterministically", () => {
  const result = registry.findProfileDescriptor(CONTEXT);
  assert.equal(result.status, "found");
  assert.equal(result.descriptor.profileId, PROFILE_ID);
});

test("wrong year and key return not-found", () => {
  assert.equal(registry.findProfileDescriptor({ ...CONTEXT, year: 2003 }).status, "not-found");
  assert.equal(registry.findProfileDescriptor({ ...CONTEXT, catalogVariantKey: "wrong.key" }).status, "not-found");
});

test("missing year or catalogVariantKey returns insufficient-context", () => {
  assert.deepEqual(registry.findProfileDescriptor({ catalogVariantKey: CONTEXT.catalogVariantKey }), {
    status: "insufficient-context",
    requiredContext: ["year"]
  });
  assert.deepEqual(registry.findProfileDescriptor({ year: 2002 }), {
    status: "insufficient-context",
    requiredContext: ["catalogVariantKey"]
  });
});

test("equally specific matching descriptors return ambiguous", () => {
  const synthetic = registry.createRegistry([
    descriptor("test.profile.one", 2000, 2005),
    descriptor("test.profile.two", 2000, 2005)
  ]);
  assert.deepEqual(synthetic.findProfileDescriptor({ catalogVariantKey: "test.brand.model.variant", year: 2002 }), {
    status: "ambiguous",
    matchingProfileIds: ["test.profile.one", "test.profile.two"]
  });
});

test("a narrower matching year range wins over a broad descriptor", () => {
  const synthetic = registry.createRegistry([
    descriptor("test.profile.broad", 2000, 2005),
    descriptor("test.profile.exact", 2002, 2002)
  ]);
  assert.equal(
    synthetic.findProfileDescriptor({ catalogVariantKey: "test.brand.model.variant", year: 2002 }).descriptor.profileId,
    "test.profile.exact"
  );
});

test("loader loads the discovered local profile and validates it", async () => {
  const loaded = await loader.loadProfileForContext(CONTEXT);
  assert.equal(loaded.status, "loaded");
  assert.equal(loaded.profile.profile.id, PROFILE_ID);
  assert.deepEqual(loaded.validation, { valid: true, errors: [], warnings: [] });
});

test("normal discovery misses never attempt module loading", async () => {
  let calls = 0;
  const guarded = loader.createProfileLoader({
    registry,
    loadModule: async () => { calls += 1; throw new Error("must not run"); }
  });
  const result = await guarded.loadProfileForContext({ ...CONTEXT, year: 1999 });
  assert.equal(result.status, "not-found");
  assert.equal(calls, 0);
});

test("runtime connects discovery, loading, applicability, and entry resolution", async () => {
  const result = await runtime.resolveEntryForContext(CONTEXT, "torque.engine.oil-drain-bolt");
  assert.equal(result.status, "loaded");
  assert.equal(result.applicability.status, "profile-applicable");
  assert.equal(result.entryResolution.status, "resolved");
  assert.equal(result.entryResolution.entry.value.amount, 30);
});

test("loaded profile can be passed directly to resolver", async () => {
  const loaded = await loader.loadProfileForContext(CONTEXT);
  assert.equal(resolver.resolveProfileApplicability(loaded.profile, CONTEXT).status, "profile-applicable");
});

test("loaded profile can be passed directly to the existing search engine", async () => {
  const loaded = await loader.loadProfileForContext(CONTEXT);
  const index = searchApi.buildSearchIndex(loaded.profile, CONTEXT);
  assert.equal(searchApi.search(index, "korek oleju")[0].entryId, "torque.engine.oil-drain-bolt");
});

test("production registry passes structural and loaded-profile integrity", async () => {
  assert.deepEqual(registry.validateRegistry(), { valid: true, errors: [], warnings: [] });
  assert.deepEqual(await loader.validateRegistryIntegrity(), { valid: true, errors: [], warnings: [] });
});

test("registry validation detects broken and ambiguous descriptors", () => {
  const broken = [
    descriptor("duplicate.profile", 2005, 2000, ""),
    descriptor("duplicate.profile", 2000, 2005)
  ];
  const report = registry.validateDescriptors(broken);
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(item => item.code === "DUPLICATE_PROFILE_ID"));
  assert.ok(report.errors.some(item => item.code === "INVALID_YEARS"));
  assert.ok(report.errors.some(item => item.code === "INVALID_MODULE_ID"));

  const wrongSchema = registry.validateDescriptors([
    { ...descriptor("test.profile.schema", 2002, 2002), schemaVersion: "wrong/v1" }
  ]);
  assert.ok(wrongSchema.errors.some(item => item.code === "INVALID_SCHEMA_VERSION"));

  const overlap = registry.validateDescriptors([
    descriptor("test.profile.one", 2000, 2005),
    descriptor("test.profile.two", 2000, 2005)
  ]);
  assert.ok(overlap.errors.some(item => item.code === "AMBIGUOUS_DESCRIPTOR_OVERLAP"));
});

test("integrity detects module, identity, and applicability mismatches", async () => {
  const syntheticRegistry = registry.createRegistry([
    descriptor("expected.profile", 2002, 2002)
  ]);
  const syntheticLoader = loader.createProfileLoader({
    registry: syntheticRegistry,
    loadModule: async () => ({
      schemaVersion: "revlog-technical-profile/v1",
      profile: { id: "different.profile", revision: 1, status: "review" },
      motorcycle: { applicability: { catalogVariantKeys: ["different.key"], years: { from: 2002, to: 2002 } } },
      categories: [], entries: [], documents: {}, citations: {}
    })
  });
  const report = await syntheticLoader.validateRegistryIntegrity();
  assert.equal(report.valid, false);
  assert.ok(report.errors.some(item => item.code === "PROFILE_ID_MISMATCH"));
  assert.ok(report.errors.some(item => item.code === "PROFILE_APPLICABILITY_MISMATCH"));
});

test("registry, loader, context, and loaded profile remain immutable", async () => {
  const registryBefore = JSON.stringify(registry.listProfiles());
  const context = JSON.parse(JSON.stringify(CONTEXT));
  const contextBefore = JSON.stringify(context);
  const loaded = await loader.loadProfileForContext(context);
  const profileBefore = JSON.stringify(loaded.profile);

  registry.findProfileDescriptor(context);
  await runtime.resolveEntryForContext(context, "lighting.headlight");
  searchApi.search(searchApi.buildSearchIndex(loaded.profile, context), "żarówka");

  assert.equal(JSON.stringify(registry.listProfiles()), registryBefore);
  assert.equal(JSON.stringify(context), contextBefore);
  assert.equal(JSON.stringify(loaded.profile), profileBefore);
});
