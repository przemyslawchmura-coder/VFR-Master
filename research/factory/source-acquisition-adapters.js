// NON-PRODUCTION local deterministic source acquisition adapters.
"use strict";

const contracts = require("./execution-contracts.js");
const json = require("./json.js");

const ADAPTER_SCHEMA_VERSION = 1;
const fixtures = Object.freeze({
  acquired: { outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_ARTIFACT_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "LOCAL_FIXTURE_DOCUMENT" }], artifact: { mediaType: "text/plain", byteLength: 18, contentDigest: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", originClassification: "LOCAL-SYNTHETIC", acquisitionMethod: "FIXTURE", locator: "fixture://acquired", metadata: {} } },
  noEvidence: { outcome: "NO-EVIDENCE", retryClass: "NON-RETRYABLE", reasonCode: "NO_USABLE_EVIDENCE_IN_DECLARED_SCOPE", observations: [{ type: "CONTENT-UNAVAILABLE", detailCode: "NO_EVIDENCE" }], artifact: null },
  blocked: { outcome: "ACCESS-BLOCKED", retryClass: "BLOCKED", reasonCode: "ACCESS_POLICY_BLOCKED", observations: [{ type: "CONTENT-UNAVAILABLE", detailCode: "ACCESS_BLOCKED" }], artifact: null },
  auth: { outcome: "AUTH-REQUIRED", retryClass: "BLOCKED", reasonCode: "AUTHENTICATION_REQUIRED", observations: [{ type: "LOGIN-WALL", detailCode: "AUTH_REQUIRED" }], artifact: null },
  notFound: { outcome: "NOT-FOUND", retryClass: "NON-RETRYABLE", reasonCode: "SOURCE_NOT_FOUND", observations: [{ type: "CONTENT-UNAVAILABLE", detailCode: "NOT_FOUND" }], artifact: null },
  mismatch: { outcome: "SOURCE-MISMATCH", retryClass: "NON-RETRYABLE", reasonCode: "SOURCE_IDENTITY_MISMATCH", observations: [{ type: "SOURCE-IDENTITY-MISMATCH", detailCode: "MISMATCH" }], artifact: null },
  unknown: { outcome: "APPLICABILITY-UNKNOWN", retryClass: "BLOCKED", reasonCode: "APPLICABILITY_UNKNOWN", observations: [{ type: "DOCUMENT-APPLICABILITY-UNRESOLVED", detailCode: "UNKNOWN" }], artifact: null },
  partial: { outcome: "APPLICABILITY-PARTIAL", retryClass: "BLOCKED", reasonCode: "APPLICABILITY_PARTIAL", observations: [{ type: "DOCUMENT-APPLICABILITY-UNRESOLVED", detailCode: "PARTIAL" }], artifact: null },
  transient: { outcome: "TRANSIENT-FAILURE", retryClass: "RETRYABLE", reasonCode: "LOCAL_TRANSIENT_FAILURE", observations: [], artifact: null },
  permanent: { outcome: "PERMANENT-FAILURE", retryClass: "NON-RETRYABLE", reasonCode: "LOCAL_PERMANENT_FAILURE", observations: [], artifact: null }
});

function createSyntheticAdapter(fixtureName) {
  if (!Object.prototype.hasOwnProperty.call(fixtures, fixtureName)) throw new TypeError(`unknown synthetic fixture: ${fixtureName}`);
  return Object.freeze({ adapterId: `synthetic.${fixtureName}`, adapterVersion: "1", supportedOperations: Object.freeze(["attempt-existing-source"]), supportedSourceClasses: Object.freeze(["*"]), authenticationRequired: fixtureName === "auth", networkRequired: false, execute(request) {
    contracts.validateAcquisitionRequest(request);
    const template = fixtures[fixtureName];
    const outcome = { schemaVersion: contracts.EXECUTION_SCHEMA_VERSION, ...template, observations: template.observations.map(json.immutableClone), artifact: template.artifact ? { ...template.artifact, prospectId: request.prospectId, attemptId: request.attemptId, id: contracts.artifactId({ prospectId: request.prospectId, attemptId: request.attemptId, mediaType: template.artifact.mediaType, contentDigest: template.artifact.contentDigest, locator: template.artifact.locator }) } : null };
    return contracts.validateOutcome(outcome);
  } });
}
const syntheticAdapters = Object.freeze(Object.fromEntries(Object.keys(fixtures).map(name => [name, createSyntheticAdapter(name)])));
module.exports = Object.freeze({ ADAPTER_SCHEMA_VERSION, syntheticAdapters, createSyntheticAdapter });
