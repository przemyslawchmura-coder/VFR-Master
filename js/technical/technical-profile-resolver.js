(function attachTechnicalProfileResolver(root, factory) {
  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.RevLogTechnicalProfileResolver = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createResolver() {
  "use strict";

  const CONDITION_FIELDS = Object.freeze([
    "catalogVariantKeys",
    "years",
    "regions",
    "abs",
    "equipment"
  ]);

  function resolveProfileApplicability(profile, inputContext = {}) {
    const context = normalizeContext(inputContext);
    const applicability = profile && profile.motorcycle
      ? profile.motorcycle.applicability
      : null;
    const evaluation = evaluateConditions(applicability, context);

    const status = evaluation.status === "match"
      ? "profile-applicable"
      : evaluation.status === "ambiguous-context"
        ? "ambiguous-context"
        : "profile-not-applicable";

    return {
      status,
      profileId: profile && profile.profile ? profile.profile.id : null,
      requiredContext: evaluation.requiredContext,
      candidates: evaluation.candidates,
      context,
      trace: {
        checkedApplicability: cloneData(applicability),
        matchedConditions: evaluation.matchedConditions,
        failedConditions: evaluation.failedConditions,
        finalStatus: status
      }
    };
  }

  function resolveEntry(entry, inputContext = {}) {
    const context = normalizeContext(inputContext);
    const trace = {
      entryId: entry && entry.id ? entry.id : null,
      baseApplied: false,
      matchedVariants: [],
      possibleVariants: [],
      selectedVariant: null,
      context: cloneData(context),
      finalStatus: null
    };

    if (!entry || typeof entry !== "object") {
      trace.finalStatus = "not-applicable";
      return {
        status: "not-applicable",
        entryId: null,
        trace
      };
    }

    const baseEvaluation = evaluateConditions(entry.applicability, context);

    if (baseEvaluation.status === "not-match") {
      trace.finalStatus = "not-applicable";
      return {
        status: "not-applicable",
        entryId: entry.id,
        trace
      };
    }

    if (baseEvaluation.status === "ambiguous-context") {
      trace.finalStatus = "ambiguous-context";
      return {
        status: "ambiguous-context",
        entryId: entry.id,
        requiredContext: baseEvaluation.requiredContext,
        candidates: baseEvaluation.candidates,
        trace
      };
    }

    trace.baseApplied = true;

    const variants = Array.isArray(entry.variants) ? entry.variants : [];
    const matched = [];
    const possible = [];

    variants.forEach(variant => {
      const evaluation = evaluateConditions(variant.when, context);
      const result = {
        id: variant.id,
        specificity: getSpecificity(variant.when),
        requiredContext: evaluation.requiredContext,
        candidates: evaluation.candidates
      };

      if (evaluation.status === "match") {
        matched.push({ variant, ...result });
        trace.matchedVariants.push(result);
      } else if (evaluation.status === "ambiguous-context") {
        possible.push({ variant, ...result });
        trace.possibleVariants.push(result);
      }
    });

    const topMatchedSpecificity = matched.length
      ? Math.max(...matched.map(item => item.specificity))
      : -1;
    const unresolvedThatCouldWin = possible.filter(
      item => item.specificity >= topMatchedSpecificity
    );

    if (
      unresolvedThatCouldWin.length &&
      !hasExplicitAllForRequiredContext(entry.applicability, unresolvedThatCouldWin)
    ) {
      const ambiguity = combineAmbiguities(unresolvedThatCouldWin);
      trace.finalStatus = "ambiguous-context";
      return {
        status: "ambiguous-context",
        entryId: entry.id,
        requiredContext: ambiguity.requiredContext,
        candidates: ambiguity.candidates,
        trace
      };
    }

    if (!matched.length) {
      trace.finalStatus = "resolved";
      return {
        status: "resolved",
        entryId: entry.id,
        entry: mergeRecord(entry, {}),
        selectedVariantId: null,
        trace
      };
    }

    const topMatches = matched.filter(
      item => item.specificity === topMatchedSpecificity
    );

    if (hasConflictingPatches(topMatches)) {
      trace.finalStatus = "ambiguous";
      return {
        status: "ambiguous",
        entryId: entry.id,
        matchingVariantIds: topMatches.map(item => item.variant.id),
        trace
      };
    }

    const selected = topMatches[0].variant;
    const resolved = mergeRecord(entry, selected.patch);

    if (selected.status !== undefined) {
      resolved.status = selected.status;
    }
    if (selected.sourceIds !== undefined) {
      resolved.sourceIds = cloneData(selected.sourceIds);
    }

    trace.selectedVariant = selected.id;
    trace.finalStatus = "resolved";

    return {
      status: "resolved",
      entryId: entry.id,
      entry: resolved,
      selectedVariantId: selected.id,
      trace
    };
  }

  function evaluateConditions(conditions, context) {
    if (!conditions || typeof conditions !== "object") {
      return evaluationResult("match");
    }

    const matchedConditions = [];
    const failedConditions = [];
    const requiredContext = new Set();
    const candidates = {};

    if (Array.isArray(conditions.catalogVariantKeys) && conditions.catalogVariantKeys.length) {
      if (context.catalogVariantKey === null) {
        requiredContext.add("catalogVariantKey");
        candidates.catalogVariantKey = [...conditions.catalogVariantKeys];
      } else if (conditions.catalogVariantKeys.includes(context.catalogVariantKey)) {
        matchedConditions.push("catalogVariantKey");
      } else {
        failedConditions.push("catalogVariantKey");
      }
    }

    if (conditions.years && typeof conditions.years === "object") {
      if (context.year === null) {
        requiredContext.add("year");
        candidates.year = [conditions.years.from, conditions.years.to];
      } else if (
        context.year >= conditions.years.from &&
        context.year <= conditions.years.to
      ) {
        matchedConditions.push("year");
      } else {
        failedConditions.push("year");
      }
    }

    if (
      Array.isArray(conditions.regions) &&
      conditions.regions.length &&
      !conditions.regions.includes("ALL")
    ) {
      if (context.region === null) {
        requiredContext.add("region");
        candidates.region = [...conditions.regions];
      } else if (conditions.regions.includes(context.region)) {
        matchedConditions.push("region");
      } else {
        failedConditions.push("region");
      }
    } else if (Array.isArray(conditions.regions) && conditions.regions.includes("ALL")) {
      matchedConditions.push("region:ALL");
    }

    if (typeof conditions.abs === "boolean") {
      if (context.abs === null) {
        requiredContext.add("abs");
        candidates.abs = [conditions.abs];
      } else if (context.abs === conditions.abs) {
        matchedConditions.push("abs");
      } else {
        failedConditions.push("abs");
      }
    }

    if (Array.isArray(conditions.equipment) && conditions.equipment.length) {
      if (context.equipment === null) {
        requiredContext.add("equipment");
        candidates.equipment = [...conditions.equipment];
      } else if (conditions.equipment.every(id => context.equipment.includes(id))) {
        matchedConditions.push("equipment");
      } else {
        failedConditions.push("equipment");
      }
    }

    if (failedConditions.length) {
      return {
        ...evaluationResult("not-match"),
        matchedConditions,
        failedConditions
      };
    }

    if (requiredContext.size) {
      return {
        status: "ambiguous-context",
        requiredContext: [...requiredContext],
        candidates,
        matchedConditions,
        failedConditions
      };
    }

    return {
      ...evaluationResult("match"),
      matchedConditions,
      failedConditions
    };
  }

  function normalizeContext(context) {
    return {
      catalogVariantKey: nonEmptyStringOrNull(context.catalogVariantKey),
      year: Number.isInteger(context.year) ? context.year : null,
      region: nonEmptyStringOrNull(context.region),
      abs: typeof context.abs === "boolean" ? context.abs : null,
      equipment: Array.isArray(context.equipment)
        ? [...new Set(context.equipment.filter(item => typeof item === "string"))]
        : null
    };
  }

  function getSpecificity(conditions) {
    if (!conditions || typeof conditions !== "object") return 0;

    return CONDITION_FIELDS.reduce((score, field) => {
      const value = conditions[field];
      const constrained = field === "abs"
        ? typeof value === "boolean"
        : Array.isArray(value)
          ? value.length > 0 && !value.includes("ALL")
          : value && typeof value === "object";
      return score + (constrained ? 1 : 0);
    }, 0);
  }

  function hasExplicitAllForRequiredContext(baseApplicability, possible) {
    if (!baseApplicability || typeof baseApplicability !== "object") return false;

    const ambiguity = combineAmbiguities(possible);
    return ambiguity.requiredContext.every(field => {
      if (field === "region") {
        return Array.isArray(baseApplicability.regions) &&
          baseApplicability.regions.includes("ALL");
      }
      return false;
    });
  }

  function combineAmbiguities(items) {
    const required = new Set();
    const candidates = {};

    items.forEach(item => {
      item.requiredContext.forEach(field => required.add(field));
      Object.entries(item.candidates).forEach(([field, values]) => {
        candidates[field] = [...new Set([...(candidates[field] || []), ...values])];
      });
    });

    return { requiredContext: [...required], candidates };
  }

  function hasConflictingPatches(matches) {
    if (matches.length < 2) return false;
    const resolutionData = variant => ({
      patch: variant.patch,
      status: variant.status,
      sourceIds: variant.sourceIds
    });
    const first = stableSerialize(resolutionData(matches[0].variant));
    return matches.slice(1).some(
      item => stableSerialize(resolutionData(item.variant)) !== first
    );
  }

  function mergeRecord(entry, patch) {
    const base = cloneData(entry);
    delete base.variants;
    return deepMerge(base, patch, true);
  }

  function deepMerge(base, patch, isRoot = false) {
    if (!isPlainObject(patch)) return cloneData(patch);
    const result = isPlainObject(base) ? cloneData(base) : {};

    Object.entries(patch).forEach(([key, value]) => {
      if (["__proto__", "prototype", "constructor"].includes(key)) {
        return;
      }
      if (
        isRoot &&
        ["id", "type", "categoryId", "variants", "applicability"].includes(key)
      ) {
        return;
      }
      result[key] = isPlainObject(value) && isPlainObject(result[key])
        ? deepMerge(result[key], value, false)
        : cloneData(value);
    });

    return result;
  }

  function stableSerialize(value) {
    if (Array.isArray(value)) {
      return `[${value.map(stableSerialize).join(",")}]`;
    }
    if (isPlainObject(value)) {
      return `{${Object.keys(value).sort().map(
        key => `${JSON.stringify(key)}:${stableSerialize(value[key])}`
      ).join(",")}}`;
    }
    return JSON.stringify(value);
  }

  function evaluationResult(status) {
    return {
      status,
      requiredContext: [],
      candidates: {},
      matchedConditions: [],
      failedConditions: []
    };
  }

  function nonEmptyStringOrNull(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }

  function isPlainObject(value) {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
  }

  function cloneData(value) {
    if (Array.isArray(value)) return value.map(cloneData);
    if (isPlainObject(value)) {
      return Object.fromEntries(
        Object.entries(value).map(([key, item]) => [key, cloneData(item)])
      );
    }
    return value;
  }

  return Object.freeze({
    CONDITION_FIELDS,
    normalizeContext,
    evaluateConditions,
    getSpecificity,
    resolveProfileApplicability,
    resolveEntry
  });
});
