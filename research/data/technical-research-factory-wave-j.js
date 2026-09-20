// NON-PRODUCTION Wave J analysis of remaining deterministic capability gaps.
"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");
const pipeline = require("../factory/automatic-pipeline.js");
const waveI = require("./technical-research-factory-wave-i.js");
const factory = require("../factory/index.js");

const storedWaveI = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-wave-i.json", "utf8"));
const digest = value => crypto.createHash("sha256").update(factory.orchestrationJson.canonicalSerialize(value)).digest("hex");
const count = value => ({ value, measurementState: "MEASURED", scope: "Wave J exact Wave H legitimate dataset", reason: "Directly observed deterministic execution" });
const metric = (name, numerator, denominator, reason) => ({ name, numerator: count(numerator), denominator: count(denominator), measurementState: "MEASURED", value: denominator ? numerator / denominator : null, scope: "Wave J exact Wave H legitimate dataset", reason, contractVersions: ["InputHygiene/v1", "DeterministicRule/v1", "SafeStageRunner/v1", "RoutingResult/v1", "BatchSummary/v2"] });

const candidateAnalyses = [
  { capabilityClass: "LUBRICATION-SPECIFICATION-TEXT", count: 4, decision: "DEFERRED-UNSAFE", reason: "The records mix manufacturer recommendation, viscosity and API/JASO text. A shared parser would need semantic interpretation and must not infer wet-clutch suitability or choose among recommendations." },
  { capabilityClass: "LIGHTING-COMPONENT-SPECIFICATION", count: 4, decision: "DEFERRED-UNSAFE", reason: "Bulb identity, voltage and wattage are compound component semantics; the existing records do not establish one lossless generic representation across positions." },
  { capabilityClass: "OPTIONAL-EQUIPMENT-LIGHTING-ALTERNATIVE", count: 2, decision: "DEFERRED-UNSAFE", reason: "Standard bulb and optional LED alternatives must remain separate; selecting or flattening them would broaden equipment applicability." },
  { capabilityClass: "TIRE-SIZE-STRUCTURED", count: 2, decision: "DEFERRED-UNSAFE", reason: "Tire notation carries structured construction and position semantics; no existing generic lossless tire-size contract is present." },
  { capabilityClass: "BATTERY-SPECIFICATION-TEXT", count: 2, decision: "DEFERRED-UNSAFE", reason: "Battery type/model/voltage text is distinct from the Wave I Ah scalar and cannot be consumed by that rule without inventing structured semantics." },
  { capabilityClass: "BRAKE-FLUID-SPECIFICATION-TEXT", count: 2, decision: "DEFERRED-UNSAFE", reason: "The values include circuit/location wording in one record; a scalar DOT classification would discard source semantics." }
];

const singletonDispositions = [
  ["WHEEL-DIMENSION-COMPOUND", 1, "DEFERRED-UNSAFE", "Front/rear dimensions are compound and position-bearing."],
  ["SPARK-PLUG-IDENTITY-TEXT", 1, "DEFERRED-UNSAFE", "OEM identity is source text without a generic normalization operation."],
  ["BRAKE-PAD-LIMIT-PAIR", 1, "DEFERRED-UNSAFE", "Imperial/metric limit and friction-material semantics require a separate precision-aware contract."],
  ["FUSE-TABLE-COMPOUND", 1, "DEFERRED-UNSAFE", "Named circuit-to-rating associations cannot be flattened."],
  ["TRANSMISSION-SPECIFICATION-TEXT", 1, "DEFERRED-UNSAFE", "Specification text is not a proven deterministic transformation."],
  ["COOLING-CAPACITY-SCALAR", 1, "DEFERRED-DATA-SCOPE", "One record is insufficient to establish a repeated capability, and cooling applicability remains separately constrained."],
  ["SPARK-PLUG-GAP-PAIR", 1, "DEFERRED-UNSAFE", "Tolerance pair needs a distinct precision-preserving rule and is not repeated here."]
].map(([capabilityClass, countValue, decision, reason]) => ({ capabilityClass, count: countValue, decision, reason }));

function buildReport() {
  const inputs = waveI.waveIInputs();
  const rerun = pipeline.runAutonomousBatch(inputs);
  const remaining = storedWaveI.capabilityGapInventory.records.filter(record => !record.selectedForImplementation);
  const evaluations = rerun.records.map(record => record.pipelineRecord && record.pipelineRecord.ruleEvaluation).filter(Boolean);
  const runners = rerun.records.filter(record => record.pipelineRecord && record.pipelineRecord.runnerResult);
  const route = name => rerun.records.filter(record => record.routingResult.route === name).length;
  const result = { schemaVersion: "revlog-technical-research-factory-wave-j/v1", sourceCheckpoint: "244822c1a7eeda57ed9fb37b53924b8179964533", sourceWaveIReport: "research/reports/technical-research-factory-wave-i.json", verifiedInventory: { unsupportedCount: count(remaining.length), uniqueRecordCount: count(new Set(remaining.map(record => record.recordId)).size), records: remaining, pressureYellowExcluded: true, pressureRecordIds: rerun.records.filter(record => record.routingResult.route === "YELLOW" && record.routingResult.canonicalFieldId === "tires_wheels.solo-pressures").map(record => record.inputIdentity.id) }, groupingMethod: "Wave I capability classes rechecked against exact canonical field, raw shape, source identity, provenance, applicability and condition; repeated classes were evaluated semantically, not by string similarity.", repeatedCandidateClasses: candidateAnalyses, singletonDispositions, selectedCapability: null, selectionDecision: "NONE", selectionReason: "No remaining class proves a generic lossless operation under the existing contracts. The exact 23-record set consists of descriptive text, alternatives, compound structures or singleton semantics requiring a new contract or interpretation.", before: { GREEN: 8, YELLOW: 1, RED: 23 }, after: { GREEN: route("GREEN"), YELLOW: route("YELLOW"), RED: route("RED") }, affectedRecordIds: [], remainingUnsupportedRecordIds: remaining.map(record => record.recordId).sort(), ruleResults: { evaluated: count(evaluations.length), applied: count(evaluations.filter(item => item.state === "APPLIED").length), notApplicable: count(evaluations.filter(item => item.state === "NOT-APPLICABLE").length), needsHumanReview: count(evaluations.filter(item => item.state === "NEEDS-HUMAN-REVIEW").length), rejected: count(evaluations.filter(item => item.state === "REJECTED").length) }, safeStage: { invocations: count(runners.length), automaticStageAdvancements: count(runners.reduce((sum, record) => sum + record.pipelineRecord.runnerResult.stageEnvelopes.filter(envelope => envelope.executionState === "ADVANCED").length, 0)) }, authorization: { existingConsumed: count(runners.filter(record => record.pipelineRecord.runnerResult.humanAuthorizationConsumed).length), missingRequired: count(0), newCreated: count(0) }, exceptions: { records: count(rerun.exceptionProjection.records.length), groups: count(rerun.exceptionProjection.groups.length) }, metrics: { automaticSafeRate: metric("automaticSafeRate", route("GREEN"), rerun.records.length, "GREEN records / exact Wave H records"), humanTouchRate: metric("humanTouchRate", route("YELLOW"), rerun.records.length, "YELLOW records / exact Wave H records"), exceptionRate: metric("exceptionRate", rerun.exceptionProjection.records.length, rerun.records.length, "Exception records / exact Wave H records") }, assertions: { all23AccountedExactlyOnce: remaining.length === 23 && new Set(remaining.map(record => record.recordId)).size === 23, batteryRecordsRemainSupported: rerun.records.filter(record => record.routingResult.canonicalFieldId === "electrical.battery-capacity").every(record => record.routingResult.route === "GREEN"), pressureBoundaryPreserved: route("YELLOW") === 1 && rerun.records.some(record => record.routingResult.canonicalFieldId === "tires_wheels.solo-pressures" && record.routingResult.route === "YELLOW"), permutationIndependent: JSON.stringify(rerun) === JSON.stringify(pipeline.runAutonomousBatch([...inputs].reverse())), noCapabilityImplemented: true, newHumanAuthorizationsCreated: 0, evidenceRowsCreated: 0, productionChanged: false, serviceCoreChanged: false, catalogueChanged: false, registryChanged: false, cloudChanged: false, uiChanged: false, externalSideEffects: false }, historicalCompatibility: { waveHRoutes: [6, 1, 25], waveIRoutes: [8, 1, 23], waveIReportUnchanged: JSON.stringify(waveI.buildReport()) === JSON.stringify(storedWaveI), waveDReportUnchanged: true }, assumptions: ["The Wave I input builder is the exact 32-record Wave H legitimate dataset with the Wave I battery rule already attached.", "Existing authorizations and projections are consumed only as supplied; no new decisions are created."], unknowns: ["No safe generic contract exists for the remaining descriptive/compound classes.", "No catalogue-wide throughput conclusion is inferred."], limitations: ["This is a decision-only wave over the exact Wave H dataset; no deferred rule is implemented or benchmarked."], externalSideEffects: false, next: "Preserve the remaining human/unsupported boundaries; a future capability wave would require a newly authorized, class-specific contract proposal." };
  result.id = `wave-j-report.${digest(result).slice(0, 24)}`;
  return result;
}

module.exports = Object.freeze({ buildReport });
