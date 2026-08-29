"use strict";

function buildResearchMetrics(dataset) {
  const sourceById = new Map(dataset.sources.map(source => [source.id, source]));
  const manufacturers = [...new Set(dataset.catalog.map(record => record.manufacturer))].sort();
  const byManufacturer = Object.fromEntries(manufacturers.map(manufacturer => {
    const catalog = dataset.catalog.filter(record => record.manufacturer === manufacturer);
    const candidates = dataset.candidates.filter(record => record.manufacturer === manufacturer);
    const sources = dataset.sources.filter(source => source.manufacturer === manufacturer);
    return [manufacturer, {
      sources: sources.length,
      modelFamilies: new Set(catalog.map(record => record.family)).size,
      catalogRecords: catalog.length,
      knownModelCodes: catalog.filter(record => record.modelCode).length,
      proposedKeys: new Set(catalog.map(record => record.proposedCatalogVariantKey)).size,
      yearFrom: catalog.length ? Math.min(...catalog.map(record => record.years.from)) : null,
      yearTo: catalog.length ? Math.max(...catalog.map(record => record.years.to ?? record.years.from)) : null,
      technicalCandidates: candidates.length,
      officialSourceCandidates: candidates.filter(candidate => candidate.sourceIds.some(id => String((sourceById.get(id) || {}).type).startsWith("official-"))).length,
      candidatesWithSection: candidates.filter(candidate => candidate.sourceSection).length,
      candidatesWithPage: candidates.filter(candidate => candidate.sourcePage).length,
      normalizedCandidates: candidates.filter(candidate => candidate.normalizedCandidateValue !== null && candidate.normalizedCandidateValue !== undefined).length,
      unknownApplicabilityCandidates: candidates.filter(candidate => candidate.region === null || candidate.abs === null || candidate.equipment === null).length,
      conflicts: candidates.filter(candidate => candidate.status === "conflicting").length,
      readyForProfileReview: catalog.filter(record => record.status === "ready-for-profile-review").map(record => record.proposedCatalogVariantKey).sort(),
      candidatesByCategory: countBy(candidates, candidate => candidate.technicalField.split(".")[0]),
      sourcesByType: countBy(sources, source => source.type)
    }];
  }));
  return {
    schemaVersion: dataset.schemaVersion,
    totals: {
      sources: dataset.sources.length,
      manufacturers: manufacturers.length,
      modelFamilies: new Set(dataset.catalog.map(record => `${record.manufacturer}|${record.family}`)).size,
      catalogRecords: dataset.catalog.length,
      technicalCandidates: dataset.candidates.length,
      conflicts: dataset.candidates.filter(candidate => candidate.status === "conflicting").length
    },
    byManufacturer
  };
}

function countBy(values, selector) {
  return Object.fromEntries([...values.reduce((map, value) => map.set(selector(value), (map.get(selector(value)) || 0) + 1), new Map())].sort(([left], [right]) => left.localeCompare(right)));
}

module.exports = Object.freeze({ buildResearchMetrics });
