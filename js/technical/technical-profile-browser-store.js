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
      profiles.set(profileId, cloneData(profile));
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
    if (!profile || typeof profile !== "object" || Array.isArray(profile)) {
      errors.push({ code: "INVALID_PROFILE", message: "Profile must be an object." });
    } else {
      if (!profile.profile || typeof profile.profile.id !== "string" || !profile.profile.id.trim()) {
        errors.push({ code: "MISSING_PROFILE_ID", message: "profile.id is required." });
      }
      if (profile.schemaVersion !== "revlog-technical-profile/v1") {
        errors.push({ code: "INVALID_SCHEMA_VERSION", message: "Unsupported Technical Profile schemaVersion." });
      }
    }
    return errors;
  }

  function cloneData(value) { return JSON.parse(JSON.stringify(value)); }

  const defaultStore = createProfileStore();
  return Object.freeze({ ...defaultStore, createProfileStore });
});
