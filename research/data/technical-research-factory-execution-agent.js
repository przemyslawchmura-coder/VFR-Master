// NON-PRODUCTION deterministic report for the Execution Agent boundary.
"use strict";
const factory = require("../factory/index.js");

function buildReport() {
  const retry = { "ACQUIRED": "NON-RETRYABLE", "NO-EVIDENCE": "NON-RETRYABLE", "ACCESS-BLOCKED": "BLOCKED", "AUTH-REQUIRED": "BLOCKED", "NOT-FOUND": "NON-RETRYABLE", "SOURCE-MISMATCH": "NON-RETRYABLE", "APPLICABILITY-UNKNOWN": "BLOCKED", "APPLICABILITY-PARTIAL": "BLOCKED", "TRANSIENT-FAILURE": "RETRYABLE", "PERMANENT-FAILURE": "NON-RETRYABLE" };
  const outcomes = factory.OUTCOMES.map(outcome => ({ outcome, retryClass: retry[outcome] }));
  const fixture = require("./technical-research-factory-execution-planner.js").buildReport();
  return Object.freeze({ schemaVersion: "revlog-technical-research-factory-execution-agent/v1", executionSchemaVersion: factory.EXECUTION_SCHEMA_VERSION, orchestratorSchemaVersion: factory.ORCHESTRATOR_SCHEMA_VERSION, adapterSchemaVersion: factory.acquisitionAdapters.ADAPTER_SCHEMA_VERSION, adapterInterface: { request: "AcquisitionRequest", outcome: "AcquisitionOutcome", result: "ExecutionResult", events: ["attempt-started", "attempt-completed", "attempt-failed", "attempt-blocked", "attempt-exhausted"] }, syntheticAdapters: Object.keys(factory.acquisitionAdapters.syntheticAdapters).sort(), outcomes, fixtureResults: fixture.fixtureResults, evidenceSafety: { acquiredIsNotVerifiedEvidence: true, noEvidenceIsNotResearchedNoEvidence: true, productionMutation: false }, authentication: { credentialsPersisted: false, tenereAuthenticationExecuted: false }, serviceCoreFieldCount: 44, audit: { classification: "ACCEPT-WITH-RISKS", risks: ["adapter output is untrusted and validated, but future production adapters require separate security review", "artifact content is represented by metadata only; extraction/review is deferred", "retry policy remains single-process and bounded"] }, externalResearchPerformed: false, evidenceAdded: false, researchedNoEvidenceAdded: false, productionChanged: false });
}
module.exports = Object.freeze({ buildReport });
