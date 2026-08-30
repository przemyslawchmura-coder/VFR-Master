#!/usr/bin/env node
"use strict";
const data = require("../research/data/honda-batch-wave2.js");
const pipeline = require("../research/lib/batch-research-pipeline.js");
const batch = data.runBatch();
const service = require("../research/data/honda-service-wave1.js");
const before = pipeline.generateTargets(require("./motorcycle-catalog-report.js").loadCatalog(), { catalogVariantKeys: data.selectedTargetKeys }, service.evidence.map(item => ({ ...item, canonicalFieldId: item.field })));
const beforeVerified = before.reduce((sum, row) => sum + row.evidenceCount, 0);
const afterVerified = batch.targets.reduce((sum, row) => sum + row.evidenceCount, 0);
const summary = {
  targetCount: batch.targets.length,
  documents: batch.documents.length,
  hostingLocations: batch.documents.reduce((sum, doc) => sum + doc.locations.length, 0),
  reusedDocuments: batch.documents.filter(doc => doc.mirrorCount > 1).length,
  documentsSupportingMultipleTargets: batch.documents.filter(doc => batch.evidence.filter(row => row.sourceId === doc.documentId).map(row => row.catalogVariantKey).filter((key, index, keys) => keys.indexOf(key) === index).length > 1).length,
  evidenceRowsProduced: batch.evidence.length,
  uniqueVerifiedSlots: new Set(batch.evidence.map(row => `${row.catalogVariantKey}|${row.canonicalFieldId}`)).size,
  targetFieldSlots: batch.targets.length * pipeline.serviceCoreFields.length,
  verifiedSlotsBefore: beforeVerified,
  verifiedSlotsAfter: afterVerified,
  netNewVerifiedSlots: afterVerified - beforeVerified,
  verificationYieldPercent: Math.round((afterVerified - beforeVerified) / batch.evidence.length * 100),
  sourceClassContribution: { "official-owner-manual": service.evidence.filter(row => row.sourceId.includes("cbr500r")).length, "official-technical-publication": batch.evidence.length },
  targets: batch.report.targets,
  reviewQueue: batch.reviewQueue.slice(0, 20),
  deterministicHash: batch.report.deterministicHash
};
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
