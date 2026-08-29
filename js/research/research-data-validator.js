(function attachResearchDataValidator(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogResearchDataValidator = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createResearchDataValidator() {
  "use strict";

  const STATUSES = Object.freeze(["discovered", "source-located", "candidate", "corroborated", "conflicting", "rejected", "ready-for-profile-review"]);
  const SOURCE_TYPES = Object.freeze([
    "official-service-manual", "official-owner-manual", "official-parts-catalogue",
    "official-technical-publication", "aftermarket-manufacturer", "specialist-database",
    "workshop-reference", "community"
  ]);
  const KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*(?:\.[a-z0-9]+(?:-[a-z0-9]+)*)+$/;

  function validateResearchDataset(dataset) {
    const errors = [];
    const warnings = [];
    if (!plain(dataset)) return report([{ code: "INVALID_DATASET", path: "", message: "Research dataset must be a plain object." }], warnings);
    if (dataset.schemaVersion !== "revlog-research-data/v1") error(errors, "INVALID_SCHEMA_VERSION", "schemaVersion", "Expected revlog-research-data/v1.");
    const sources = array(dataset.sources);
    const catalog = array(dataset.catalog);
    const candidates = array(dataset.candidates);
    checkUnique(sources, "id", "sources", "DUPLICATE_SOURCE_ID", errors);
    checkUnique(catalog, "researchRecordId", "catalog", "DUPLICATE_RESEARCH_RECORD_ID", errors);
    checkUnique(candidates, "researchRecordId", "candidates", "DUPLICATE_RESEARCH_RECORD_ID", errors);
    const allIds = new Map();
    [...catalog, ...candidates].forEach((item, index) => {
      const id = item && item.researchRecordId;
      if (id && allIds.has(id)) error(errors, "DUPLICATE_RESEARCH_RECORD_ID", `${index < catalog.length ? "catalog" : "candidates"}[${index}].researchRecordId`, `Duplicate researchRecordId: ${id}`);
      if (id) allIds.set(id, true);
    });
    const sourceIds = new Set(sources.map(source => source && source.id).filter(Boolean));
    const catalogKeys = new Set(catalog.map(record => record && record.proposedCatalogVariantKey).filter(Boolean));
    sources.forEach((source, index) => validateSource(source, index, errors));
    catalog.forEach((record, index) => validateCatalog(record, index, sourceIds, errors));
    candidates.forEach((record, index) => validateCandidate(record, index, sourceIds, catalogKeys, errors));
    checkUnique(catalog, "proposedCatalogVariantKey", "catalog", "DUPLICATE_PROPOSED_CATALOG_KEY", errors);
    checkCatalogOverlap(catalog, errors);
    checkCandidateDuplicates(candidates, warnings);
    checkConflictGroups(candidates, errors);
    return report(errors, warnings);
  }

  function buildResearchQualityGate(dataset) {
    const validation = validateResearchDataset(dataset);
    const count = code => validation.errors.filter(issue => issue.code === code).length;
    return {
      passed: validation.valid,
      structuralErrors: validation.errors.length,
      warnings: validation.warnings.length,
      catalogRecordsWithoutSources: count("MISSING_SOURCE_REFS"),
      candidatesWithoutSources: count("MISSING_SOURCE_REFS"),
      brokenSourceReferences: count("UNKNOWN_SOURCE_ID"),
      invalidUrls: count("INVALID_SOURCE_URL"),
      duplicateIds: count("DUPLICATE_SOURCE_ID") + count("DUPLICATE_RESEARCH_RECORD_ID"),
      duplicateProposedKeys: count("DUPLICATE_PROPOSED_CATALOG_KEY"),
      invalidYearRanges: count("INVALID_YEAR_RANGE") + count("INVALID_YEAR") + count("IMPOSSIBLE_YEAR"),
      candidatesWithUnknownCatalogKey: count("UNKNOWN_CATALOG_KEY"),
      incompleteConflicts: count("INCOMPLETE_CONFLICT_GROUP")
    };
  }

  function validateSource(source, index, errors) {
    const path = `sources[${index}]`;
    if (!plain(source) || !stableId(source.id)) error(errors, "INVALID_SOURCE_ID", `${path}.id`, "A stable source ID is required.");
    if (!SOURCE_TYPES.includes(source.type)) error(errors, "UNKNOWN_SOURCE_TYPE", `${path}.type`, `Unknown research source type: ${source && source.type}`);
    if (!text(source.title)) error(errors, "MISSING_SOURCE_TITLE", `${path}.title`, "Source title is required.");
    if (source.url != null && !validUrl(source.url)) error(errors, "INVALID_SOURCE_URL", `${path}.url`, "Source URL must use http or https.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source && source.accessedAt || "")) error(errors, "INVALID_ACCESSED_AT", `${path}.accessedAt`, "accessedAt must use YYYY-MM-DD.");
  }

  function validateCatalog(record, index, sourceIds, errors) {
    const path = `catalog[${index}]`;
    if (!plain(record) || !stableId(record.researchRecordId)) error(errors, "INVALID_RESEARCH_RECORD_ID", `${path}.researchRecordId`, "A stable researchRecordId is required.");
    if (!text(record && record.manufacturer)) error(errors, "MISSING_MANUFACTURER", `${path}.manufacturer`, "Manufacturer is required.");
    if (!text(record && record.family)) error(errors, "MISSING_MODEL_FAMILY", `${path}.family`, "Model family is required.");
    if (!KEY_PATTERN.test(record && record.proposedCatalogVariantKey || "")) error(errors, "INVALID_PROPOSED_CATALOG_KEY", `${path}.proposedCatalogVariantKey`, "Proposed catalog key is not normalized.");
    validateYears(record && record.years, `${path}.years`, errors);
    validateStatus(record && record.status, `${path}.status`, errors);
    validateSourceRefs(record && record.sourceIds, path, sourceIds, errors);
  }

  function validateCandidate(record, index, sourceIds, catalogKeys, errors) {
    const path = `candidates[${index}]`;
    if (!plain(record) || !stableId(record.researchRecordId)) error(errors, "INVALID_RESEARCH_RECORD_ID", `${path}.researchRecordId`, "A stable researchRecordId is required.");
    if (!text(record && record.manufacturer)) error(errors, "MISSING_MANUFACTURER", `${path}.manufacturer`, "Manufacturer is required.");
    if (!text(record && record.family)) error(errors, "MISSING_MODEL_FAMILY", `${path}.family`, "Model family is required.");
    if (!text(record && record.technicalField)) error(errors, "MISSING_TECHNICAL_FIELD", `${path}.technicalField`, "technicalField is required.");
    validateYears(record && record.years, `${path}.years`, errors);
    validateStatus(record && record.status, `${path}.status`, errors);
    validateSourceRefs(record && record.sourceIds, path, sourceIds, errors);
    if (!catalogKeys.has(record && record.proposedCatalogVariantKey)) error(errors, "UNKNOWN_CATALOG_KEY", `${path}.proposedCatalogVariantKey`, `Candidate refers to an unknown catalog key: ${record && record.proposedCatalogVariantKey}`);
    const normalized = record && record.normalizedCandidateValue;
    const numericRange = normalized && typeof normalized === "object" && typeof normalized.min === "number" && typeof normalized.max === "number";
    if ((typeof normalized === "number" || numericRange) && !text(record.unit)) error(errors, "MISSING_NORMALIZED_UNIT", `${path}.unit`, "A numeric normalized candidate requires a unit.");
    if (record && record.region !== null && !text(record.region)) error(errors, "INVALID_APPLICABILITY", `${path}.region`, "region must be a non-empty string or null.");
    if (record && record.abs !== null && typeof record.abs !== "boolean") error(errors, "INVALID_APPLICABILITY", `${path}.abs`, "abs must be boolean or null.");
    if (record && record.equipment !== null && !Array.isArray(record.equipment)) error(errors, "INVALID_APPLICABILITY", `${path}.equipment`, "equipment must be an array or null.");
    if (record && record.status === "conflicting" && !text(record.conflictGroup)) error(errors, "MISSING_CONFLICT_GROUP", `${path}.conflictGroup`, "Conflicting candidates require conflictGroup.");
  }

  function validateYears(years, path, errors) {
    if (years == null) return;
    if (!plain(years)) return error(errors, "INVALID_YEAR_RANGE", path, "years must be an object or null.");
    const from = years.from;
    const to = years.to;
    if (from != null && !Number.isInteger(from)) error(errors, "INVALID_YEAR", `${path}.from`, "Year must be an integer or null.");
    if (to != null && !Number.isInteger(to)) error(errors, "INVALID_YEAR", `${path}.to`, "Year must be an integer or null.");
    const latestReasonableYear = new Date().getFullYear() + 2;
    if (Number.isInteger(from) && (from < 1885 || from > latestReasonableYear)) error(errors, "IMPOSSIBLE_YEAR", `${path}.from`, "Year is outside the supported motorcycle research range.");
    if (Number.isInteger(to) && (to < 1885 || to > latestReasonableYear)) error(errors, "IMPOSSIBLE_YEAR", `${path}.to`, "Year is outside the supported motorcycle research range.");
    if (Number.isInteger(from) && Number.isInteger(to) && from > to) error(errors, "INVALID_YEAR_RANGE", path, "Year from cannot exceed year to.");
  }
  function validateStatus(status, path, errors) { if (!STATUSES.includes(status)) error(errors, "UNKNOWN_RESEARCH_STATUS", path, `Unknown research status: ${status}`); }
  function validateSourceRefs(ids, path, sourceIds, errors) {
    if (!Array.isArray(ids)) return error(errors, "INVALID_SOURCE_REFS", `${path}.sourceIds`, "sourceIds must be an array.");
    if (ids.length === 0) error(errors, "MISSING_SOURCE_REFS", `${path}.sourceIds`, "At least one research source is required.");
    ids.forEach((id, index) => { if (!sourceIds.has(id)) error(errors, "UNKNOWN_SOURCE_ID", `${path}.sourceIds[${index}]`, `Unknown research source: ${id}`); });
  }
  function checkUnique(items, field, prefix, code, errors) {
    const seen = new Set();
    items.forEach((item, index) => { const value = item && item[field]; if (value && seen.has(value)) error(errors, code, `${prefix}[${index}].${field}`, `Duplicate ${field}: ${value}`); seen.add(value); });
  }
  function checkCatalogOverlap(catalog, errors) {
    for (let left = 0; left < catalog.length; left += 1) for (let right = left + 1; right < catalog.length; right += 1) {
      const a = catalog[left]; const b = catalog[right];
      if (a.proposedCatalogVariantKey === b.proposedCatalogVariantKey && overlaps(a.years, b.years)) error(errors, "OVERLAPPING_CATALOG_VARIANTS", `catalog[${right}]`, `Overlapping records for ${a.proposedCatalogVariantKey}.`);
    }
  }
  function checkCandidateDuplicates(candidates, warnings) {
    const seen = new Set();
    candidates.forEach((record, index) => {
      const key = [record.proposedCatalogVariantKey, record.technicalField, JSON.stringify(record.rawValue), JSON.stringify(record.years), record.region].join("|");
      if (seen.has(key)) warnings.push({ code: "DUPLICATE_CANDIDATE", path: `candidates[${index}]`, message: "Possible duplicate technical candidate; no automatic deletion was performed." });
      seen.add(key);
    });
  }
  function checkConflictGroups(candidates, errors) {
    const groups = new Map();
    candidates.filter(item => item.status === "conflicting").forEach(item => groups.set(item.conflictGroup, (groups.get(item.conflictGroup) || 0) + 1));
    groups.forEach((count, group) => { if (count < 2) error(errors, "INCOMPLETE_CONFLICT_GROUP", "candidates", `Conflict group ${group} must preserve at least two candidates.`); });
  }
  function overlaps(a, b) { const af = a && a.from != null ? a.from : -Infinity; const at = a && a.to != null ? a.to : Infinity; const bf = b && b.from != null ? b.from : -Infinity; const bt = b && b.to != null ? b.to : Infinity; return af <= bt && bf <= at; }
  function validUrl(value) { try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:"; } catch (error) { return false; } }
  function stableId(value) { return typeof value === "string" && /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(value); }
  function text(value) { return typeof value === "string" && value.trim().length > 0; }
  function plain(value) { return value !== null && typeof value === "object" && !Array.isArray(value) && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null); }
  function array(value) { return Array.isArray(value) ? value : []; }
  function error(errors, code, path, message) { errors.push({ code, path, message }); }
  function report(errors, warnings) { return { valid: errors.length === 0, errors, warnings }; }

  return Object.freeze({ validateResearchDataset, buildResearchQualityGate, RESEARCH_STATUSES: STATUSES, RESEARCH_SOURCE_TYPES: SOURCE_TYPES });
});
