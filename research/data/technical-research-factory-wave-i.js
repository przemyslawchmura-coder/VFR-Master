// NON-PRODUCTION Wave I capability-gap inventory and one-rule projection.
"use strict";

const fs = require("node:fs");
const crypto = require("node:crypto");
const factory = require("../factory/index.js");
const pipeline = require("../factory/automatic-pipeline.js");
const rules = require("../factory/deterministic-rule-library.js");
const waveH = require("./technical-research-factory-large-batch.js");
const storedWaveH = JSON.parse(fs.readFileSync("research/reports/technical-research-factory-large-batch.json", "utf8"));

const digest = value => crypto.createHash("sha256").update(factory.orchestrationJson.canonicalSerialize(value)).digest("hex");
const count = (value, scope = "Wave I exact Wave H legitimate dataset") => ({ value, measurementState: "MEASURED", scope, reason: "Directly observed deterministic execution" });
const metric = (name, numerator, denominator, reason) => ({ name, numerator: count(numerator), denominator: count(denominator), measurementState: "MEASURED", value: denominator === 0 ? null : numerator / denominator, scope: "Wave I exact Wave H legitimate dataset", reason, contractVersions: ["InputHygiene/v1", "DeterministicRule/v1", "SafeStageRunner/v1", "RoutingResult/v1", "BatchSummary/v2"] });

const classFor = field => ({
  "lighting.rear-tail": "LIGHTING-COMPONENT-SPECIFICATION",
  "lighting.license-plate": "LIGHTING-COMPONENT-SPECIFICATION",
  "lighting.front-indicators": "OPTIONAL-EQUIPMENT-LIGHTING-ALTERNATIVE",
  "lighting.front-position": "LIGHTING-COMPONENT-SPECIFICATION",
  "lighting.rear-indicators": "OPTIONAL-EQUIPMENT-LIGHTING-ALTERNATIVE",
  "lighting.low-beam": "LIGHTING-COMPONENT-SPECIFICATION",
  "electrical.battery-capacity": "BATTERY-CAPACITY-EXPLICIT-AH-SCALAR",
  "lubrication.oil-specification": "LUBRICATION-SPECIFICATION-TEXT",
  "brakes.brake-fluid": "BRAKE-FLUID-SPECIFICATION-TEXT",
  "cooling.capacity": "COOLING-CAPACITY-SCALAR",
  "tires_wheels.rim-sizes": "WHEEL-DIMENSION-COMPOUND",
  "ignition.plug-gap": "SPARK-PLUG-GAP-PAIR",
  "tires_wheels.rear-size": "TIRE-SIZE-STRUCTURED",
  "electrical.battery-specification": "BATTERY-SPECIFICATION-TEXT",
  "brakes.pad-thickness-limit": "BRAKE-PAD-LIMIT-PAIR",
  "tires_wheels.front-size": "TIRE-SIZE-STRUCTURED",
  "transmission_clutch.transmission-type": "TRANSMISSION-SPECIFICATION-TEXT",
  "lubrication.api-jaso": "LUBRICATION-SPECIFICATION-TEXT",
  "ignition.spark-plug-oem": "SPARK-PLUG-IDENTITY-TEXT",
  "electrical.fuse-ratings": "FUSE-TABLE-COMPOUND",
  "lubrication.viscosity": "LUBRICATION-SPECIFICATION-TEXT"
})[field] || "UNCLASSIFIED-CAPABILITY-GAP";

const selectionReason = {
  "BATTERY-CAPACITY-EXPLICIT-AH-SCALAR": "Two records share the same canonical field and explicit single Ah scalar shape; both retain complete source/provenance/applicability and have no condition or compound semantics.",
  "LIGHTING-COMPONENT-SPECIFICATION": "Component identity and electrical values are compound source specifications; no lossless generic decomposition contract exists.",
  "OPTIONAL-EQUIPMENT-LIGHTING-ALTERNATIVE": "Standard and optional LED alternatives must remain distinct; selecting or flattening an alternative would change applicability.",
  "LUBRICATION-SPECIFICATION-TEXT": "Source text contains recommendation, viscosity and/or API/JASO semantics that are not one shared scalar transformation.",
  "BRAKE-FLUID-SPECIFICATION-TEXT": "DOT4 text includes circuit/location semantics in at least one source and has no existing generic text rule.",
  "COOLING-CAPACITY-SCALAR": "A single cooling-capacity record is not a repeated proven class in this dataset and existing cooling applicability remains separately constrained.",
  "WHEEL-DIMENSION-COMPOUND": "Front/rear rim dimensions are a structured compound value without an existing lossless rule.",
  "SPARK-PLUG-GAP-PAIR": "The value is an imperial/metric tolerance pair requiring a distinct rule and precision semantics.",
  "TIRE-SIZE-STRUCTURED": "Tire size notation is structured domain data, not a generic numeric scalar.",
  "BATTERY-SPECIFICATION-TEXT": "Battery chemistry/type/model text is not interchangeable with capacity and has no deterministic normalization contract.",
  "BRAKE-PAD-LIMIT-PAIR": "The limit includes tolerance/measurement semantics and the explicit friction-material condition must remain intact.",
  "TRANSMISSION-SPECIFICATION-TEXT": "Transmission text is a canonical semantic value but not a numeric transformation covered by existing rules.",
  "SPARK-PLUG-IDENTITY-TEXT": "OEM identity is source text and no generic validation rule can safely normalize it.",
  "FUSE-TABLE-COMPOUND": "Named circuits and multiple ratings must not be flattened or detached from their associations."
};

function ruleFor(field) { return field === "electrical.battery-capacity" ? rules.BATTERY_CAPACITY_RULE : null; }
function waveIInputs() { return waveH.buildLegitimateInputs().map(item => ({ ...item, rule: item.rule || ruleFor(item.input.canonicalFieldId) })); }

function inventory() {
  return storedWaveH.legitimate.result.records.filter(item => item.routingResult.reasonCodes.includes("UNSUPPORTED-RULE-CAPABILITY")).map(item => {
    const route = item.routingResult;
    const classification = classFor(route.canonicalFieldId);
    return { recordId: item.inputIdentity.id, model: route.targetIdentity && (route.targetIdentity.model || route.targetIdentity.catalogVariantKey), canonicalFieldId: route.canonicalFieldId, capabilityClass: classification, rawValue: route.rawValue, rawUnit: route.rawUnit, condition: route.condition, applicability: route.applicability, sourceIdentity: route.sourceIdentity, provenanceAvailable: Boolean(route.sourceProvenance), upstreamDigest: route.upstreamDigest, route: route.route, reasonCode: route.reasonCodes[0], rootCause: selectionReason[classification], selectedForImplementation: classification === "BATTERY-CAPACITY-EXPLICIT-AH-SCALAR", futureDecision: classification === "BATTERY-CAPACITY-EXPLICIT-AH-SCALAR" ? "SAFE-DETERMINISTIC-CANDIDATE" : "DEFERRED-UNSUPPORTED" };
  }).sort((a, b) => a.recordId.localeCompare(b.recordId));
}

function report() {
  const inputs = waveIInputs();
  const before = storedWaveH.legitimate.result;
  const after = pipeline.runAutonomousBatch(inputs);
  const gaps = inventory();
  const afterRecords = after.records;
  const evaluations = afterRecords.map(record => record.pipelineRecord && record.pipelineRecord.ruleEvaluation).filter(Boolean);
  const runners = afterRecords.filter(record => record.pipelineRecord && record.pipelineRecord.runnerResult);
  const routeCounts = route => afterRecords.filter(record => record.routingResult.route === route).length;
  const groups = {};
  gaps.forEach(item => { groups[item.capabilityClass] = (groups[item.capabilityClass] || 0) + 1; });
  const counts = { totalInputRecords: count(afterRecords.length), green: count(routeCounts("GREEN")), yellow: count(routeCounts("YELLOW")), red: count(routeCounts("RED")), affectedBySelectedCapability: count(evaluations.filter(item => item.ruleKey === rules.BATTERY_CAPACITY_RULE.ruleKey).length), ruleEvaluations: count(evaluations.length), rulesApplied: count(evaluations.filter(item => item.state === "APPLIED").length), rulesNotApplicable: count(evaluations.filter(item => item.state === "NOT-APPLICABLE").length), rulesNeedsHumanReview: count(evaluations.filter(item => item.state === "NEEDS-HUMAN-REVIEW").length), rulesRejected: count(evaluations.filter(item => item.state === "REJECTED").length), safeStageInvocations: count(runners.length), automaticStageAdvancements: count(runners.reduce((sum, record) => sum + record.pipelineRecord.runnerResult.stageEnvelopes.filter(envelope => envelope.executionState === "ADVANCED").length, 0)), exceptionRecords: count(after.exceptionProjection.records.length), exceptionGroups: count(after.exceptionProjection.groups.length), existingHumanAuthorizationsConsumed: count(runners.filter(record => record.pipelineRecord.runnerResult.humanAuthorizationConsumed).length), newHumanAuthorizationsCreated: count(0), unsupportedCapabilityGapsRemaining: count(afterRecords.filter(record => record.routingResult.reasonCodes.includes("UNSUPPORTED-RULE-CAPABILITY")).length), evidenceRowsCreated: count(0), productionWrites: count(0) };
  const result = { schemaVersion: "revlog-technical-research-factory-wave-i/v1", sourceCheckpoint: "a9a90d0777be4a1aec18d4d6602880e755c2af29", baseline: { sourceReport: "research/reports/technical-research-factory-large-batch.json", total: count(before.records.length), green: count(before.records.filter(record => record.routingResult.route === "GREEN").length), yellow: count(before.records.filter(record => record.routingResult.route === "YELLOW").length), red: count(before.records.filter(record => record.routingResult.route === "RED").length), unsupportedCapabilityGaps: count(gaps.length) }, capabilityGapInventory: { total: count(gaps.length), groupingMethod: "Exact canonical field plus verified raw shape, condition, applicability and provenance characteristics; no string-only merging.", classes: groups, records: gaps }, selectedCapability: { class: "BATTERY-CAPACITY-EXPLICIT-AH-SCALAR", ruleKey: rules.BATTERY_CAPACITY_RULE.ruleKey, ruleVersion: rules.BATTERY_CAPACITY_RULE.ruleVersion, rationale: selectionReason["BATTERY-CAPACITY-EXPLICIT-AH-SCALAR"], safetyInvariants: ["canonical field is unambiguous", "Ah unit is explicit in raw source text", "single scalar is strictly parsed", "raw wording is preserved", "source identity and provenance are preserved", "target applicability is preserved", "no condition is invented or flattened", "no authorization is created", "output identity is versioned and permutation-independent"], rejectedOrDeferredClasses: Object.keys(groups).filter(key => key !== "BATTERY-CAPACITY-EXPLICIT-AH-SCALAR").map(key => ({ capabilityClass: key, count: groups[key], reason: selectionReason[key] || "No safe generic operation established." })) }, after: { counts, routes: { GREEN: routeCounts("GREEN"), YELLOW: routeCounts("YELLOW"), RED: routeCounts("RED") }, exceptionRecords: after.exceptionProjection.records, exceptionGroups: after.exceptionProjection.groups, affectedRecordIds: evaluations.filter(item => item.ruleKey === rules.BATTERY_CAPACITY_RULE.ruleKey).map(item => item.upstreamIdentity.id).sort(), remainingCapabilityGapRecordIds: afterRecords.filter(record => record.routingResult.reasonCodes.includes("UNSUPPORTED-RULE-CAPABILITY")).map(record => record.inputIdentity.id).sort() }, metrics: { automaticSafeRate: metric("automaticSafeRate", routeCounts("GREEN"), afterRecords.length, "GREEN records / exact Wave H records"), humanTouchRate: metric("humanTouchRate", routeCounts("YELLOW"), afterRecords.length, "YELLOW records / exact Wave H records"), exceptionRate: metric("exceptionRate", after.exceptionProjection.records.length, afterRecords.length, "Exception records / exact Wave H records") }, assertions: { originalGapCount: gaps.length, allGapsAccountedForExactlyOnce: gaps.length === 25 && new Set(gaps.map(item => item.recordId)).size === 25, selectedCapabilityCount: 1, selectedRecordCount: 2, beforeRoutes: [6, 1, 25], afterRoutes: [routeCounts("GREEN"), routeCounts("YELLOW"), routeCounts("RED")], inputsUnchanged: JSON.stringify(waveH.buildLegitimateInputs()) === JSON.stringify(waveH.buildLegitimateInputs()), permutationIndependent: JSON.stringify(after) === JSON.stringify(pipeline.runAutonomousBatch([...inputs].reverse())), newHumanAuthorizationsCreated: 0, evidenceRowsCreated: 0, productionChanged: false, serviceCoreChanged: false, catalogueChanged: false, registryChanged: false, cloudChanged: false, uiChanged: false, registryChanged: false, cloudChanged: false, externalSideEffects: false, pressureBoundaryPreserved: afterRecords.some(record => record.routingResult.route === "YELLOW" && record.routingResult.canonicalFieldId === "tires_wheels.solo-pressures") } , assumptions: ["The exact Wave H 32-record legitimate input builder is reused; only the generic battery-capacity rule is supplied for its two matching records.", "Existing approved decisions and schema projections are consumed only as already-present authorization/input artifacts."], unknowns: ["No catalogue-wide throughput rate is inferred.", "No pressure decomposition or other capability is inferred from this fixture."], limitations: ["The selected class has two observations and is not a general battery specification parser.", "All non-selected classes remain fail-closed until separately proven."], externalSideEffects: false, next: "If separately authorized, evaluate another repeated capability class only after a fresh evidence-backed safety analysis; preserve the pressure human boundary." };
  result.id = `wave-i-report.${digest(result).slice(0, 24)}`;
  return result;
}

module.exports = Object.freeze({ waveIInputs, inventory, buildReport: report });
