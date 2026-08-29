(function attachTechnicalProfileQualityReport(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfileQualityReport = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createQualityReport() {
  "use strict";

  function buildQualityReport(profile, validationReport = null) {
    const entries = Array.isArray(profile && profile.entries) ? profile.entries : [];
    const citations = profile && profile.citations && typeof profile.citations === "object"
      ? Object.keys(profile.citations)
      : [];
    const documents = profile && profile.documents && typeof profile.documents === "object"
      ? Object.keys(profile.documents)
      : [];
    const entryIds = new Set(entries.map(entry => entry.id));
    const citationIds = new Set(citations);
    const categoryIds = new Set(
      (Array.isArray(profile && profile.categories) ? profile.categories : [])
        .map(category => category.id)
    );
    const byStatus = countBy(entries, entry => entry.status || "missing");
    const variants = entries.flatMap(entry => Array.isArray(entry.variants) ? entry.variants : []);

    return {
      profileId: profile && profile.profile ? profile.profile.id : null,
      totalEntries: entries.length,
      verified: byStatus.verified || 0,
      pendingVerification: byStatus["pending-verification"] || 0,
      conflictingSources: byStatus["conflicting-sources"] || 0,
      legacyUnverified: byStatus["legacy-unverified"] || 0,
      entriesWithoutSourceIds: entries.filter(
        entry => !Array.isArray(entry.sourceIds) || entry.sourceIds.length === 0
      ).length,
      citationsCount: citations.length,
      documentsCount: documents.length,
      entriesByCategory: countBy(entries, entry => entry.categoryId || "missing"),
      entriesByType: countBy(entries, entry => entry.type || "missing"),
      variantsCount: variants.length,
      regionalVariantsCount: variants.filter(
        variant => variant.when && Array.isArray(variant.when.regions)
      ).length,
      unresolvedReferences: {
        sourceIds: entries.flatMap(entry => (entry.sourceIds || [])
          .filter(id => !citationIds.has(id))
          .map(id => ({ entryId: entry.id, sourceId: id }))),
        relatedEntryIds: entries.flatMap(entry => (entry.relatedEntryIds || [])
          .filter(id => !entryIds.has(id))
          .map(id => ({ entryId: entry.id, relatedEntryId: id }))),
        categoryIds: entries.filter(entry => !categoryIds.has(entry.categoryId))
          .map(entry => ({ entryId: entry.id, categoryId: entry.categoryId }))
      },
      validation: validationReport ? {
        valid: validationReport.valid,
        errors: validationReport.errors.length,
        warnings: validationReport.warnings.length
      } : null
    };
  }

  function countBy(values, selector) {
    return values.reduce((result, value) => {
      const key = selector(value);
      result[key] = (result[key] || 0) + 1;
      return result;
    }, {});
  }

  return Object.freeze({ buildQualityReport });
});
