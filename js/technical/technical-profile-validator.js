(function attachTechnicalProfileValidator(root, factory) {
  let unitsApi = root && root.RevLogTechnicalProfileUnits;

  if (!unitsApi && typeof module === "object" && module.exports) {
    unitsApi = require("./technical-profile-units.js");
  }

  const api = factory(unitsApi);

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.RevLogTechnicalProfileValidator = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createValidator(unitsApi) {
  "use strict";

  const SCHEMA_VERSION = "revlog-technical-profile/v1";

  const ENTRY_TYPES = Object.freeze([
    "specification",
    "torque",
    "fluid",
    "spark-plug",
    "light-source",
    "fuse",
    "maintenance-task",
    "consumable-part",
    "diagnostic-measurement",
    "adjustment",
    "fault-code"
  ]);

  const ENTRY_STATUSES = Object.freeze([
    "verified",
    "pending-verification",
    "legacy-unverified",
    "conflicting-sources",
    "deprecated"
  ]);

  const PROFILE_STATUSES = Object.freeze([
    "draft",
    "review",
    "published",
    "deprecated"
  ]);

  const VALUE_TYPES = Object.freeze([
    "quantity",
    "range",
    "quantity-with-tolerance",
    "ratio",
    "text",
    "multi"
  ]);

  const entryTypeSet = new Set(ENTRY_TYPES);
  const entryStatusSet = new Set(ENTRY_STATUSES);
  const profileStatusSet = new Set(PROFILE_STATUSES);
  const valueTypeSet = new Set(VALUE_TYPES);
  const stableIdPattern = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

  function validateTechnicalProfile(profile) {
    const errors = [];
    const warnings = [];

    const addError = (code, path, message) => {
      errors.push({ code, path, message });
    };

    const addWarning = (code, path, message) => {
      warnings.push({ code, path, message });
    };

    if (!isPlainObject(profile)) {
      addError("INVALID_PROFILE", "$", "Profile must be a plain object.");
      return createReport(errors, warnings);
    }

    if (!("schemaVersion" in profile)) {
      addError(
        "MISSING_SCHEMA_VERSION",
        "schemaVersion",
        "schemaVersion is required."
      );
    } else if (profile.schemaVersion !== SCHEMA_VERSION) {
      addError(
        "UNSUPPORTED_SCHEMA_VERSION",
        "schemaVersion",
        `Expected schemaVersion ${SCHEMA_VERSION}.`
      );
    }

    validateProfileMetadata(profile.profile, addError);
    validateMotorcycleApplicability(profile.motorcycle, addError);

    const categoryIds = validateCategories(
      profile.categories,
      addError,
      addWarning
    );

    const citationIds = validateSources(
      profile.documents,
      profile.citations,
      addError,
      addWarning
    );

    validateEntries(
      profile.entries,
      categoryIds,
      citationIds,
      addError,
      addWarning
    );

    return createReport(errors, warnings);
  }

  function validateProfileMetadata(metadata, addError) {
    if (!isPlainObject(metadata)) {
      addError("MISSING_PROFILE", "profile", "profile metadata is required.");
      return;
    }

    if (!isNonEmptyString(metadata.id)) {
      addError("MISSING_PROFILE_ID", "profile.id", "profile.id is required.");
    } else if (!stableIdPattern.test(metadata.id)) {
      addError(
        "INVALID_PROFILE_ID",
        "profile.id",
        "profile.id must be a stable lowercase ASCII identifier."
      );
    }

    if (!("revision" in metadata)) {
      addError(
        "MISSING_PROFILE_REVISION",
        "profile.revision",
        "profile.revision is required."
      );
    } else if (!Number.isInteger(metadata.revision) || metadata.revision < 1) {
      addError(
        "INVALID_PROFILE_REVISION",
        "profile.revision",
        "profile.revision must be a positive integer Number."
      );
    }

    if (metadata.status !== undefined && !profileStatusSet.has(metadata.status)) {
      addError(
        "UNKNOWN_PROFILE_STATUS",
        "profile.status",
        `Unknown profile status: ${String(metadata.status)}`
      );
    }
  }

  function validateMotorcycleApplicability(motorcycle, addError) {
    if (!isPlainObject(motorcycle)) {
      addError(
        "MISSING_MOTORCYCLE",
        "motorcycle",
        "motorcycle identity and applicability are required."
      );
      return;
    }

    const applicability = motorcycle.applicability;

    if (!isPlainObject(applicability)) {
      addError(
        "MISSING_APPLICABILITY",
        "motorcycle.applicability",
        "motorcycle.applicability is required."
      );
      return;
    }

    if (
      !Array.isArray(applicability.catalogVariantKeys) ||
      applicability.catalogVariantKeys.length === 0 ||
      applicability.catalogVariantKeys.some(key => !isNonEmptyString(key))
    ) {
      addError(
        "MISSING_CATALOG_VARIANT_KEY",
        "motorcycle.applicability.catalogVariantKeys",
        "At least one catalogVariantKey is required."
      );
    }

    if (applicability.years !== undefined) {
      validateYearRange(
        applicability.years,
        "motorcycle.applicability.years",
        addError
      );
    }
  }

  function validateYearRange(years, path, addError) {
    if (
      !isPlainObject(years) ||
      !Number.isInteger(years.from) ||
      !Number.isInteger(years.to)
    ) {
      addError(
        "INVALID_YEAR_RANGE",
        path,
        "Year range must contain integer Number values: from and to."
      );
      return;
    }

    if (years.from > years.to) {
      addError(
        "INVALID_YEAR_RANGE",
        path,
        "Year range from must not be greater than to."
      );
    }
  }

  function validateCategories(categories, addError, addWarning) {
    const ids = new Set();

    if (!Array.isArray(categories) || categories.length === 0) {
      addError(
        "MISSING_CATEGORIES",
        "categories",
        "At least one category is required."
      );
      return ids;
    }

    categories.forEach((category, index) => {
      const path = `categories[${index}]`;

      if (!isPlainObject(category) || !isNonEmptyString(category.id)) {
        addError(
          "MISSING_CATEGORY_ID",
          `${path}.id`,
          "Category id is required."
        );
        return;
      }

      if (ids.has(category.id)) {
        addError(
          "DUPLICATE_CATEGORY_ID",
          `${path}.id`,
          `Duplicate category id: ${category.id}`
        );
      } else {
        ids.add(category.id);
      }

      if (!stableIdPattern.test(category.id)) {
        addError(
          "INVALID_CATEGORY_ID",
          `${path}.id`,
          `Invalid stable category id: ${category.id}`
        );
      }

      if (!isNonEmptyString(category.label)) {
        addWarning(
          "MISSING_CATEGORY_LABEL",
          `${path}.label`,
          `Category ${category.id} has no user-facing label.`
        );
      }

      validateStringArray(category.aliases, `${path}.aliases`, addError);
    });

    return ids;
  }

  function validateSources(documents, citations, addError, addWarning) {
    const documentIds = new Set();
    const citationIds = new Set();

    if (!isPlainObject(documents)) {
      addError(
        "INVALID_DOCUMENTS",
        "documents",
        "documents must be an object map."
      );
    } else {
      Object.entries(documents).forEach(([key, document]) => {
        const path = `documents.${key}`;
        documentIds.add(key);

        if (!isPlainObject(document)) {
          addError("INVALID_DOCUMENT", path, "Document must be an object.");
          return;
        }

        if (document.id !== key) {
          addError(
            "DOCUMENT_ID_MISMATCH",
            `${path}.id`,
            `Document id must match its map key: ${key}`
          );
        }

        if (!isNonEmptyString(document.title)) {
          addWarning(
            "MISSING_DOCUMENT_TITLE",
            `${path}.title`,
            `Document ${key} has no title.`
          );
        }
      });
    }

    if (!isPlainObject(citations)) {
      addError(
        "INVALID_CITATIONS",
        "citations",
        "citations must be an object map."
      );
      return citationIds;
    }

    Object.entries(citations).forEach(([key, citation]) => {
      const path = `citations.${key}`;
      citationIds.add(key);

      if (!isPlainObject(citation)) {
        addError("INVALID_CITATION", path, "Citation must be an object.");
        return;
      }

      if (citation.id !== key) {
        addError(
          "CITATION_ID_MISMATCH",
          `${path}.id`,
          `Citation id must match its map key: ${key}`
        );
      }

      if (!isNonEmptyString(citation.documentId)) {
        addError(
          "MISSING_DOCUMENT_REFERENCE",
          `${path}.documentId`,
          `Citation ${key} must reference a document.`
        );
      } else if (!documentIds.has(citation.documentId)) {
        addError(
          "UNKNOWN_DOCUMENT_REFERENCE",
          `${path}.documentId`,
          `Unknown document id: ${citation.documentId}`
        );
      }
    });

    return citationIds;
  }

  function validateEntries(
    entries,
    categoryIds,
    citationIds,
    addError,
    addWarning
  ) {
    if (!Array.isArray(entries)) {
      addError("INVALID_ENTRIES", "entries", "entries must be an array.");
      return;
    }

    const entryIds = new Set();

    entries.forEach((entry, index) => {
      const path = `entries[${index}]`;

      if (!isPlainObject(entry)) {
        addError("INVALID_ENTRY", path, "Entry must be an object.");
        return;
      }

      if (!isNonEmptyString(entry.id)) {
        addError("MISSING_ENTRY_ID", `${path}.id`, "Entry id is required.");
      } else {
        if (entryIds.has(entry.id)) {
          addError(
            "DUPLICATE_ENTRY_ID",
            `${path}.id`,
            `Duplicate entry id: ${entry.id}`
          );
        } else {
          entryIds.add(entry.id);
        }

        if (!stableIdPattern.test(entry.id)) {
          addError(
            "INVALID_ENTRY_ID",
            `${path}.id`,
            `Invalid stable entry id: ${entry.id}`
          );
        }
      }
    });

    entries.forEach((entry, index) => {
      if (!isPlainObject(entry)) return;

      const path = `entries[${index}]`;

      if (!entryTypeSet.has(entry.type)) {
        addError(
          "UNKNOWN_ENTRY_TYPE",
          `${path}.type`,
          `Unknown entry type: ${String(entry.type)}`
        );
      }

      if (!isNonEmptyString(entry.categoryId)) {
        addError(
          "MISSING_CATEGORY_REFERENCE",
          `${path}.categoryId`,
          "Entry categoryId is required."
        );
      } else if (!categoryIds.has(entry.categoryId)) {
        addError(
          "UNKNOWN_CATEGORY_REFERENCE",
          `${path}.categoryId`,
          `Unknown category id: ${entry.categoryId}`
        );
      }

      validateStatusAndSources(
        entry.status,
        entry.sourceIds,
        path,
        citationIds,
        addError,
        true
      );

      validateStringArray(entry.tags, `${path}.tags`, addError);
      validateStringArray(entry.aliases, `${path}.aliases`, addError);
      validateRelatedEntries(
        entry.relatedEntryIds,
        `${path}.relatedEntryIds`,
        entryIds,
        addError
      );

      validateValueTree(entry.value, `${path}.value`, addError);
      validateEmbeddedQuantities(entry, path, addError, new Set(["value"]));
      validateVariants(entry.variants, path, citationIds, addError);
    });
  }

  function validateStatusAndSources(
    status,
    sourceIds,
    path,
    citationIds,
    addError,
    statusRequired
  ) {
    if (statusRequired && status === undefined) {
      addError(
        "MISSING_ENTRY_STATUS",
        `${path}.status`,
        "Entry status is required."
      );
    } else if (status !== undefined && !entryStatusSet.has(status)) {
      addError(
        "UNKNOWN_ENTRY_STATUS",
        `${path}.status`,
        `Unknown entry status: ${String(status)}`
      );
    }

    if (sourceIds !== undefined && !Array.isArray(sourceIds)) {
      addError(
        "INVALID_SOURCE_IDS",
        `${path}.sourceIds`,
        "sourceIds must be an array."
      );
      return;
    }

    const normalizedSources = Array.isArray(sourceIds) ? sourceIds : [];

    if (status === "verified" && normalizedSources.length === 0) {
      addError(
        "VERIFIED_WITHOUT_SOURCE",
        `${path}.sourceIds`,
        "A verified record must reference at least one citation."
      );
    }

    normalizedSources.forEach((sourceId, index) => {
      if (!isNonEmptyString(sourceId)) {
        addError(
          "INVALID_SOURCE_ID",
          `${path}.sourceIds[${index}]`,
          "sourceId must be a non-empty string."
        );
      } else if (!citationIds.has(sourceId)) {
        addError(
          "UNKNOWN_SOURCE_ID",
          `${path}.sourceIds[${index}]`,
          `Unknown citation id: ${sourceId}`
        );
      }
    });
  }

  function validateRelatedEntries(relatedIds, path, entryIds, addError) {
    if (relatedIds === undefined) return;

    if (!Array.isArray(relatedIds)) {
      addError(
        "INVALID_RELATED_ENTRY_IDS",
        path,
        "relatedEntryIds must be an array."
      );
      return;
    }

    const seen = new Set();

    relatedIds.forEach((relatedId, index) => {
      if (!isNonEmptyString(relatedId) || !entryIds.has(relatedId)) {
        addError(
          "UNKNOWN_RELATED_ENTRY_ID",
          `${path}[${index}]`,
          `Unknown related entry id: ${String(relatedId)}`
        );
      }

      if (seen.has(relatedId)) {
        addError(
          "DUPLICATE_RELATED_ENTRY_ID",
          `${path}[${index}]`,
          `Duplicate related entry id: ${String(relatedId)}`
        );
      }

      seen.add(relatedId);
    });
  }

  function validateVariants(variants, entryPath, citationIds, addError) {
    if (variants === undefined) return;

    if (!Array.isArray(variants)) {
      addError(
        "INVALID_VARIANTS",
        `${entryPath}.variants`,
        "variants must be an array."
      );
      return;
    }

    const ids = new Set();

    variants.forEach((variant, index) => {
      const path = `${entryPath}.variants[${index}]`;

      if (!isPlainObject(variant) || !isNonEmptyString(variant.id)) {
        addError("MISSING_VARIANT_ID", `${path}.id`, "Variant id is required.");
        return;
      }

      if (ids.has(variant.id)) {
        addError(
          "DUPLICATE_VARIANT_ID",
          `${path}.id`,
          `Duplicate variant id: ${variant.id}`
        );
      }
      ids.add(variant.id);

      if (!isPlainObject(variant.when)) {
        addError(
          "MISSING_VARIANT_CONDITION",
          `${path}.when`,
          "Variant when condition is required."
        );
      } else if (variant.when.years !== undefined) {
        validateYearRange(variant.when.years, `${path}.when.years`, addError);
      }

      if (!isPlainObject(variant.patch)) {
        addError(
          "MISSING_VARIANT_PATCH",
          `${path}.patch`,
          "Variant patch is required."
        );
      } else {
        validateEmbeddedQuantities(variant.patch, `${path}.patch`, addError);
      }

      if (variant.status !== undefined || variant.sourceIds !== undefined) {
        validateStatusAndSources(
          variant.status,
          variant.sourceIds,
          path,
          citationIds,
          addError,
          false
        );
      }
    });
  }

  function validateValueTree(value, path, addError) {
    if (value === undefined) return;

    if (!isPlainObject(value)) {
      addError("INVALID_VALUE", path, "value must be a structured object.");
      return;
    }

    if (!valueTypeSet.has(value.type)) {
      addError(
        "UNKNOWN_VALUE_TYPE",
        `${path}.type`,
        `Unknown value type: ${String(value.type)}`
      );
      return;
    }

    if (value.type === "quantity") {
      validateFiniteNumber(value.amount, `${path}.amount`, addError);
      validateUnit(value.unit, `${path}.unit`, addError);
    } else if (value.type === "range") {
      const minValid = validateFiniteNumber(value.min, `${path}.min`, addError);
      const maxValid = validateFiniteNumber(value.max, `${path}.max`, addError);
      validateUnit(value.unit, `${path}.unit`, addError);

      if (minValid && maxValid && value.min > value.max) {
        addError(
          "INVALID_RANGE",
          path,
          "Range min must not be greater than max."
        );
      }
    } else if (value.type === "quantity-with-tolerance") {
      validateFiniteNumber(value.nominal, `${path}.nominal`, addError);
      const toleranceValid = validateFiniteNumber(
        value.tolerance,
        `${path}.tolerance`,
        addError
      );
      validateUnit(value.unit, `${path}.unit`, addError);

      if (toleranceValid && value.tolerance < 0) {
        addError(
          "NEGATIVE_TOLERANCE",
          `${path}.tolerance`,
          "Tolerance must not be negative."
        );
      }
    } else if (value.type === "ratio") {
      validateFiniteNumber(value.numerator, `${path}.numerator`, addError);
      const denominatorValid = validateFiniteNumber(
        value.denominator,
        `${path}.denominator`,
        addError
      );

      if (denominatorValid && value.denominator === 0) {
        addError(
          "ZERO_RATIO_DENOMINATOR",
          `${path}.denominator`,
          "Ratio denominator must not be zero."
        );
      }
    } else if (value.type === "text") {
      if (!isNonEmptyString(value.text)) {
        addError("INVALID_TEXT_VALUE", `${path}.text`, "Text value is required.");
      }
    } else if (value.type === "multi") {
      if (!Array.isArray(value.values) || value.values.length === 0) {
        addError(
          "INVALID_MULTI_VALUE",
          `${path}.values`,
          "Multi value must contain at least one value."
        );
      } else {
        value.values.forEach((item, index) => {
          validateValueTree(item, `${path}.values[${index}]`, addError);
        });
      }
    }
  }

  function validateEmbeddedQuantities(node, path, addError, skippedKeys = new Set()) {
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        validateEmbeddedQuantities(item, `${path}[${index}]`, addError);
      });
      return;
    }

    if (!isPlainObject(node)) return;

    if (isNonEmptyString(node.unit)) {
      validateUnit(node.unit, `${path}.unit`, addError);

      ["amount", "min", "max", "nominal", "tolerance"].forEach(field => {
        if (field in node) {
          const valid = validateFiniteNumber(node[field], `${path}.${field}`, addError);

          if (field === "tolerance" && valid && node[field] < 0) {
            addError(
              "NEGATIVE_TOLERANCE",
              `${path}.${field}`,
              "Tolerance must not be negative."
            );
          }
        }
      });

      if (
        "min" in node &&
        "max" in node &&
        typeof node.min === "number" &&
        Number.isFinite(node.min) &&
        typeof node.max === "number" &&
        Number.isFinite(node.max) &&
        node.min > node.max
      ) {
        addError("INVALID_RANGE", path, "Range min must not be greater than max.");
      }
    }

    Object.entries(node).forEach(([key, value]) => {
      if (!skippedKeys.has(key)) {
        validateEmbeddedQuantities(value, `${path}.${key}`, addError);
      }
    });
  }

  function validateUnit(unit, path, addError) {
    if (!unitsApi || typeof unitsApi.has !== "function" || !unitsApi.has(unit)) {
      addError("UNKNOWN_UNIT", path, `Unknown canonical unit: ${String(unit)}`);
      return false;
    }

    return true;
  }

  function validateFiniteNumber(value, path, addError) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      addError(
        "INVALID_NUMBER",
        path,
        "Numeric value must be a finite JavaScript Number."
      );
      return false;
    }

    return true;
  }

  function validateStringArray(value, path, addError) {
    if (value === undefined) return;

    if (!Array.isArray(value) || value.some(item => !isNonEmptyString(item))) {
      addError(
        "INVALID_STRING_ARRAY",
        path,
        "Value must be an array of non-empty strings."
      );
    }
  }

  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return false;
    }

    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function isNonEmptyString(value) {
    return typeof value === "string" && value.trim() !== "";
  }

  function createReport(errors, warnings) {
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  return Object.freeze({
    SCHEMA_VERSION,
    ENTRY_TYPES,
    ENTRY_STATUSES,
    PROFILE_STATUSES,
    VALUE_TYPES,
    validate: validateTechnicalProfile
  });
});
