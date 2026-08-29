(function attachTechnicalProfileSearch(root, factory) {
  let resolverApi = root && root.RevLogTechnicalProfileResolver;
  let formatterApi = root && root.RevLogTechnicalValueFormatter;
  let synonymsApi = root && root.RevLogTechnicalSearchSynonyms;

  if (typeof module === "object" && module.exports) {
    resolverApi = resolverApi || require("./technical-profile-resolver.js");
    formatterApi = formatterApi || require("./technical-value-formatter.js");
    synonymsApi = synonymsApi || require("./technical-search-synonyms.js");
  }

  const api = factory(resolverApi, formatterApi, synonymsApi);

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.RevLogTechnicalProfileSearch = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createSearch(
  resolverApi,
  formatterApi,
  synonymsApi
) {
  "use strict";

  const INDEX_SCHEMA_VERSION = "revlog-technical-search-index/v1";
  const MIN_QUERY_LENGTH = 2;
  let normalizedSynonymCache = null;

  const SCORE = Object.freeze({
    exactLabel: 180,
    exactAlias: 170,
    exactPartNumber: 165,
    exactIdentifier: 160,
    labelStarts: 145,
    aliasStarts: 135,
    labelContains: 125,
    labelTokens: 120,
    tag: 110,
    category: 95,
    structuredValue: 90,
    remainingText: 65
  });

  const unitAliases = Object.freeze({
    nm: "N·m",
    v: "V",
    a: "A",
    w: "W",
    kw: "kW",
    ah: "Ah",
    cca: "CCA",
    hz: "Hz",
    ohm: "Ω",
    kohm: "kΩ",
    kpa: "kPa",
    bar: "bar",
    psi: "psi",
    c: "°C",
    "°c": "°C",
    l: "L",
    ml: "mL",
    mm: "mm",
    cm: "cm",
    m: "m",
    km: "km",
    rpm: "rpm",
    "km/h": "km/h"
  });

  function buildSearchIndex(profile, context = {}, options = {}) {
    if (!resolverApi || !formatterApi) {
      throw new Error("Technical Profile resolver and formatter are required.");
    }

    const profileResolution = resolverApi.resolveProfileApplicability(
      profile,
      context
    );
    const normalizedContext = cloneData(profileResolution.context);
    const categories = new Map(
      (Array.isArray(profile.categories) ? profile.categories : [])
        .map(category => [category.id, category])
    );
    const items = [];
    const excludedEntries = [];

    if (profileResolution.status === "profile-applicable") {
      (Array.isArray(profile.entries) ? profile.entries : []).forEach(rawEntry => {
        const resolution = resolverApi.resolveEntry(rawEntry, normalizedContext);

        if (resolution.status === "not-applicable") {
          excludedEntries.push({
            entryId: rawEntry.id,
            resolutionStatus: resolution.status,
            trace: cloneData(resolution.trace)
          });
          return;
        }

        const category = categories.get(rawEntry.categoryId) || null;
        items.push(buildIndexItem(rawEntry, resolution, category, options));
      });
    }

    return {
      schemaVersion: INDEX_SCHEMA_VERSION,
      profileId: profile && profile.profile ? profile.profile.id : null,
      profileRevision: profile && profile.profile
        ? profile.profile.revision
        : null,
      context: normalizedContext,
      profileResolution: cloneData(profileResolution),
      items,
      excludedEntries
    };
  }

  function buildIndexItem(rawEntry, resolution, category, options) {
    const resolved = resolution.status === "resolved";
    const entry = resolved ? resolution.entry : rawEntry;
    const categoryLabel = category && category.label ? category.label : "";
    const safeMetadata = {
      id: rawEntry.id,
      type: rawEntry.type,
      categoryId: rawEntry.categoryId,
      label: rawEntry.label || "",
      aliases: stringArray(rawEntry.aliases),
      tags: stringArray(rawEntry.tags),
      description: rawEntry.description || ""
    };

    const rawValue = resolved && entry.value ? cloneData(entry.value) : null;
    const formattedValue = rawValue
      ? safeFormatValue(rawValue, options.locale || "pl-PL")
      : null;
    const partNumbers = resolved ? collectPartNumbers(entry) : [];
    const structuredValues = resolved ? collectStructuredValues(entry) : [];
    const remainingText = resolved ? collectAllowedText(entry) : [];

    const fields = {
      label: normalizeSearchText(safeMetadata.label),
      aliases: safeMetadata.aliases.map(normalizeSearchText),
      tags: safeMetadata.tags.map(normalizeSearchText),
      category: normalizeSearchText(categoryLabel),
      identifiers: [normalizeSearchText(safeMetadata.id)],
      partNumbers: partNumbers.flatMap(item => [
        item.normalized,
        item.manufacturer
          ? normalizePartNumber(`${item.manufacturer} ${item.partNumber}`)
          : null
      ]).filter(Boolean),
      structuredValues: structuredValues.map(item => item.normalized),
      remainingText: remainingText
        .concat(formattedValue || "")
        .map(normalizeSearchText)
        .filter(Boolean)
    };

    return {
      entryId: safeMetadata.id,
      entryType: safeMetadata.type,
      categoryId: safeMetadata.categoryId,
      categoryLabel,
      label: safeMetadata.label,
      formattedValue,
      rawValue,
      status: entry.status || rawEntry.status || null,
      resolutionStatus: resolution.status,
      sourceIds: cloneData(entry.sourceIds || rawEntry.sourceIds || []),
      selectedVariantId: resolution.selectedVariantId || null,
      requiredContext: cloneData(resolution.requiredContext || []),
      candidates: cloneData(resolution.candidates || {}),
      resolutionTrace: cloneData(resolution.trace),
      partNumbers: partNumbers.map(item => ({
        kind: item.kind,
        manufacturer: item.manufacturer,
        partNumber: item.partNumber
      })),
      structuredValues: structuredValues.map(item => cloneData(item.value)),
      fields
    };
  }

  function search(index, query, options = {}) {
    if (!index || !Array.isArray(index.items)) return [];

    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return [];

    const shortIdentifierOnly = normalizedQuery.length < MIN_QUERY_LENGTH;
    const queryAlternatives = expandQuery(normalizedQuery);
    const numericQuery = parseNumericUnitQuery(query);
    const typeFilter = Array.isArray(options.entryTypes)
      ? new Set(options.entryTypes)
      : null;

    const results = [];

    index.items.forEach(item => {
      if (options.categoryId && item.categoryId !== options.categoryId) return;
      if (typeFilter && !typeFilter.has(item.entryType)) return;

      const match = scoreItem(
        item,
        queryAlternatives,
        numericQuery,
        shortIdentifierOnly
      );
      if (!match || match.score <= 0) return;

      results.push({
        entryId: item.entryId,
        entryType: item.entryType,
        categoryId: item.categoryId,
        categoryLabel: item.categoryLabel,
        label: item.label,
        formattedValue: item.formattedValue,
        rawValue: cloneData(item.rawValue),
        status: item.status,
        resolutionStatus: item.resolutionStatus,
        sourceIds: cloneData(item.sourceIds),
        selectedVariantId: item.selectedVariantId,
        requiredContext: cloneData(item.requiredContext),
        candidates: cloneData(item.candidates),
        partNumbers: cloneData(item.partNumbers),
        structuredValues: cloneData(item.structuredValues),
        score: match.score,
        matchedFields: match.matchedFields,
        reasons: match.reasons,
        searchTokens: queryAlternatives.map(alternative => alternative.text)
      });
    });

    return results.sort((a, b) =>
      b.score - a.score ||
      normalizeSearchText(a.label).localeCompare(
        normalizeSearchText(b.label),
        "pl"
      ) ||
      a.entryId.localeCompare(b.entryId)
    );
  }

  function scoreItem(item, alternatives, numericQuery, shortIdentifierOnly) {
    const matches = [];

    alternatives.forEach(alternative => {
      const query = alternative.text;
      const penalty = alternative.synonym ? 4 : 0;

      addExactMatch(matches, item.fields.identifiers, query, {
        score: SCORE.exactIdentifier - penalty,
        field: "entryId",
        reason: `exact identifier: ${query}`
      });
      addExactMatch(matches, item.fields.partNumbers, normalizePartNumber(query), {
        score: SCORE.exactPartNumber - penalty,
        field: "partNumbers",
        reason: `exact part number: ${query}`
      });

      if (shortIdentifierOnly) return;

      addTextMatch(matches, item.fields.label, query, "label", penalty, {
        exact: SCORE.exactLabel,
        starts: SCORE.labelStarts,
        contains: SCORE.labelContains,
        tokens: SCORE.labelTokens
      });
      item.fields.aliases.forEach(value => {
        addTextMatch(matches, value, query, "aliases", penalty, {
          exact: SCORE.exactAlias,
          starts: SCORE.aliasStarts,
          contains: SCORE.labelContains - 5,
          tokens: SCORE.labelTokens - 5
        });
      });
      addArrayContainsMatch(
        matches,
        item.fields.tags,
        query,
        SCORE.tag - penalty,
        "tags"
      );
      addTextMatch(matches, item.fields.category, query, "category", penalty, {
        exact: SCORE.category,
        starts: SCORE.category - 5,
        contains: SCORE.category - 10,
        tokens: SCORE.category - 12
      });
      addArrayContainsMatch(
        matches,
        item.fields.structuredValues,
        query,
        SCORE.structuredValue - penalty,
        "structuredValue"
      );
      addArrayContainsMatch(
        matches,
        item.fields.remainingText,
        query,
        SCORE.remainingText - penalty,
        "text"
      );
    });

    if (!shortIdentifierOnly && numericQuery) {
      const numericMatch = item.structuredValues.some(value =>
        structuredValueMatches(value, numericQuery)
      );
      if (numericMatch) {
        matches.push({
          score: SCORE.structuredValue + 35,
          field: "structuredValue",
          reason: `numeric value: ${numericQuery.amount} ${numericQuery.unit}`
        });
      }
    }

    if (!matches.length) return null;

    const topScore = Math.max(...matches.map(match => match.score));
    const matchedFields = [...new Set(matches.map(match => match.field))];
    const reasons = [...new Set(matches.map(match => match.reason))];

    return {
      score: topScore,
      matchedFields,
      reasons
    };
  }

  function addTextMatch(matches, value, query, field, penalty, scores) {
    if (!value || !query) return;

    if (value === query) {
      matches.push({ score: scores.exact - penalty, field, reason: `exact ${field}` });
    } else if (value.startsWith(query)) {
      matches.push({ score: scores.starts - penalty, field, reason: `${field} starts with query` });
    } else if (value.includes(query)) {
      matches.push({ score: scores.contains - penalty, field, reason: `${field} contains query` });
    } else if (allTokensPresent(value, query)) {
      matches.push({ score: scores.tokens - penalty, field, reason: `${field} contains all tokens` });
    }
  }

  function addExactMatch(matches, values, query, definition) {
    if (query && values.includes(query)) matches.push(definition);
  }

  function addArrayContainsMatch(matches, values, query, score, field) {
    if (values.some(value =>
      value === query || value.includes(query) || allTokensPresent(value, query)
    )) {
      matches.push({ score, field, reason: `${field} match` });
    }
  }

  function allTokensPresent(value, query) {
    const tokens = query.split(" ").filter(Boolean);
    return tokens.length > 1 && tokens.every(token => value.includes(token));
  }

  function expandQuery(normalizedQuery) {
    const results = [{ text: normalizedQuery, synonym: false }];
    const normalizedSynonyms = getNormalizedSynonyms();
    const direct = normalizedSynonyms.get(normalizedQuery) || [];
    direct.forEach(text => results.push({ text, synonym: true }));

    normalizedQuery.split(" ").forEach(token => {
      (normalizedSynonyms.get(token) || []).forEach(text => {
        results.push({ text, synonym: true });
      });
    });

    const seen = new Set();
    return results.filter(item => {
      if (!item.text || seen.has(item.text)) return false;
      seen.add(item.text);
      return true;
    });
  }

  function getNormalizedSynonyms() {
    if (normalizedSynonymCache) return normalizedSynonymCache;

    const result = new Map();
    const entries = synonymsApi && typeof synonymsApi.entries === "function"
      ? synonymsApi.entries()
      : [];

    entries.forEach(([term, replacements]) => {
      result.set(
        normalizeSearchText(term),
        replacements.map(normalizeSearchText).filter(Boolean)
      );
    });
    normalizedSynonymCache = result;
    return normalizedSynonymCache;
  }

  function normalizeSearchText(value) {
    return String(value ?? "")
      .toLocaleLowerCase("pl-PL")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ł/g, "l")
      .replace(/n\s*[·•.]?\s*m\b/g, "nm")
      .replace(/k\s*(?:ohm|ω)\b/g, "kohm")
      .replace(/(?:ohm|ω)\b/g, "ohm")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizePartNumber(value) {
    return String(value ?? "")
      .trim()
      .toLocaleUpperCase("en-US")
      .replace(/\s+/g, " ");
  }

  function parseNumericUnitQuery(query) {
    const normalized = normalizeSearchText(query).replace(",", ".");
    const match = normalized.match(
      /^(-?\d+(?:\.\d+)?)\s*(nm|v|a|w|kw|ah|cca|hz|ohm|kohm|kpa|bar|psi|°?c|l|ml|mm|cm|m|km|rpm|km\/h)$/
    );
    if (!match) return null;

    const unit = unitAliases[match[2]];
    const amount = Number(match[1]);
    if (!unit || !Number.isFinite(amount)) return null;

    return { amount, unit };
  }

  function structuredValueMatches(value, numericQuery) {
    if (!value || value.unit !== numericQuery.unit) return false;
    if (value.type === "quantity") {
      return nearlyEqual(value.amount, numericQuery.amount);
    }
    if (value.type === "range") {
      return nearlyEqual(value.min, numericQuery.amount) ||
        nearlyEqual(value.max, numericQuery.amount);
    }
    if (value.type === "quantity-with-tolerance") {
      return nearlyEqual(value.nominal, numericQuery.amount);
    }
    return false;
  }

  function nearlyEqual(a, b) {
    return typeof a === "number" && Math.abs(a - b) < 1e-9;
  }

  function collectStructuredValues(entry) {
    const results = [];

    walkAllowedData(entry, (value, key) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) return;
      if (!["quantity", "range", "quantity-with-tolerance"].includes(value.type)) {
        return;
      }

      const formatted = safeFormatValue(value, "pl-PL");
      const debug = safeFormatValue(value, null, false);
      results.push({
        value: cloneData(value),
        normalized: normalizeSearchText(`${formatted || ""} ${debug || ""}`)
      });
    });

    return deduplicateBy(results, item => JSON.stringify(item.value));
  }

  function collectPartNumbers(entry) {
    const results = [];

    if (entry.oem && entry.oem.partNumber) {
      results.push({
        kind: "oem",
        manufacturer: entry.oem.manufacturer || entry.manufacturer || null,
        partNumber: String(entry.oem.partNumber),
        normalized: normalizePartNumber(entry.oem.partNumber)
      });
    }

    (Array.isArray(entry.replacements) ? entry.replacements : [])
      .forEach(replacement => {
        if (!replacement || !replacement.partNumber) return;
        results.push({
          kind: "replacement",
          manufacturer: replacement.manufacturer || null,
          partNumber: String(replacement.partNumber),
          normalized: normalizePartNumber(replacement.partNumber)
        });
      });

    return deduplicateBy(results, item => `${item.kind}:${item.normalized}`);
  }

  function collectAllowedText(entry) {
    const values = [];
    const directFields = [
      "specification",
      "manufacturer",
      "location",
      "circuit",
      "description",
      "notes",
      "application"
    ];

    directFields.forEach(field => collectText(entry[field], values));
    if (entry.procedure) collectText(entry.procedure.summary, values);
    if (entry.component) {
      collectText(entry.component.label, values);
      collectText(entry.component.location, values);
    }
    collectText(entry.conditions, values);

    if (entry.oem) {
      collectText(entry.oem.manufacturer, values);
      collectText(entry.oem.partNumber, values);
    }
    (Array.isArray(entry.replacements) ? entry.replacements : [])
      .forEach(replacement => {
        collectText(replacement.manufacturer, values);
        collectText(replacement.partNumber, values);
      });

    return [...new Set(values.filter(Boolean))];
  }

  function collectText(value, target) {
    if (typeof value === "string") {
      target.push(value);
    } else if (Array.isArray(value)) {
      value.forEach(item => collectText(item, target));
    } else if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, item]) => {
        if (!["sourceIds", "url", "documentId"].includes(key)) {
          collectText(item, target);
        }
      });
    }
  }

  function walkAllowedData(value, visitor, key = "") {
    if (!value || typeof value !== "object") return;
    visitor(value, key);

    Object.entries(value).forEach(([childKey, child]) => {
      if (["variants", "sourceIds", "resolutionTrace"].includes(childKey)) return;
      if (child && typeof child === "object") {
        walkAllowedData(child, visitor, childKey);
      }
    });
  }

  function safeFormatValue(value, locale, localized = true) {
    try {
      return formatterApi.formatValue(value, {
        locale: locale || "pl-PL",
        localized
      });
    } catch (error) {
      return null;
    }
  }

  function stringArray(value) {
    return Array.isArray(value)
      ? value.filter(item => typeof item === "string")
      : [];
  }

  function deduplicateBy(values, getKey) {
    const seen = new Set();
    return values.filter(value => {
      const key = getKey(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function cloneData(value) {
    if (Array.isArray(value)) return value.map(cloneData);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, cloneData(item)])
      );
    }
    return value;
  }

  return Object.freeze({
    INDEX_SCHEMA_VERSION,
    MIN_QUERY_LENGTH,
    SCORE,
    buildSearchIndex,
    search,
    normalizeSearchText,
    normalizePartNumber,
    parseNumericUnitQuery,
    expandQuery
  });
});
