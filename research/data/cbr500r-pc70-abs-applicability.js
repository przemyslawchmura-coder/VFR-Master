// NON-PRODUCTION derived applicability verification for one CBR500R packet.
"use strict";

const crypto = require("node:crypto");
const factory = require("../factory/index.js");
const execution = require("./cbr500r-pc70-owner-manual-execution.js");
const processingReport = require("../reports/cbr500r-pc70-evidence-processing.json");

const candidateId = "extraction-candidate.87fcea8600978eff75d9f8d6";
const queueEntryId = "review-queue-entry.7b8d56af51c808e15dd558ac";
const decisionId = "review-decision.3d8c7cebfd3c3c4f34b1f163";
const processingId = "evidence-processing.87cd135fb44ebc569aebacb9";
const promotionCandidateId = "promotion-candidate.0c12373f56277561b2b692a2";

const basis = Object.freeze({
  target: Object.freeze({ catalogVariantKey: "honda.cbr500r.pc70", model: "CBR500R", generation: "PC70", modelYear: 2024, markets: ["USA", "Canada"], transmission: "manual", equipment: "standard road model" }),
  fieldId: "lubrication.oil-specification",
  source: Object.freeze({
    id: execution.source.id,
    publicationId: execution.source.publicationId,
    title: execution.source.title,
    publisher: "American Honda Motor Co., Inc.",
    tier: "A",
    url: execution.source.url,
    custody: "existing authenticated repository acquisition; no duplicate acquisition",
    observations: Object.freeze([
      Object.freeze({ locator: "PDF p. 1 / printed p. 0", finding: "The official 2024 owner manual title covers CB500F / CBR500R / NX500." }),
      Object.freeze({ locator: "PDF p. 19 / printed p. 15, Anti-lock Brake System (ABS)", finding: "The manual states: This model is equipped with an Anti-lock Brake System (ABS)." }),
      Object.freeze({ locator: "PDF p. 180 / printed p. 179, Specifications / Service Data", finding: "The CBR500R is distinguished from NX500 in the same service-data table, and the recommended engine oil entry has no ABS qualifier." }),
      Object.freeze({ locator: "PDF p. 180 / printed p. 179, Recommended engine oil", finding: "The preserved API/SAE/JASO/Honda-equivalent oil specification is presented in the common CBR500F / CBR500R / NX500 Service Data section, with USA & Canada wording." })
    ])
  }),
  lineage: Object.freeze({ candidateId, queueEntryId, decisionId, processingId, promotionCandidateId }),
  sourceApplicabilityBefore: Object.freeze({ abs: null }),
  conclusion: "Within the exact 2024 CBR500R PC70 USA/Canada manual scope, Honda documents the model as ABS-equipped; the oil specification is not restricted by an ABS qualifier. The bounded target is therefore ABS-known=true. This does not universalize the oil value to an undocumented non-ABS variant.",
  verifiedApplicability: Object.freeze({ modelYear: 2024, model: "CBR500R", generation: "PC70", market: ["USA", "Canada"], transmission: "manual", equipment: "standard road model", abs: true })
});

const idInput = { schemaVersion: "revlog-cbr500r-pc70-abs-applicability/v1", lineage: basis.lineage, target: basis.target, fieldId: basis.fieldId, source: basis.source, verifiedApplicability: basis.verifiedApplicability };
const id = `applicability-verification.${crypto.createHash("sha256").update(factory.orchestrationJson.canonicalSerialize(idInput)).digest("hex").slice(0, 24)}`;

function buildReport() {
  if (processingReport.processedRecords.length !== 1 || processingReport.processedRecords[0].id !== processingId) throw new Error("ABS applicability scope is not exactly the bounded CBR500R processing record");
  if (processingReport.processedRecords[0].candidateId !== candidateId) throw new Error("ABS applicability lineage does not match the CBR500R candidate");
  if (processingReport.applicability.abs !== null) throw new Error("Historical source applicability must remain unresolved in the upstream report");
  return Object.freeze({
    schemaVersion: "revlog-cbr500r-pc70-abs-applicability/v1",
    id,
    target: basis.target,
    fieldId: basis.fieldId,
    source: basis.source,
    lineage: basis.lineage,
    sourceApplicabilityBefore: basis.sourceApplicabilityBefore,
    verifiedApplicability: basis.verifiedApplicability,
    conclusion: basis.conclusion,
    assertions: Object.freeze({ upstreamArtifactsMutated: false, otherApplicabilityUnchanged: true, noNormalization: true, noConflictChange: true, promotionOccurred: false, productionChanged: false })
  });
}

module.exports = Object.freeze({ id, basis, buildReport });
