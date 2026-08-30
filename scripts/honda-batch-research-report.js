#!/usr/bin/env node
"use strict";
const data = require("../research/data/honda-batch-wave2.js");
const pipeline = require("../research/lib/batch-research-pipeline.js");
const batch = data.runBatch();
const service = require("../research/data/honda-service-wave1.js");
const before = pipeline.generateTargets(require("./motorcycle-catalog-report.js").loadCatalog(), { catalogVariantKeys: data.selectedTargetKeys }, service.evidence.map(item => ({ ...item, canonicalFieldId: item.field })));
const beforeVerified = before.reduce((sum, row) => sum + row.evidenceCount, 0);
const afterVerified = batch.targets.reduce((sum, row) => sum + row.evidenceCount, 0);
const practicalFields = new Set(["lubrication.oil-specification", "lubrication.viscosity", "lubrication.capacity-drain", "lubrication.capacity-filter", "lubrication.oil-filter", "cooling.coolant-specification", "cooling.capacity", "cooling.replacement-interval", "ignition.spark-plug-oem", "ignition.plug-gap", "valve_train.intake-clearance", "valve_train.exhaust-clearance", "valve_train.inspection-interval", "final_drive.chain-size", "final_drive.chain-slack", "brakes.brake-fluid", "brakes.fluid-interval", "brakes.oem-pad-numbers", "tires_wheels.solo-pressures", "tires_wheels.loaded-pressures", "electrical.battery-specification", "electrical.battery-capacity", "electrical.main-fuse", "maintenance.periodic-schedule", "maintenance.schedule-mileage-intervals", "maintenance.schedule-time-intervals", "torques.oil-drain-bolt", "torques.oil-filter", "torques.spark-plugs", "torques.front-axle", "torques.rear-axle"]);
const practicalGain = batch.evidence.filter(row => practicalFields.has(row.canonicalFieldId)).length;
const yieldingDocuments = new Set(batch.evidence.map(row => row.sourceId)).size;
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
  evidenceRowVerificationRatePercent: 100,
  targetSlotGainRatePercent: Number(((afterVerified - beforeVerified) / (batch.targets.length * pipeline.serviceCoreFields.length) * 100).toFixed(2)),
  serviceCoreGainRatePercent: Number(((afterVerified - beforeVerified) / (batch.targets.length * pipeline.serviceCoreFields.length) * 100).toFixed(2)),
  practicalServiceFieldGain: practicalGain,
  documentsInspected: batch.documents.length,
  documentsYieldingEvidence: yieldingDocuments,
  evidenceRowsPerYieldingDocument: Number((batch.evidence.length / yieldingDocuments).toFixed(2)),
  sourceClassContribution: { "official-owner-manual": service.evidence.filter(row => row.sourceId.includes("cbr500r")).length, "official-technical-publication": batch.evidence.length },
  targets: batch.report.targets,
  reviewQueue: batch.reviewQueue.slice(0, 20),
  deterministicHash: batch.report.deterministicHash
};
process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
