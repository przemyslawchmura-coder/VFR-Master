"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const ui = require("../js/technical/technical-profile-ui.js");
const resolver = require("../js/technical/technical-profile-resolver.js");
const context = require("../js/technical/motorcycle-technical-context.js");

test("clarification metadata is optional and mapped without guessing", () => {
  const legacy = context.buildTechnicalContext({ catalogVariantKey: "x", year: 2021, brand: "Yamaha", model: "MT-09" });
  assert.equal(legacy.context.region, null);
  assert.equal(legacy.context.abs, null);
  const clarified = context.buildTechnicalContext({ catalogVariantKey: "x", year: 2021, clarification: { market: "USA", abs: true, equipmentVariant: "touring" } });
  assert.equal(clarified.context.region, "USA");
  assert.equal(clarified.context.abs, true);
  assert.deepEqual(clarified.context.equipment, ["touring"]);
});

test("clarification view asks only for unresolved resolver fields", () => {
  const html = ui.renderTechnicalProfileHtml({
    status: "ready", profileName: "Test", profileId: "test", motorcycleYear: 2021,
    resolutionContext: { region: "unknown", abs: "unknown", equipment: "unknown" },
    entriesById: { headlight: { id: "headlight", label: "Headlight", resolutionStatus: "ambiguous-context", requiredContext: ["region"], status: "verified", statusLabel: "Zweryfikowane", sources: [] } },
    categories: [], searchIndex: {}
  });
  assert.match(html, /Doprecyzuj wersję motocykla/);
  assert.match(html, /Rynek \/ region/);
  assert.doesNotMatch(html, /Wersja ABS/);
});

test("ABS options preserve false and saved values are selected", () => {
  const base = { status: "ready", profileName: "Test", profileId: "test", motorcycleYear: 2021, resolutionContext: {}, categories: [], searchIndex: {}, entriesById: {
    a: { id: "a", label: "A", resolutionStatus: "ambiguous-context", requiredContext: ["abs"], candidates: { abs: [true] }, status: "verified", statusLabel: "Zweryfikowane", sources: [] },
    b: { id: "b", label: "B", resolutionStatus: "ambiguous-context", requiredContext: ["abs"], candidates: { abs: [false] }, status: "verified", statusLabel: "Zweryfikowane", sources: [] }
  } };
  const html = ui.renderTechnicalProfileHtml({ ...base, clarification: { abs: false } });
  assert.match(html, />ABS</);
  assert.match(html, />Bez ABS</);
  assert.match(html, /value="false" selected/);
  assert.doesNotMatch(html, /value="true" selected/);
});

test("saved transmission variants remain selected after clarification re-render", () => {
  const base = { status: "ready", profileName: "Test", profileId: "test", motorcycleYear: 2021, resolutionContext: {}, categories: [], searchIndex: {}, entriesById: {
    transmission: { id: "transmission", label: "Transmission", resolutionStatus: "ambiguous-context", requiredContext: ["transmission"], candidates: { transmission: ["manual", "dct"] }, status: "verified", statusLabel: "Zweryfikowane", sources: [] }
  } };
  for (const value of ["manual", "dct"]) {
    const html = ui.renderTechnicalProfileHtml({ ...base, clarification: { transmissionVariant: value } });
    assert.match(html, new RegExp(`value="${value}" selected`));
    assert.doesNotMatch(html, new RegExp(`value="${value === "manual" ? "dct" : "manual"}" selected`));
  }
  assert.match(ui.renderTechnicalProfileHtml({ ...base, clarification: { transmissionVariant: null } }), /value="" selected/);
});

test("clarification field names round-trip through context and resolver", () => {
  const motorcycle = { catalogVariantKey: "x", year: 2021, clarification: { market: "EU", abs: false, equipmentVariant: "touring", modelCode: "A", transmissionVariant: "manual", emissionsVariant: "EURO-3" } };
  const built = context.buildTechnicalContext(motorcycle);
  assert.equal(built.context.region, "EU");
  assert.equal(built.context.abs, false);
  assert.deepEqual(built.context.equipment, ["touring"]);
  assert.equal(built.context.modelCode, "A");
  assert.equal(built.context.transmission, "manual");
  assert.equal(built.context.emissionsVariant, "EURO-3");
  const entry = { id: "x", value: { type: "text", text: "base" }, variants: [{ id: "manual", when: { transmission: "manual" }, patch: { value: { type: "text", text: "manual" } } }] };
  assert.equal(resolver.resolveEntry(entry, built.context).entry.value.text, "manual");
});

test("clarification option extraction excludes only nullish/empty values", () => {
  const options = ui.getClarificationOptions({ entriesById: { x: { candidates: { abs: [true, false, null, undefined], region: ["EU", "", "USA"] } } } }, "abs");
  assert.deepEqual(options, [true, false]);
});

test("ABS remains tri-state through resolver", () => {
  const entry = { id: "x", value: { type: "text", text: "base" }, variants: [
    { id: "abs", when: { abs: true }, patch: { value: { type: "text", text: "abs" } } },
    { id: "non-abs", when: { abs: false }, patch: { value: { type: "text", text: "non-abs" } } }
  ] };
  assert.equal(resolver.resolveEntry(entry, { abs: false }).entry.value.text, "non-abs");
  assert.equal(resolver.resolveEntry(entry, { abs: true }).entry.value.text, "abs");
  assert.equal(resolver.resolveEntry(entry, { abs: null }).status, "ambiguous-context");
});

function requirementView(requiredContext, clarification = {}, resolutionStatus = "ambiguous-context") {
  return { clarification, entriesById: { entry: { resolutionStatus, requiredContext, candidates: { abs: [true, false], region: ["EU", "USA"], equipment: ["touring"] } } } };
}

test("context refinement requirements are explicit, minimal and safe", () => {
  assert.deepEqual(ui.buildContextRefinementRequirements(requirementView(["abs"])).map(item => item.contextField), ["abs"]);
  assert.deepEqual(ui.buildContextRefinementRequirements(requirementView(["region"])).map(item => item.key), ["market"]);
  assert.deepEqual(ui.buildContextRefinementRequirements(requirementView(["region", "abs"])).map(item => item.contextField), ["region", "abs"]);
  assert.deepEqual(ui.buildContextRefinementRequirements(requirementView(["abs"], {}, "resolved")), []);
  assert.deepEqual(ui.buildContextRefinementRequirements(requirementView(["abs", "modelCode", "unknown"])).map(item => item.contextField), ["abs", "modelCode"]);
  assert.equal(ui.buildContextRefinementRequirements(requirementView(["abs"], { abs: false }))[0].currentValue, false);
  assert.equal(ui.buildContextRefinementRequirements(requirementView(["region"], { market: "EU" }))[0].currentValue, "EU");
  assert.deepEqual(ui.buildContextRefinementRequirements(requirementView(["equipment"])).map(item => item.contextField), ["equipment"]);
  assert.deepEqual(ui.buildContextRefinementRequirements(requirementView(["abs", "abs", "region"])).map(item => item.contextField), ["abs", "region"]);
});

test("partial clarification follows resolved entries and preserves known false", () => {
  const partiallyResolved = {
    clarification: { market: "EU", abs: null },
    entriesById: {
      regionEntry: { resolutionStatus: "resolved", requiredContext: ["region"], candidates: { region: ["EU", "USA"] } },
      absEntry: { resolutionStatus: "ambiguous-context", requiredContext: ["abs"], candidates: { abs: [true, false] } }
    }
  };
  assert.deepEqual(ui.buildContextRefinementRequirements(partiallyResolved).map(item => item.contextField), ["abs"]);

  const inverse = {
    clarification: { market: null, abs: false },
    entriesById: {
      absEntry: { resolutionStatus: "resolved", requiredContext: ["abs"], candidates: { abs: [true, false] } },
      regionEntry: { resolutionStatus: "ambiguous-context", requiredContext: ["region"], candidates: { region: ["EU", "USA"] } }
    }
  };
  const requirements = ui.buildContextRefinementRequirements(inverse);
  assert.deepEqual(requirements.map(item => item.contextField), ["region"]);
  assert.equal(requirements[0].key, "market");
  assert.equal(inverse.clarification.abs, false);
});

test("generic unknown context without actionable requirements renders no clarification card", () => {
  const view = { status: "ready", profileName: "Test", profileId: "test", motorcycleYear: 2021,
    resolutionContext: { region: "unknown", abs: "unknown", equipment: "unknown" }, entriesById: {
      stable: { resolutionStatus: "resolved", requiredContext: [], candidates: {} }
    }, categories: [], searchIndex: {} };
  const html = ui.renderTechnicalProfileHtml(view);
  assert.doesNotMatch(html, /technical-context-notice|technical-clarification/);
});
