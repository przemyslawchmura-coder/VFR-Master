const assert = require("node:assert/strict");
const test = require("node:test");
const report = require("../research/reports/cbr500r-pc70-permitted-source-routes.json");

test("CBR500R route authentication is bounded, scoped and value-free", () => {
  assert.equal(report.target, "honda.cbr500r.pc70");
  assert.equal(report.scope.length, 4);
  assert.equal(report.budget.attemptsUsed, 8);
  assert.equal(report.rawCandidatesCreated, 0);
  assert.equal(report.technicalValuesRetained, false);
  assert.equal(report.infrastructureChanged, false);
  assert.equal(report.supabaseChanged, false);
  assert.equal(report.fieldResults["lubrication.oil-specification"], "AUTHENTICATED_PERMITTED");
  assert.equal(report.fieldResults["tires_wheels.loaded-pressures"], "AUTHENTICATED_PERMITTED");
  assert.equal(report.fieldResults["lubrication.oil-filter"], "AUTHENTICATED_BUT_APPLICABILITY_PARTIAL");
  assert.equal(report.fieldResults["final_drive.chain-size"], "AUTHENTICATED_BUT_APPLICABILITY_PARTIAL");
  assert.equal(report.independentAudit.classification, "ACCEPT");
});

test("source routes never promote discovery leads to authority", () => {
  const lead = report.routes.find(route => route.sourceIdentity.includes("bike-parts-honda"));
  assert.equal(lead.sourceClass, "DISCOVERY_ONLY");
  assert.equal(lead.classification, "DISCOVERY_ONLY");
  assert.equal(report.independentAudit.checks.bikePartsHondaNotUpgraded, true);
});

test("permitted pressure route remains gated to loaded conditions", () => {
  const route = report.routes.find(route => route.fieldId === "tires_wheels.loaded-pressures");
  assert.equal(route.sourceClass, "TIER_A_OEM");
  assert.deepEqual(route.unresolvedDimensions, ["loaded/passenger condition must be confirmed during extraction"]);
  assert.equal(report.independentAudit.checks.loadedPressureConditionSeparatedFromStandardPressure, true);
});

test("audit records fail-closed partial and blocked routes", () => {
  const parts = report.routes.find(route => route.sourceIdentity === "honda.official.parts.cbr500rar.2024");
  const chain = report.routes.find(route => route.sourceIdentity === "rk.japan.chain-selection");
  assert.equal(parts.classification, "AUTHENTICATED_BUT_APPLICABILITY_PARTIAL");
  assert.equal(chain.publicAccessibility, "ACCESS_BLOCKED");
  assert.equal(chain.classification, "AUTHENTICATED_BUT_APPLICABILITY_PARTIAL");
  assert.equal(report.independentAudit.checks.noAuthorityInferredFromBrandingOrHttpSuccess, true);
});

test("route report is JSON-safe and reproducible", () => {
  assert.deepEqual(JSON.parse(JSON.stringify(report)), report);
});
