(function attachTechnicalProfileRegistry(root, factory) {
  let registryData = root && root.RevLogTechnicalProfileRegistryData;
  if (!registryData && typeof module === "object" && module.exports) {
    registryData = require("../../data/technical/technical-profile-registry.js");
  }

  const api = factory(registryData || []);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfileRegistry = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createRegistry(defaultDescriptors) {
  "use strict";

  const ID_PATTERN = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;
  const SCHEMA_VERSION = "revlog-technical-profile/v1";
  const PROFILE_STATUSES = new Set(["draft", "review", "published", "deprecated"]);

  function createRegistry(descriptors = []) {
    const source = cloneData(descriptors);

    function listProfiles() {
      return cloneData(source);
    }

    function getProfileDescriptor(profileId) {
      const descriptor = source.find(item => item.profileId === profileId);
      return descriptor ? cloneData(descriptor) : null;
    }

    function findProfileDescriptor(context = {}) {
      const missing = [];
      if (!context.catalogVariantKey) missing.push("catalogVariantKey");
      if (!Number.isInteger(context.year)) missing.push("year");
      if (missing.length) {
        return { status: "insufficient-context", requiredContext: missing };
      }

      const matches = source.filter(descriptor =>
        descriptor.catalogVariantKeys.includes(context.catalogVariantKey) &&
        context.year >= descriptor.years.from &&
        context.year <= descriptor.years.to
      );

      if (!matches.length) return { status: "not-found" };

      const narrowestSpan = Math.min(...matches.map(yearSpan));
      const best = matches.filter(item => yearSpan(item) === narrowestSpan);
      if (best.length !== 1) {
        return {
          status: "ambiguous",
          matchingProfileIds: best.map(item => item.profileId).sort()
        };
      }

      return { status: "found", descriptor: cloneData(best[0]) };
    }

    function validateRegistry() {
      return validateDescriptors(source);
    }

    return Object.freeze({
      listProfiles,
      getProfileDescriptor,
      findProfileDescriptor,
      validateRegistry
    });
  }

  function validateDescriptors(descriptors) {
    const errors = [];
    const seenIds = new Set();

    descriptors.forEach((descriptor, index) => {
      const path = `descriptors[${index}]`;
      if (!isObject(descriptor)) {
        errors.push(error("INVALID_DESCRIPTOR", path, "Descriptor must be an object."));
        return;
      }
      if (!ID_PATTERN.test(descriptor.profileId || "")) {
        errors.push(error("INVALID_PROFILE_ID", `${path}.profileId`, "profileId must be a stable ID."));
      } else if (seenIds.has(descriptor.profileId)) {
        errors.push(error("DUPLICATE_PROFILE_ID", `${path}.profileId`, `Duplicate profileId: ${descriptor.profileId}`));
      }
      seenIds.add(descriptor.profileId);

      if (!Array.isArray(descriptor.catalogVariantKeys) || !descriptor.catalogVariantKeys.length ||
          descriptor.catalogVariantKeys.some(key => !ID_PATTERN.test(key))) {
        errors.push(error("INVALID_CATALOG_VARIANT_KEYS", `${path}.catalogVariantKeys`, "At least one stable catalogVariantKey is required."));
      }
      if (!validYears(descriptor.years)) {
        errors.push(error("INVALID_YEARS", `${path}.years`, "years.from and years.to must be integers with from <= to."));
      }
      if (typeof descriptor.moduleId !== "string" || !descriptor.moduleId.trim()) {
        errors.push(error("INVALID_MODULE_ID", `${path}.moduleId`, "moduleId is required."));
      }
      if (!PROFILE_STATUSES.has(descriptor.status)) {
        errors.push(error("INVALID_PROFILE_STATUS", `${path}.status`, `Unknown profile status: ${descriptor.status}`));
      }
      if (descriptor.schemaVersion !== SCHEMA_VERSION) {
        errors.push(error("INVALID_SCHEMA_VERSION", `${path}.schemaVersion`, `Expected ${SCHEMA_VERSION}.`));
      }
    });

    for (let left = 0; left < descriptors.length; left += 1) {
      for (let right = left + 1; right < descriptors.length; right += 1) {
        if (causesAmbiguity(descriptors[left], descriptors[right])) {
          errors.push(error(
            "AMBIGUOUS_DESCRIPTOR_OVERLAP",
            `descriptors[${right}]`,
            `Descriptors ${descriptors[left].profileId} and ${descriptors[right].profileId} overlap with equal specificity.`
          ));
        }
      }
    }

    return { valid: errors.length === 0, errors, warnings: [] };
  }

  function causesAmbiguity(left, right) {
    if (!isObject(left) || !isObject(right) || !validYears(left.years) || !validYears(right.years)) return false;
    const sharedKey = Array.isArray(left.catalogVariantKeys) && Array.isArray(right.catalogVariantKeys) &&
      left.catalogVariantKeys.some(key => right.catalogVariantKeys.includes(key));
    const yearsOverlap = left.years.from <= right.years.to && right.years.from <= left.years.to;
    return sharedKey && yearsOverlap && yearSpan(left) === yearSpan(right);
  }

  function yearSpan(descriptor) {
    return descriptor.years.to - descriptor.years.from;
  }

  function validYears(years) {
    return isObject(years) && Number.isInteger(years.from) && Number.isInteger(years.to) && years.from <= years.to;
  }

  function error(code, path, message) { return { code, path, message }; }
  function isObject(value) { return value !== null && typeof value === "object" && !Array.isArray(value); }
  function cloneData(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }

  const defaultRegistry = createRegistry(defaultDescriptors);
  return Object.freeze({
    ...defaultRegistry,
    createRegistry,
    validateDescriptors
  });
});
