"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const resolver = require("../js/technical/technical-profile-resolver.js");
const fixture = require("./fixtures/technical-profile-v1.fixture.js");

function cloneFixture() {
  return structuredClone(fixture);
}

function getEntry(profile, id) {
  return profile.entries.find(entry => entry.id === id);
}

const correctContext = {
  catalogVariantKey: "fixture.synthetic-1000.gen1",
  year: 2099,
  region: "EU",
  abs: false,
  equipment: []
};

test("profile is applicable for correct catalogue key and year", () => {
  const result = resolver.resolveProfileApplicability(fixture, correctContext);

  assert.equal(result.status, "profile-applicable");
  assert.equal(result.trace.finalStatus, "profile-applicable");
});

test("profile is not applicable for wrong catalogue key", () => {
  const result = resolver.resolveProfileApplicability(fixture, {
    ...correctContext,
    catalogVariantKey: "fixture.different.gen1"
  });

  assert.equal(result.status, "profile-not-applicable");
  assert.deepEqual(result.trace.failedConditions, ["catalogVariantKey"]);
});

test("profile is not applicable for wrong year", () => {
  const result = resolver.resolveProfileApplicability(fixture, {
    ...correctContext,
    year: 2098
  });

  assert.equal(result.status, "profile-not-applicable");
  assert.deepEqual(result.trace.failedConditions, ["year"]);
});

test("missing required profile region returns ambiguous-context", () => {
  const profile = cloneFixture();
  profile.motorcycle.applicability.regions = ["EU", "USA"];

  const result = resolver.resolveProfileApplicability(profile, {
    ...correctContext,
    region: null
  });

  assert.equal(result.status, "ambiguous-context");
  assert.deepEqual(result.requiredContext, ["region"]);
  assert.deepEqual(result.candidates.region, ["EU", "USA"]);
});

test("correct required profile region is applicable", () => {
  const profile = cloneFixture();
  profile.motorcycle.applicability.regions = ["EU"];

  assert.equal(
    resolver.resolveProfileApplicability(profile, correctContext).status,
    "profile-applicable"
  );
});

test("wrong required profile region is not applicable", () => {
  const profile = cloneFixture();
  profile.motorcycle.applicability.regions = ["USA"];

  assert.equal(
    resolver.resolveProfileApplicability(profile, correctContext).status,
    "profile-not-applicable"
  );
});

test("profile ABS true and false are resolved explicitly", () => {
  const profile = cloneFixture();
  profile.motorcycle.applicability.abs = true;

  assert.equal(
    resolver.resolveProfileApplicability(profile, {
      ...correctContext,
      abs: true
    }).status,
    "profile-applicable"
  );
  assert.equal(
    resolver.resolveProfileApplicability(profile, {
      ...correctContext,
      abs: false
    }).status,
    "profile-not-applicable"
  );
});

test("unknown ABS required by profile returns ambiguous-context", () => {
  const profile = cloneFixture();
  profile.motorcycle.applicability.abs = false;

  const result = resolver.resolveProfileApplicability(profile, {
    ...correctContext,
    abs: null
  });

  assert.equal(result.status, "ambiguous-context");
  assert.deepEqual(result.requiredContext, ["abs"]);
  assert.deepEqual(result.candidates.abs, [false]);
});

test("profile equipment restriction is checked without assuming defaults", () => {
  const profile = cloneFixture();
  profile.motorcycle.applicability.equipment = ["touring-package"];

  assert.equal(
    resolver.resolveProfileApplicability(profile, {
      ...correctContext,
      equipment: null
    }).status,
    "ambiguous-context"
  );
  assert.equal(
    resolver.resolveProfileApplicability(profile, {
      ...correctContext,
      equipment: []
    }).status,
    "profile-not-applicable"
  );
  assert.equal(
    resolver.resolveProfileApplicability(profile, {
      ...correctContext,
      equipment: ["touring-package"]
    }).status,
    "profile-applicable"
  );
});

test("entry explicitly applicable to ALL resolves its base value", () => {
  const entry = getEntry(fixture, "lubrication.engine-oil.capacity-with-filter");
  const result = resolver.resolveEntry(entry, {});

  assert.equal(result.status, "resolved");
  assert.equal(result.selectedVariantId, null);
  assert.equal(result.entry.value.amount, 3.5);
});

test("EU entry variant overrides the base value", () => {
  const entry = getEntry(fixture, "lighting.headlight.low-beam");
  const result = resolver.resolveEntry(entry, {
    region: "EU",
    year: 2099,
    equipment: []
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.selectedVariantId, "lighting.headlight.low-beam.eu");
  assert.equal(result.entry.power.amount, 55);
  assert.equal(result.trace.selectedVariant, result.selectedVariantId);
});

test("USA entry variant overrides the base value", () => {
  const entry = getEntry(fixture, "lighting.headlight.low-beam");
  const result = resolver.resolveEntry(entry, {
    region: "USA",
    year: 2098,
    equipment: []
  });

  assert.equal(result.status, "resolved");
  assert.equal(result.selectedVariantId, "lighting.headlight.low-beam.usa");
  assert.equal(result.entry.power.amount, 60);
});

test("most specific region and year variant wins", () => {
  const entry = getEntry(fixture, "lighting.headlight.low-beam");
  const result = resolver.resolveEntry(entry, {
    region: "USA",
    year: 2099,
    equipment: []
  });

  assert.equal(result.status, "resolved");
  assert.equal(
    result.selectedVariantId,
    "lighting.headlight.low-beam.usa-2099"
  );
  assert.equal(result.entry.power.amount, 65);
  assert.deepEqual(
    result.trace.matchedVariants.map(item => item.specificity),
    [1, 2]
  );
});

test("region, year, and ABS is more specific than region and year", () => {
  const entry = structuredClone(
    getEntry(fixture, "lighting.headlight.low-beam")
  );
  entry.variants.push({
    id: "lighting.headlight.low-beam.usa-2099-abs",
    when: {
      regions: ["USA"],
      years: { from: 2099, to: 2099 },
      abs: true
    },
    patch: {
      power: { type: "quantity", amount: 70, unit: "W" }
    },
    status: "verified",
    sourceIds: ["cite.fixture.synthetic-manual.general"]
  });

  const result = resolver.resolveEntry(entry, {
    region: "USA",
    year: 2099,
    abs: true,
    equipment: []
  });

  assert.equal(result.status, "resolved");
  assert.equal(
    result.selectedVariantId,
    "lighting.headlight.low-beam.usa-2099-abs"
  );
  assert.equal(result.entry.power.amount, 70);
});

test("missing region for regional entry variants returns ambiguous-context", () => {
  const entry = getEntry(fixture, "lighting.headlight.low-beam");
  const result = resolver.resolveEntry(entry, { year: 2099, equipment: [] });

  assert.equal(result.status, "ambiguous-context");
  assert.deepEqual(result.requiredContext, ["region"]);
  assert.deepEqual(result.candidates.region, ["EU", "USA"]);
  assert.equal(result.trace.baseApplied, true);
});

test("ABS and non-ABS entry variants resolve separately", () => {
  const entry = getEntry(fixture, "fuses.main");
  const withAbs = resolver.resolveEntry(entry, { abs: true, equipment: [] });
  const withoutAbs = resolver.resolveEntry(entry, { abs: false, equipment: [] });

  assert.equal(withAbs.entry.value.amount, 40);
  assert.equal(withAbs.selectedVariantId, "fuses.main.abs");
  assert.equal(withoutAbs.entry.value.amount, 30);
  assert.equal(withoutAbs.selectedVariantId, "fuses.main.non-abs");
});

test("unknown ABS for ABS variants returns ambiguous-context", () => {
  const entry = getEntry(fixture, "fuses.main");
  const result = resolver.resolveEntry(entry, { abs: null, equipment: [] });

  assert.equal(result.status, "ambiguous-context");
  assert.deepEqual(result.requiredContext, ["abs"]);
  assert.deepEqual(result.candidates.abs, [true, false]);
});

test("year variant resolves for matching year", () => {
  const entry = getEntry(fixture, "torque.engine.spark-plug");
  const result = resolver.resolveEntry(entry, { year: 2099, equipment: [] });

  assert.equal(result.status, "resolved");
  assert.equal(result.entry.value.amount, 14);
  assert.equal(result.selectedVariantId, "torque.engine.spark-plug.my2099");
});

test("equipment variant requires and resolves equipment context", () => {
  const entry = getEntry(fixture, "consumables.oil-filter");
  const missing = resolver.resolveEntry(entry, { equipment: null });
  const standard = resolver.resolveEntry(entry, { equipment: [] });
  const track = resolver.resolveEntry(entry, { equipment: ["track-package"] });

  assert.equal(missing.status, "ambiguous-context");
  assert.deepEqual(missing.requiredContext, ["equipment"]);
  assert.equal(standard.entry.value.text, "FIXTURE-OIL-FILTER");
  assert.equal(track.entry.value.text, "FIXTURE-RACE-FILTER");
});

test("equally specific conflicting variants return ambiguous", () => {
  const entry = getEntry(fixture, "diagnostics.sensor.synthetic.resistance");
  const result = resolver.resolveEntry(entry, {
    region: "EU",
    equipment: []
  });

  assert.equal(result.status, "ambiguous");
  assert.deepEqual(result.matchingVariantIds, [
    "diagnostics.sensor.synthetic.eu-a",
    "diagnostics.sensor.synthetic.eu-b"
  ]);
  assert.equal(result.trace.finalStatus, "ambiguous");
});

test("resolver does not mutate profile, entry, or context", () => {
  const profile = cloneFixture();
  const entry = getEntry(profile, "lighting.headlight.low-beam");
  const context = { region: "USA", year: 2099, equipment: [] };
  const beforeProfile = JSON.stringify(profile);
  const beforeContext = JSON.stringify(context);

  resolver.resolveProfileApplicability(profile, correctContext);
  resolver.resolveEntry(entry, context);

  assert.equal(JSON.stringify(profile), beforeProfile);
  assert.equal(JSON.stringify(context), beforeContext);
});
