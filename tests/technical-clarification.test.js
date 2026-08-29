"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const context = require("../js/technical/motorcycle-technical-context.js");
const ui = require("../js/technical/technical-profile-ui.js");

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
