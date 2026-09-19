// NON-PRODUCTION deterministic read-only catalogue-to-queue projection.
"use strict";

const catalogReport = require("../../scripts/motorcycle-catalog-report.js");
const registry = require("../../data/technical/technical-profile-registry.js");
const matrix = require("../../js/technical/technical-profile-core-matrix.js");
const presentation = require("../../js/technical/technical-profile-presentation.js");
const service = require("./honda-service-wave1.js");
const wave2 = require("./honda-batch-wave2.js");
const pilot = require("./high-value-source-acquisition-pilot-results.js");
const sourceReadiness = require("./source-prospect-authentication-quality-reassessment.js");
const factory = require("../factory/catalogue-coverage-queue-contracts.js");

function productionProfiles() {
  return registry.map(descriptor => {
    const profile = require(`../../${descriptor.moduleId}`);
    const coreFieldIds = matrix.fieldIds.filter(fieldId => presentation.matrixEntryMatches(profile.entries, fieldId).some(entry => presentation.isRiderServiceCoreEntry(entry)));
    return { descriptor, coreFieldIds };
  });
}

function researchCoverage() {
  const evidence = pilot.evidence.map(item => ({ ...item, canonicalFieldId: item.canonicalFieldId || item.field }));
  const byKey = new Map();
  evidence.forEach(item => { const current = byKey.get(item.catalogVariantKey) || { evidenceFields: [], researchedNoEvidenceFields: [] }; current.evidenceFields.push(item.canonicalFieldId); byKey.set(item.catalogVariantKey, current); });
  pilot.researchedNoEvidence.forEach(item => { const current = byKey.get(item.catalogVariantKey) || { evidenceFields: [], researchedNoEvidenceFields: [] }; current.researchedNoEvidenceFields.push("existing-source-outcome"); byKey.set(item.catalogVariantKey, current); });
  return [...byKey.entries()].map(([catalogVariantKey, value]) => ({ catalogVariantKey, evidenceFields: value.evidenceFields, researchedNoEvidenceFields: value.researchedNoEvidenceFields }));
}

function buildReport() {
  return factory.projectCatalogueCoverageQueue({ catalogue: catalogReport.loadCatalog(), coreFieldIds: matrix.fieldIds, productionProfiles: productionProfiles(), researchCoverage: researchCoverage(), sourceProspects: sourceReadiness.prospects });
}

module.exports = Object.freeze({ buildReport });
