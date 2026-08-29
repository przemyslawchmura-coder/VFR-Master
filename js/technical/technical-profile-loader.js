(function attachTechnicalProfileLoader(root, factory) {
  let registryApi = root && root.RevLogTechnicalProfileRegistry;
  let validatorApi = root && root.RevLogTechnicalProfileValidator;
  if (typeof module === "object" && module.exports) {
    registryApi = registryApi || require("./technical-profile-registry.js");
    validatorApi = validatorApi || require("./technical-profile-validator.js");
  }

  const api = factory(root, registryApi, validatorApi);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfileLoader = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createLoaderModule(root, defaultRegistry, validatorApi) {
  "use strict";

  function createProfileLoader(options = {}) {
    const registry = options.registry || defaultRegistry;
    const loadModule = options.loadModule || createDefaultModuleLoader(root);

    async function loadProfile(descriptor) {
      if (!descriptor || typeof descriptor.moduleId !== "string") {
        return { status: "invalid-descriptor", descriptor: cloneData(descriptor || null) };
      }
      try {
        const loaded = await loadModule(descriptor.moduleId, cloneData(descriptor));
        const profile = loaded && loaded.default ? loaded.default : loaded;
        if (!profile || !profile.profile) {
          return { status: "load-error", descriptor: cloneData(descriptor), error: "Module did not provide a Technical Profile." };
        }
        const validation = validatorApi.validate(profile);
        return { status: "loaded", descriptor: cloneData(descriptor), profile, validation };
      } catch (loadError) {
        return { status: "load-error", descriptor: cloneData(descriptor), error: loadError.message };
      }
    }

    async function loadProfileForContext(context) {
      const discovery = registry.findProfileDescriptor(context);
      if (discovery.status !== "found") return { ...cloneData(discovery), discovery: cloneData(discovery) };
      const loaded = await loadProfile(discovery.descriptor);
      return { ...loaded, discovery: cloneData(discovery) };
    }

    async function validateRegistryIntegrity() {
      const structural = registry.validateRegistry();
      const errors = [...structural.errors];
      for (const descriptor of registry.listProfiles()) {
        const loaded = await loadProfile(descriptor);
        if (loaded.status !== "loaded") {
          errors.push(issue("PROFILE_LOAD_FAILED", descriptor.profileId, loaded.error || loaded.status));
          continue;
        }
        if (loaded.profile.profile.id !== descriptor.profileId) {
          errors.push(issue("PROFILE_ID_MISMATCH", descriptor.profileId, "Loaded profile ID does not match descriptor."));
        }
        if (loaded.profile.schemaVersion !== descriptor.schemaVersion) {
          errors.push(issue("PROFILE_SCHEMA_MISMATCH", descriptor.profileId, "Loaded profile schemaVersion does not match descriptor."));
        }
        if (!sameApplicability(descriptor, loaded.profile)) {
          errors.push(issue("PROFILE_APPLICABILITY_MISMATCH", descriptor.profileId, "Profile applicability does not match descriptor metadata."));
        }
        if (!loaded.validation.valid) {
          errors.push(issue("PROFILE_VALIDATION_FAILED", descriptor.profileId, "Loaded profile failed Technical Profile validation."));
        }
      }
      return { valid: errors.length === 0, errors, warnings: [...structural.warnings] };
    }

    return Object.freeze({ loadProfile, loadProfileForContext, validateRegistryIntegrity });
  }

  function createDefaultModuleLoader(globalRoot) {
    if (typeof module === "object" && module.exports) {
      return moduleId => require(`../../${moduleId}`);
    }
    return (moduleId, descriptor) => {
      const profiles = globalRoot && globalRoot.RevLogTechnicalProfiles;
      if (profiles && profiles[descriptor.profileId]) return profiles[descriptor.profileId];
      throw new Error(`No local browser module adapter for ${moduleId}.`);
    };
  }

  function sameApplicability(descriptor, profile) {
    const applicability = profile.motorcycle && profile.motorcycle.applicability;
    return applicability &&
      JSON.stringify([...applicability.catalogVariantKeys].sort()) === JSON.stringify([...descriptor.catalogVariantKeys].sort()) &&
      applicability.years.from === descriptor.years.from && applicability.years.to === descriptor.years.to;
  }

  function issue(code, profileId, message) { return { code, profileId, message }; }
  function cloneData(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }

  const defaultLoader = createProfileLoader();
  return Object.freeze({ ...defaultLoader, createProfileLoader });
});
