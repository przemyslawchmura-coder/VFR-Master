// NON-PRODUCTION deterministic Wave F analysis over the stored Wave E result.
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const json = require("../factory/json.js");

const reportPath = path.join(__dirname, "../reports/technical-research-factory-automatic-pipeline.json");
const digest = value => crypto.createHash("sha256").update(json.canonicalSerialize(value)).digest("hex");
const count = (value, reason = "") => ({ value, measurementState: value === null ? "NOT-MEASURED" : "MEASURED", reason });

const classifications = Object.freeze({
  compoundPressure: {
    rootCause: "GENUINE-HUMAN-SEMANTIC-BOUNDARY",
    recordSet: "LEGITIMATE-RESEARCH-RECORD",
    automationPotential: "UNSUPPORTED-BUT-POTENTIALLY-DETERMINISTIC",
    explanation: "The source supplies front and rear pressures under a solo/cold-tire context. The current pressure rule intentionally accepts only one scalar pair and cannot prove a lossless front/rear decomposition without a structured representation contract."
  },
  notApplicable: {
    rootCause: "APPLICABILITY-BOUNDARY",
    recordSet: "FIXTURE-ONLY-BOUNDARY-CASE",
    automationPotential: "HUMAN-BOUNDARY-MUST-REMAIN",
    explanation: "The fixture explicitly sets ruleApplicable=false. The rule correctly stops without interpreting or overriding that applicability decision."
  },
  missingRaw: {
    rootCause: "SYNTHETIC-NEGATIVE-TEST-CASE",
    recordSet: "FIXTURE-ONLY-NEGATIVE-TEST",
    automationPotential: "UPSTREAM-DATA-REPAIR-FIRST",
    explanation: "The fixture replaces an existing source-backed raw capacity with null. The stored packet has a source value, so this is not evidence of missing upstream research."
  },
  unsupportedUnit: {
    rootCause: "SYNTHETIC-NEGATIVE-TEST-CASE",
    recordSet: "FIXTURE-ONLY-NEGATIVE-TEST",
    automationPotential: "FIXTURE-ONLY-NO-PRODUCTION-RELEVANCE",
    explanation: "The fixture replaces the source-backed torque representation with 61 kN-m. The current rule must not infer whether that is a typo, conversion or source meaning."
  },
  duplicate: {
    rootCause: "DUPLICATE-INPUT-HYGIENE",
    recordSet: "FIXTURE-ONLY-NEGATIVE-TEST",
    automationPotential: "UPSTREAM-DATA-REPAIR-FIRST",
    explanation: "The fixture intentionally supplies the same semantic input twice. Both occurrences remain visible and are rejected without merging provenance or choosing a winner."
  }
});

function classificationFor(record) {
  const evaluation = record.ruleEvaluation;
  if (evaluation.reasonCode === "AMBIGUOUS-COMPOUND-VALUE") return classifications.compoundPressure;
  if (evaluation.reasonCode === "RULE-NOT-APPLICABLE") return classifications.notApplicable;
  if (evaluation.reasonCode === "RAW-VALUE-MISSING") return classifications.missingRaw;
  if (evaluation.reasonCode === "DUPLICATE-SEMANTIC-INPUT") return classifications.duplicate;
  if (evaluation.reasonCode === "UNSUPPORTED-UNIT") return classifications.unsupportedUnit;
  throw new Error(`No Wave F classification for ${evaluation.reasonCode}`);
}

function exceptionEntry(record, occurrence) {
  const evaluation = record.ruleEvaluation;
  const route = record.routingResult;
  const classification = classificationFor(record);
  const identity = { pipelineRecordId: record.id, inputIdentity: record.inputIdentity, upstreamIdentity: evaluation.upstreamIdentity, upstreamDigest: evaluation.upstreamDigest };
  return {
    analysisId: `exception-analysis.${digest({ identity, occurrence }).slice(0, 24)}`,
    occurrence,
    identity,
    canonicalFieldId: evaluation.canonicalFieldId,
    route: route.route,
    currentStage: route.currentStage,
    evaluationState: evaluation.state,
    ruleId: evaluation.ruleId,
    ruleKey: evaluation.ruleKey,
    ruleVersion: evaluation.ruleVersion,
    ruleReasonCode: evaluation.reasonCode,
    routingReasonCodes: route.reasonCodes,
    failedInvariants: evaluation.invariants.failed,
    routingFailedInvariants: route.invariants.failed,
    rawValue: evaluation.rawValue,
    rawUnit: evaluation.rawUnit,
    condition: evaluation.condition,
    applicability: evaluation.applicability,
    sourceIdentity: evaluation.sourceIdentity,
    provenance: evaluation.provenance,
    provenanceAvailable: Boolean(evaluation.provenance && evaluation.provenance.sourceLocation),
    duplicate: { isDuplicate: record.duplicateCount > 1, count: record.duplicateCount },
    nextLegalAction: route.nextLegalAction,
    rootCause: classification.rootCause,
    recordSet: classification.recordSet,
    automationPotential: classification.automationPotential,
    explanation: classification.explanation
  };
}

function buildReport() {
  const waveE = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  const records = waveE.result.records.filter(record => record.routingResult.route !== "GREEN");
  const occurrences = new Map();
  const exceptions = records.map(record => {
    const key = json.canonicalSerialize({ recordId: record.id, upstreamDigest: record.ruleEvaluation.upstreamDigest, route: record.routingResult.route });
    const occurrence = (occurrences.get(key) || 0) + 1;
    occurrences.set(key, occurrence);
    return exceptionEntry(record, occurrence);
  }).sort((a, b) => a.analysisId.localeCompare(b.analysisId));
  const legitimate = waveE.result.records.filter(record => record.routingResult.route === "GREEN" || classificationFor(record).recordSet === "LEGITIMATE-RESEARCH-RECORD");
  const legitimateGreen = legitimate.filter(record => record.routingResult.route === "GREEN").length;
  const legitimateHuman = legitimate.filter(record => record.routingResult.route === "YELLOW").length;
  const synthetic = waveE.result.records.length - legitimate.length;
  const sourceIdentity = { report: "research/reports/technical-research-factory-automatic-pipeline.json", schemaVersion: waveE.schemaVersion, pipelineId: waveE.result.id, reportDigest: digest(waveE) };
  return {
    schemaVersion: "revlog-technical-research-factory-exception-analysis/v1",
    sourceWaveE: sourceIdentity,
    exactWaveE: {
      inputCount: count(waveE.inputCount),
      green: count(waveE.assertions.greenCount),
      yellow: count(waveE.assertions.yellowCount),
      red: count(waveE.assertions.redCount),
      exceptionRecords: count(waveE.result.exceptionProjection.records.length),
      exceptionGroups: count(waveE.result.exceptionProjection.groups.length),
      automaticSafeRate: { numerator: 3, denominator: 9, value: 3 / 9, measurementState: "MEASURED", scope: "exact Wave E fixture" },
      humanTouchRate: { numerator: 2, denominator: 9, value: 2 / 9, measurementState: "MEASURED", scope: "exact Wave E fixture" },
      exceptionRate: { numerator: 6, denominator: 9, value: 6 / 9, measurementState: "MEASURED", scope: "exact Wave E fixture" }
    },
    exceptions,
    legitimateRecordAnalysis: {
      denominator: count(legitimate.length, "Three GREEN records plus one real compound pressure record; five fixture-only variants excluded."),
      automaticSafe: count(legitimateGreen),
      genuineHumanBoundary: count(legitimateHuman),
      deterministicAutomationCandidates: count(0, "No exception satisfies the strict safe-candidate criteria without a new lossless pressure representation contract."),
      upstreamRepairFirst: count(0),
      fixtureOnlyNegativeRecordsExcluded: count(synthetic),
      automaticSafeRate: { numerator: legitimateGreen, denominator: legitimate.length, value: legitimateGreen / legitimate.length, measurementState: "MEASURED", scope: "inspected legitimate subset only" },
      humanTouchRate: { numerator: legitimateHuman, denominator: legitimate.length, value: legitimateHuman / legitimate.length, measurementState: "MEASURED", scope: "inspected legitimate subset only" },
      comparability: "BOUNDED-INSPECTED-SUBSET-ONLY"
    },
    deterministicCounterfactual: {
      state: "MEASURED",
      safeDeterministicCandidates: 0,
      legitimateRecordsThatCouldTraverseWithoutNewHumanAction: 3,
      denominator: 4,
      value: 3 / 4,
      interpretation: "No newly safe deterministic capability is demonstrated by Wave F; the one legitimate exception remains a human boundary until a separately authorized lossless pressure representation is designed and tested."
    },
    assumptions: [
      "The stored Wave E report and its exact fixture construction are authoritative.",
      "A missing raw value, unsupported unit, explicit ruleApplicable=false override and duplicate pair are fixture constructions, not claims about the upstream BMW records.",
      "The compound pressure record is treated as legitimate because its raw value, source identity, provenance, applicability and condition come from the existing BMW research chain."
    ],
    unknowns: [
      "No future pressure decomposition contract exists in this wave.",
      "No catalogue-wide or historical throughput percentage is inferred.",
      "No source-reuse or research-duplication denominator is available from Wave E."
    ],
    nonGoals: ["No rule changes", "No routing or pipeline changes", "No exception resolution", "No evidence or production materialization"],
    externalSideEffects: false,
    next: "Preserve the human pressure boundary; if separately authorized, perform an upstream-input hygiene and duplicate-handling design/audit wave before considering any rule extension."
  };
}

module.exports = Object.freeze({ buildReport });
