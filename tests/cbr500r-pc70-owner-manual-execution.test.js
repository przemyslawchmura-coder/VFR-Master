const assert = require("node:assert/strict");
const test = require("node:test");
const report = require("../research/reports/cbr500r-pc70-owner-manual-execution.json");
const wave = require("../research/data/cbr500r-pc70-owner-manual-execution.js");

test("CBR500R execution uses one authenticated route and exactly two slots", () => {
  assert.equal(report.target.catalogVariantKey, "honda.cbr500r.pc70");
  assert.deepEqual(report.execution.fieldsAttempted, ["lubrication.oil-specification", "tires_wheels.loaded-pressures"]);
  assert.equal(report.execution.sourceRoutesUsed, 1);
  assert.equal(report.budget.newDiscoveryAttempts, 0);
  assert.equal(report.source.authenticationReused, true);
});

test("oil specification is one generic raw candidate with bounded provenance", () => {
  const field = report.fields["lubrication.oil-specification"];
  assert.equal(field.status, "RAW-CANDIDATE");
  assert.equal(field.candidateIds.length, 1);
  assert.match(field.exactLocator, /PDF page 180/);
  assert.match(field.rawWording, /SAE 10W-30/);
  assert.equal(report.extraction.ambiguityPolicy, "REJECT");
  assert.equal(report.extraction.oil.disposition, "CANDIDATES-PRODUCED");
  const candidate = field.rawCandidates[0];
  for (const key of ["targetId", "fieldId", "sourceIdentity", "sourceClass", "sourceUrl", "acquisitionArtifactId", "artifactSha256", "derivedContentId", "derivedDigest", "extractionRuleId", "extractionPlaybookId", "rawValue", "exactLocator", "applicability"]) assert.ok(candidate[key] !== undefined, key);
  assert.equal(candidate.sourceClass, "TIER_A_OEM");
});

test("loaded pressure stops without inferring a passenger condition", () => {
  const field = report.fields["tires_wheels.loaded-pressures"];
  assert.equal(field.status, "STOPPED");
  assert.equal(field.stopReason, "NO_EXPLICIT_LOADED_CONDITION");
  assert.equal(field.standardPressureObserved, true);
  assert.equal(field.loadedConditionProven, false);
  assert.equal(field.candidateIds.length, 0);
  assert.equal(report.extraction.loaded.disposition, "NO-CANDIDATES");
});

test("wave module binds the existing generic route and target", () => {
  assert.equal(wave.source.id, "honda.official.owner-manual.31MLRB000.2024");
  assert.equal(wave.target.catalogVariantKey, "honda.cbr500r.pc70");
  assert.equal(wave.OIL_RULE.ambiguityPolicy, "REJECT");
  assert.equal(wave.LOADED_RULE.ambiguityPolicy, "REJECT");
});

test("execution remains pre-review and production isolated", () => {
  assert.equal(report.totals.rawCandidates, 1);
  assert.equal(report.totals.reviewDecisionsCreated, 0);
  assert.equal(report.totals.evidenceCreated, 0);
  assert.equal(report.totals.serviceCoreChanged, false);
  assert.equal(report.totals.productionChanged, false);
  assert.equal(report.totals.infrastructureChanged, false);
});

test("independent audit accepts the bounded raw-only execution", () => {
  assert.equal(report.independentAudit.classification, "ACCEPT");
  assert.equal(report.independentAudit.checks.onlyAuthenticatedHondaRoute, true);
  assert.equal(report.independentAudit.checks.standardPressureSeparatedFromLoaded, true);
  assert.equal(report.independentAudit.checks.noManualTranscription, true);
  assert.equal(report.independentAudit.checks.serviceCoreChanged, false);
  assert.equal(report.independentAudit.researchRisks.length, 2);
});
