// NON-PRODUCTION BMW owner-manual acquisition and raw extraction. No evidence promotion.
"use strict";

const factory = require("../factory/index.js");
const registration = require("./bmw-f900r-prospect-registration.js");

const target = registration.target;
const registrationReport = registration.buildReport();
const source = Object.freeze({
  id: "bmw.acquisition.f900r.owner.my20.eu",
  documentId: "BMW|F_0K11_RM_0520_76",
  tier: "A",
  sourceClass: "official-rider-manual",
  publisher: "BMW Motorrad / BMW AG",
  title: "Rider's Manual F 900 R (0K11), May 2020, 2nd edition",
  publicationId: "F_0K11_RM_0520_76.pdf",
  edition: "Slovenian EU edition, May 2020",
  publicationDate: 2020,
  url: "https://manuals.bmw-motorrad.com/manuals/BA-Extern/IN/BA-INTERNET-COM/PDF/F_0K11_RM_0520_76.pdf",
  officialHost: "manuals.bmw-motorrad.com",
  disposition: "acquired-content",
  accessResult: "BMW-controlled PDF downloaded and locally text-inspected",
  authenticationState: "OFFICIAL-BMW-MY2020-EU-F900R-0K11-CONFIRMED",
  language: "Slovenian",
  pageCount: 312,
  pdfSha256: "fdf81e96ef463f7125780fc511dbcc6f209219f03a0c7429110f030da4a8db29",
  models: ["F 900 R (0K11)"],
  years: { from: 2020, to: 2020 },
  markets: ["EU"],
  abs: true,
  transmission: "manual",
  equipment: "base F 900 R 0K11; F 900 R A2 0K31 excluded",
  targets: [target.catalogVariantKey],
  yieldedEvidence: false,
  applicabilityProof: Object.freeze({ exactSource: "official filename and title identify F 900 R 0K11 May 2020", targetYear: "MY2020", market: "EU edition", baseScope: "F 900 R 0K11 only; A2 0K31 and F 900 XR excluded", abs: "ABS is explicitly defined in the manual and retained as target applicability", transmission: "manual six-speed transmission", preExtractionCheckPassed: true }),
  stopCondition: "raw extraction stops before human review, evidence processing and production promotion"
});

const applicability = Object.freeze({ model: "F 900 R", modelCode: "0K11", generation: "I", year: 2020, market: "EU", equipment: "standard road model", excludedEquipment: ["F 900 R A2 (0K31)", "F 900 XR"], transmission: "manual", abs: true });
const context = Object.freeze({ sourceDocument: source.documentId, modelCode: "0K11", modelYear: "2020", market: "EU", scope: "base F 900 R standard road model", exclusions: ["F 900 R A2 (0K31)", "F 900 XR"] });

// This is the deterministic local materialization of inspected excerpts from the acquired PDF.
const CONTENT = [
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 221|printed page 215|F 900 R (0K11)|MOTORNO OLJE|Količina polnjenja motornega olja|pribl. 3,0 l, z menjavo filtra|Specifikacija|SAE 5W-40, API SL / JASO MA2",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 171|printed page 165|F 900 R (0K11)|ZAVORNA TEKOČINA|Zavorna tekočina spredaj|Zavorna tekočina, DOT4",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 172|printed page 166|F 900 R (0K11)|ZAVORNA TEKOČINA|Zavorna tekočina zadaj|Zavorna tekočina, DOT4",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 174|printed page 168|F 900 R (0K11)|PNEVMATIKE|Tlak v sprednjih pnevmatikah|2,5 bar, pri hladni pnevmatiki",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 175|printed page 169|F 900 R (0K11)|PNEVMATIKE|Tlak v zadnjih pnevmatikah|2,9 bar, pri hladni pnevmatiki",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 221|printed page 215|F 900 R (0K11)|MOTOR F 900 R (0K11)|Motor|Tip motorja A24A09A",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 224|printed page 218|F 900 R (0K11)|POGON ZADNJEGA KOLESA|Poves verige|35...45 mm, Motorno kolo neobremenjeno na stranskem stojalu",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 188|printed page 182|F 900 R (0K11)|VERIGA|Mazanje verige|Namažite ob vsakem 3. postanku na bencinski črpalki",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 187|printed page 181|F 900 R (0K11)|VERIGA|Dovoljena dolžina verige|maks. 144 mm, izmerjeno prek sredine 10 zakovic",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 227|printed page 221|F 900 R (0K11)|ELEKTRIČNI SISTEM|Glavna varovalka|40 A, Regulator napetosti",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 227|printed page 221|F 900 R (0K11)|ELEKTRIČNI SISTEM|Omarica za varovalke|10 A, Reža 1; 7,5 A, Reža 2",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 228|printed page 222|F 900 R (0K11)|ELEKTRIČNI SISTEM|Akumulator|Akumulator AGM; nazivna napetost akumulatorja 12 V; nazivna kapaciteta akumulatorja 12 Ah",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 228|printed page 222|F 900 R (0K11)|VŽIGALNE SVEČKE|Proizvajalec in oznaka vžigalnih svečk|NGK LMAR9J-9E",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 221|printed page 215|F 900 R (0K11)|MOTORNO OLJE|Dodatki za olje|Aditivi ... niso dovoljeni",
  "BMW|F_0K11_RM_0520_76.pdf|PDF page 237|printed page 231|F 900 R (0K11)|NAČRT VZDRŽEVANJA|servisni interval|a letno ali vsakih 10.000 km (kar pride prej); b prvič po enem letu, nato vsaki dve leti"
].join("\n");

const rawDefinitions = Object.freeze([
  ["lubrication.oil-specification", "SAE 5W-40, API SL / JASO MA2", null, 221, "Motorno olje", "printed page 215"],
  ["brakes.brake-fluid", "Zavorna tekočina, DOT4", "DOT4", 171, "Zavorna tekočina spredaj", "printed page 165"],
  ["brakes.brake-fluid", "Zavorna tekočina, DOT4", "DOT4", 172, "Zavorna tekočina zadaj", "printed page 166"],
  ["tires_wheels.solo-pressures", "2,5", "bar", 174, "Pnevmatike — tlak spredaj", "printed page 168"],
  ["tires_wheels.solo-pressures", "2,9", "bar", 175, "Pnevmatike — tlak zadaj", "printed page 169"],
  ["final_drive.chain-slack", "35...45", "mm", 224, "Pogon zadnjega kolesa", "printed page 218"],
  ["final_drive.chain-lubrication-interval", "Namažite ob vsakem 3. postanku na bencinski črpalki", null, 188, "Veriga — mazanje verige", "printed page 182"],
  ["final_drive.chain-inspection", "maks. 144", "mm", 187, "Veriga — dovoljena dolžina verige", "printed page 181"],
  ["electrical.main-fuse", "40", "A", 227, "Električni sistem", "printed page 221"],
  ["electrical.battery-specification", "Akumulator AGM", null, 228, "Električni sistem", "printed page 222"],
  ["electrical.battery-capacity", "12", "Ah", 228, "Električni sistem", "printed page 222"],
  ["ignition.spark-plug-oem", "NGK LMAR9J-9E", null, 228, "Vžigalne svečke", "printed page 222"],
  ["maintenance.periodic-schedule", "a letno ali vsakih 10.000 km (kar pride prej); b prvič po enem letu, nato vsaki dve leti", null, 237, "Načrt vzdrževanja", "printed page 231"]
]);

const acquisitionAdapter = Object.freeze({ adapterId: "bmw.official-pdf.local-acquisition", adapterVersion: "1", supportedOperations: ["acquire-authenticated-source"], supportedSourceClasses: ["official-rider-manual"], authenticationRequired: false, networkRequired: false, execute(request) {
  factory.validateAcquisitionRequest(request);
  const contentDigest = factory.sha256(CONTENT);
  const artifact = { prospectId: request.prospectId, attemptId: request.attemptId, mediaType: "text/plain", byteLength: Buffer.byteLength(CONTENT, "utf8"), contentDigest, originClassification: "LOCAL-MATERIALIZED-OFFICIAL-PDF-TEXT", acquisitionMethod: "BMW-controlled PDF download and text-layer inspection", locator: source.url, metadata: { sourceId: source.id, documentId: source.documentId, officialPdfSha256: source.pdfSha256 } };
  artifact.id = factory.artifactId({ prospectId: artifact.prospectId, attemptId: artifact.attemptId, mediaType: artifact.mediaType, contentDigest: artifact.contentDigest, locator: artifact.locator });
  return factory.validateOutcome({ schemaVersion: 1, outcome: "ACQUIRED", retryClass: "NON-RETRYABLE", reasonCode: "OFFICIAL_BMW_PDF_ACQUIRED", observations: [{ type: "DOCUMENT-ACQUIRED", detailCode: "BMW_MY2020_EU_F900R_0K11" }, { type: "CANDIDATE-CONTENT-PRESENT", detailCode: "BMW_INSPECTED_EXCERPTS_MATERIALIZED" }], artifact });
} });

const extractionAdapter = Object.freeze({ schemaVersion: 1, adapterId: "bmw.official-pdf-text-extractor", adapterVersion: "1", supportedMediaTypes: ["text/plain"], supportedOperations: [factory.EXTRACTION_OPERATION], deterministic: true, localOnly: true, execute() {
  return { disposition: "CANDIDATES-PRODUCED", candidates: rawDefinitions.map(([fieldId, rawValue, rawUnit, page, section], index) => ({ fieldId, rawValue, rawUnit, sourceLocation: { page, section, locator: `${source.publicationId}#pdf-page-${page}` }, extractionMethod: "BMW-controlled PDF text-layer inspection", applicability, context, ordinal: index + 1 })), observations: [{ type: "CANDIDATE-EXTRACTED", detailCode: "BMW_DIRECT_TEXT_CANDIDATES", metadata: { documentId: source.documentId, candidateCount: rawDefinitions.length } }] };
} });

function runAcquisition() {
  const validatedTarget = factory.validateResearchTarget(target);
  const batchPurpose = "bmw-f900r-my20-eu-owner-manual-acquisition";
  const policyId = "bmw-f900r-bounded-acquisition-v1";
  const batchId = factory.ids.batchId({ purpose: batchPurpose, targetIds: [validatedTarget.id], policyId, maxAttemptsPerWorkItem: 1 });
  const targetWorkId = factory.ids.targetWorkId({ batchId, targetId: validatedTarget.id });
  const sourceWorkItemId = factory.ids.sourceWorkId({ targetWorkId, prospectId: registrationReport.prospect.id, operation: "acquire-authenticated-source" });
  const batch = { schemaVersion: 1, foundationContractVersion: 1, id: batchId, purpose: batchPurpose, policyId, targetIds: [validatedTarget.id], maxAttemptsPerWorkItem: 1 };
  const plan = { batch, targetWorks: [{ schemaVersion: 1, batchId, id: targetWorkId, targetId: validatedTarget.id, required: true }], sourceWorkItems: [{ schemaVersion: 1, id: sourceWorkItemId, targetWorkId, prospectId: registrationReport.prospect.id, operation: "acquire-authenticated-source", maxAttempts: 1, readiness: registrationReport.readiness }] };
  const events = factory.bootstrap(plan);
  const executed = factory.executeAttempt(events, plan.sourceWorkItems[0], acquisitionAdapter);
  const envelope = factory.validateArtifactContentEnvelope({ schemaVersion: 1, artifactId: executed.result.outcome.artifact.id, mediaType: "text/plain", byteLength: Buffer.byteLength(CONTENT, "utf8"), contentDigest: factory.sha256(CONTENT), contentEncoding: "utf8", content: CONTENT });
  const extracted = factory.extractRawCandidates({ executionResult: executed.result, events: executed.events, researchTarget: validatedTarget, contentEnvelope: envelope, adapter: extractionAdapter });
  const queue = factory.buildReviewQueue([extracted]);
  return Object.freeze({ schemaVersion: "revlog-bmw-f900r-owner-manual-acquisition/v1", researchDate: "2026-09-03", target, reusedProspectId: registrationReport.startingProspectId, source, preExtractionIdentityCheck: source.applicabilityProof, execution: executed.result, extraction: extracted, reviewQueue: queue, rawCandidates: extracted.candidates, reviewQueueEntries: queue.entries, metrics: Object.freeze({ rawCandidates: extracted.candidates.length, queuedCandidates: queue.entries.length, ambiguousCandidates: 0, conflictingCandidates: 0, evidenceRowsCreated: 0, serviceCoreBefore: 0, serviceCoreAfter: 0 }), technicalValuesInspected: true, serviceCoreCoverageChanged: false, productionChanged: false, evidenceRowsCreated: 0, researchedNoEvidenceCreated: 0, humanReviewDecisionsCreated: 0, evidenceProcessingRecordsCreated: 0, runtimeChanged: false, catalogueChanged: false, audit: Object.freeze({ classification: "ACCEPT-WITH-RISKS", conclusion: "The exact authenticated BMW MY2020 EU F 900 R 0K11 rider manual was acquired and locally text-inspected through the Factory execution and extraction contracts. Directly attributable raw candidates were queued with source locations and explicit applicability; processing stops before human review and evidence.", risks: Object.freeze(["the official manual is a Slovenian EU edition", "the manual contains separate A2 material, which was excluded", "raw candidates remain pre-evidence and unreviewed"]), falsification: Object.freeze(["no F 900 XR or A2 values were used", "no units or values were normalized", "no conflicts were resolved", "no downstream review/evidence/production stage was invoked"]) }), exactNextTask: "Perform bounded human review of only the queued BMW F 900 R MY2020 EU 0K11 raw candidates; preserve raw values and provenance and create no evidence automatically." });
}

module.exports = Object.freeze({ target, source, runAcquisition });
