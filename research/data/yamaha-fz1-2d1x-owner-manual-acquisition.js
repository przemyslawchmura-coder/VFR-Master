// NON-PRODUCTION deterministic acquisition record for the authenticated Yamaha 2D1X route.
// The manual bytes are not stored here; this wave does not inspect or extract technical content.
"use strict";

const factory = require("../factory/index.js");
const authentication = require("./yamaha-fz1-source-authentication.js");

const target = authentication.target;
const prospect = authentication.prospects.find(item => item.publication.identifiers.some(identifier => identifier.value === "2D1X"));
const requestedLocation = "https://www2.yamaha-motor.co.jp/Manual/pdf/mc/20102D1X.pdf";
const finalLocation = requestedLocation;
const contentDigest = "bbaa777d8d0184f231573fdf6116d73b7770930d4bdf19b1f0d7386d6b7e2a93";
const response = Object.freeze({
  httpStatus: 200,
  contentType: "application/pdf",
  byteLength: 5098486,
  signature: "%PDF-1.3",
  requestedLocation,
  finalLocation,
  contentDigest
});

const batchSetup = (() => {
  const batch = factory.createResearchBatch({
    purpose: "FZ1 2D1X owner manual source acquisition",
    policyId: "bounded-fz1-2d1x-acquisition-v1",
    targets: [target],
    maxAttemptsPerWorkItem: 1
  });
  const targetWork = factory.createTargetWork(batch.batch, target);
  const sourceWorkItem = factory.createSourceWorkItem({
    batch: batch.batch,
    targetWork,
    target,
    prospect,
    operation: "attempt-existing-source",
    maxAttempts: 1
  });
  return Object.freeze({ batch: batch.batch, targetWork, sourceWorkItem });
})();

function buildArtifact(attemptId = "attempt.000000000000000000000000") {
  const identity = {
    prospectId: prospect.id,
    attemptId,
    mediaType: response.contentType,
    contentDigest,
    locator: finalLocation
  };
  return factory.validateArtifact({
    id: factory.artifactId(identity),
    prospectId: prospect.id,
    attemptId,
    mediaType: response.contentType,
    byteLength: response.byteLength,
    contentDigest,
    originClassification: "OFFICIAL-YAMAHA-DIRECT",
    acquisitionMethod: "OFFICIAL-HTTP-GET-RECORDED",
    locator: finalLocation,
    metadata: { httpStatus: response.httpStatus, signature: response.signature, requestedLocation }
  });
}

function buildOutcome(attemptId = "attempt.000000000000000000000000") {
  return factory.validateOutcome({
    schemaVersion: factory.EXECUTION_SCHEMA_VERSION,
    outcome: "ACQUIRED",
    retryClass: "NON-RETRYABLE",
    reasonCode: "OFFICIAL_PDF_ACQUIRED",
    observations: [{
      type: "DOCUMENT-ACQUIRED",
      detailCode: "OFFICIAL_YAMAHA_PDF_RESPONSE",
      metadata: { httpStatus: response.httpStatus, contentType: response.contentType, signature: response.signature, requestedLocation, finalLocation }
    }],
    artifact: buildArtifact(attemptId)
  });
}

function classifyResponse(candidate) {
  if (!candidate || candidate.httpStatus !== 200 || candidate.contentType !== "application/pdf" || !/^%PDF-/.test(candidate.signature || "") || !Number.isInteger(candidate.byteLength) || candidate.byteLength <= 0) return "REJECTED-UNEXPECTED-DOCUMENT";
  return "PLAUSIBLE-PDF";
}

function buildReport() {
  const outcome = buildOutcome();
  return Object.freeze({
    schemaVersion: "revlog-yamaha-fz1-2d1x-owner-manual-acquisition/v1",
    date: "2026-09-08",
    targetResearchIdentity: "yamaha.fz1.gen2",
    targetId: target.id,
    selectedProspectId: prospect.id,
    excludedProspectIds: ["prospect.yamaha.fz1.service.2d1-28197-e0"],
    publicationIdentity: { title: "FZ1-N / FZ1-NA Owner's Manual", modelCode: "2D1X", documentClass: "owner manual" },
    requestedLocation,
    finalLocation,
    acquisition: { result: "ACQUIRED", responseClass: classifyResponse(response), outcome, adapterId: "official.yamaha.manual-download-record", adapterVersion: "1" },
    provenance: { classification: "OFFICIAL-YAMAHA-DIRECT", authority: "Yamaha Motor Co., Ltd.", route: "www2.yamaha-motor.co.jp official owner-manual route" },
    applicabilityBefore: { model: ["FZ1-N", "FZ1-NA"], generation: ["II"], year: 2010, bodyStyle: ["naked"], market: "UNKNOWN", abs: "UNKNOWN", transmission: "UNKNOWN", equipment: "UNKNOWN", emissions: "UNKNOWN" },
    applicabilityAfter: { model: ["FZ1-N", "FZ1-NA"], generation: ["II"], year: 2010, bodyStyle: ["naked"], market: "UNKNOWN", abs: "UNKNOWN", transmission: "UNKNOWN", equipment: "UNKNOWN", emissions: "UNKNOWN" },
    contentInspected: false,
    technicalValuesExtracted: false,
    rawCandidatesCreated: 0,
    reviewQueueEntriesCreated: 0,
    evidenceRowsAdded: 0,
    serviceCoreCoverageChanged: false,
    productionChanged: false,
    acquisitionOnly: true,
    twoD1ServiceLead: { id: "prospect.yamaha.fz1.service.2d1-28197-e0", touched: false, state: "PARTIAL-AUTHENTICATION-LEAD" },
    sourceBytesStoredInRepository: false,
    next: "Plan one bounded FZ1 2D1X extraction-planning wave; do not extract values until extraction boundaries are explicit."
  });
}

module.exports = Object.freeze({ target, prospect, requestedLocation, finalLocation, response, batchSetup, buildArtifact, buildOutcome, classifyResponse, buildReport });
