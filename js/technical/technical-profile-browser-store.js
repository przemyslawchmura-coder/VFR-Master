(function attachTechnicalProfileBrowserStore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfileBrowserStore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createBrowserStoreModule() {
  "use strict";

  function createProfileStore() {
    const profiles = new Map();

    function registerProfile(profile) {
      const errors = validateRegistration(profile);
      if (errors.length) return { status: "invalid-profile", errors };
      const profileId = profile.profile.id;
      if (profiles.has(profileId)) {
        return { status: "duplicate-profile", profileId };
      }
      try {
        profiles.set(profileId, cloneData(profile));
      } catch (error) {
        return { status: "invalid-profile", errors: [{ code: "UNCLONEABLE_PROFILE", message: "Profile must contain cloneable data only." }] };
      }
      return { status: "registered", profileId };
    }

    function getProfile(profileId) {
      return profiles.has(profileId) ? cloneData(profiles.get(profileId)) : null;
    }

    function hasProfile(profileId) {
      return profiles.has(profileId);
    }

    function listRegisteredProfileIds() {
      return [...profiles.keys()].sort();
    }

    return Object.freeze({ registerProfile, getProfile, hasProfile, listRegisteredProfileIds });
  }

  function validateRegistration(profile) {
    const errors = [];
    if (!isPlainObject(profile)) {
      errors.push({ code: "INVALID_PROFILE", message: "Profile must be an object." });
    } else {
      if (!isPlainObject(profile.profile) || !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(profile.profile.id || "")) {
        errors.push({ code: "INVALID_PROFILE_ID", message: "profile.id must be a stable, normalized ID." });
      }
      if (profile.schemaVersion !== "revlog-technical-profile/v1") {
        errors.push({ code: "INVALID_SCHEMA_VERSION", message: "Unsupported Technical Profile schemaVersion." });
      }
      if (hasUnsafeStructure(profile)) {
        errors.push({ code: "UNSAFE_PROFILE_STRUCTURE", message: "Profile contains unsafe object keys or prototypes." });
      }
    }
    return errors;
  }

  function cloneData(value) { return JSON.parse(JSON.stringify(value)); }
  function isPlainObject(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || (
      Object.getPrototypeOf(prototype) === null &&
      typeof prototype.constructor === "function" &&
      prototype.constructor.name === "Object"
    );
  }
  function hasUnsafeStructure(value, seen = new Set()) {
    if (!value || typeof value !== "object") return false;
    if (seen.has(value)) return true;
    seen.add(value);
    if (!Array.isArray(value) && !isPlainObject(value)) return true;
    const unsafeKeys = new Set(["__proto__", "prototype", "constructor"]);
    const unsafe = Object.keys(value).some(key => unsafeKeys.has(key) || hasUnsafeStructure(value[key], seen));
    seen.delete(value);
    return unsafe;
  }

  const defaultStore = createProfileStore();
  return Object.freeze({ ...defaultStore, createProfileStore });
});
