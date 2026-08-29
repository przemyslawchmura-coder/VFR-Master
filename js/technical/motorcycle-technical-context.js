(function attachMotorcycleTechnicalContext(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogMotorcycleTechnicalContext = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createContextAdapter() {
  "use strict";

  function buildTechnicalContext(motorcycle) {
    const source = isObject(motorcycle) ? motorcycle : {};
    const context = {
      catalogVariantKey: nonEmptyStringOrNull(source.catalogVariantKey),
      year: Number.isInteger(source.year) ? source.year : null,
      region: nonEmptyStringOrNull(source.region),
      abs: typeof source.abs === "boolean" ? source.abs : null,
      equipment: Array.isArray(source.equipment)
        ? uniqueStrings(source.equipment)
        : null
    };
    const requiredContext = [];
    if (context.catalogVariantKey === null) requiredContext.push("catalogVariantKey");
    if (context.year === null) requiredContext.push("year");

    return {
      status: requiredContext.length ? "insufficient-context" : "ready",
      requiredContext,
      context
    };
  }

  function uniqueStrings(values) {
    return [...new Set(values.filter(value => typeof value === "string" && value.trim()).map(value => value.trim()))];
  }

  function nonEmptyStringOrNull(value) {
    return typeof value === "string" && value.trim() ? value.trim() : null;
  }

  function isObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }

  return Object.freeze({ buildTechnicalContext });
});
