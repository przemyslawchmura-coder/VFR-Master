"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const pipeline = require("../research/lib/batch-research-pipeline.js");
const catalog = require("../scripts/motorcycle-catalog-report.js").loadCatalog();
const data = require("../research/data/honda-service-wave1.js");

const evidence = data.evidence.map(item => ({ ...item, canonicalFieldId: item.field }));
const target = key => catalog.flatMap(brand => brand.models.flatMap(model => model.variants)).find(variant => variant.key === key);
const targetRecord = key => ({ catalogVariantKey: key });

test("generic proof and acquisition policies are centralized", () => {
  assert.equal(pipeline.validProof("VERIFIED-DIRECT"), true);
  assert.equal(pipeline.validProof("metadata-only"), false);
  assert.equal(pipeline.validProof("SOURCE-IDENTITY-UNCERTAIN"), false);
  assert.ok(pipeline.ACQUISITION_DISPOSITIONS.includes("partial-content"));
});

test("canonical Service Core is shared and applicability remains tri-state", () => {
  assert.equal(pipeline.serviceCoreFields.length, 44);
  assert.ok(pipeline.serviceCoreFields.every(field => pipeline.canonicalFields.includes(field)));
  assert.deepEqual(pipeline.validateApplicability({ abs: false, transmission: null }).abs, false);
  assert.throws(() => pipeline.validateApplicability({ abs: "unknown" }));
});

test("transmission applicability distinguishes manual and DCT", () => {
  assert.equal(pipeline.validateApplicability({ transmission: "manual" }).transmission, "manual");
  assert.equal(pipeline.validateApplicability({ transmission: "dct" }).transmission, "dct");
  assert.throws(() => pipeline.validateApplicability({ transmission: "automatic" }), /transmission applicability/);
});

test("document registry deduplicates mirrors by publication identity", () => {
  const docs = pipeline.buildDocumentRegistry([
    { publisher: "Honda", publicationId: "61MCW01", title: "manual", url: "https://a.example/manual.pdf" },
    { publisher: "Honda", publicationId: "61MCW01", title: "mirror", url: "https://b.example/manual.pdf" }
  ]);
  assert.equal(docs.length, 1);
  assert.equal(docs[0].mirrorCount, 2);
});

test("normalization and comparison distinguish literal matches", () => {
  assert.equal(pipeline.compareValues({ normalizedValue: 3.1, normalized: false }, 3.1), "MATCH");
  assert.equal(pipeline.compareValues({ normalizedValue: 3.1, normalized: true }, 3.1), "MATCH-NORMALIZED");
  assert.equal(pipeline.normalizeValue(3100, "ml").normalizedValue, 3.1);
});

test("extraction candidates remain separate from validated evidence and conflicts are explicit", () => {
  const candidate = pipeline.validateExtractionCandidate({ documentId: "Honda|61MCW01", page: 12, candidateField: "engine.displacement", rawValue: "782 cm³" });
  assert.equal(candidate.extractionMethod, "manual");
  assert.equal(pipeline.validProof(candidate.proofStatus), false);
  const conflicts = pipeline.detectConflicts([
    { id: "a", catalogVariantKey: "x", canonicalFieldId: "engine.displacement", normalizedValue: 782, proofStatus: "VERIFIED-DIRECT", applicability: { abs: null } },
    { id: "b", catalogVariantKey: "x", canonicalFieldId: "engine.displacement", normalizedValue: 800, proofStatus: "VERIFIED-DIRECT", applicability: { abs: null } }
  ]);
  assert.equal(conflicts.length, 1);
  assert.equal(conflicts[0].status, "CONFLICT");
});

test("gap calculation ignores unverified and duplicate candidates", () => {
  const rows = pipeline.calculateGaps(targetRecord("honda.vfr800.rc46.vtec.gen1"), [
    { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", canonicalFieldId: "engine.configuration", proofStatus: "VERIFIED-DIRECT", sourceId: "source-a" },
    { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", canonicalFieldId: "engine.displacement", proofStatus: "SOURCE-IDENTITY-UNCERTAIN", sourceId: "source-b" },
    { catalogVariantKey: "honda.vfr800.rc46.vtec.gen1", canonicalFieldId: "engine.idle-speed", proofStatus: "metadata-only", sourceId: "source-c" }
  ]);
  assert.equal(rows.find(row => row.canonicalFieldId === "engine.configuration").status, "evidence-found");
  assert.equal(rows.find(row => row.canonicalFieldId === "engine.displacement").status, "not-researched");
  assert.equal(rows.find(row => row.canonicalFieldId === "engine.idle-speed").status, "not-researched");
  assert.equal(rows.length, 44);
});

test("batch target generation reproduces VFR and CBR500R fixtures", () => {
  const targets = pipeline.generateTargets(catalog, { catalogVariantKeys: ["honda.vfr800.rc46.vtec.gen1", "honda.cbr500r.pc70"] }, evidence);
  const vfr = targets.find(item => item.catalogVariantKey === "honda.vfr800.rc46.vtec.gen1");
  const cbr = targets.find(item => item.catalogVariantKey === "honda.cbr500r.pc70");
  assert.equal(vfr.evidenceCount, 13);
  assert.equal(cbr.evidenceCount, 26);
  assert.equal(vfr.gaps.filter(row => row.status !== "evidence-found").length, 31);
  const queue = pipeline.buildReviewQueue(targets);
  assert.equal(queue.length, 49);
  assert.equal(JSON.stringify(queue), JSON.stringify(pipeline.buildReviewQueue(targets)));
  const report = pipeline.buildBatchReport(targets);
  assert.equal(report.serviceCoreFieldCount, 44);
  assert.equal(report.targets.length, 2);
  assert.equal(report.deterministicHash, pipeline.buildBatchReport(targets).deterministicHash);
});
