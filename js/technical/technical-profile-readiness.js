(function attachTechnicalProfileReadiness(root, factory) {
  let contextApi = root && root.RevLogMotorcycleTechnicalContext;
  let bridgeApi = root && root.RevLogMotorcycleTechnicalProfileBridge;
  if (typeof module === "object" && module.exports) {
    contextApi = contextApi || require("./motorcycle-technical-context.js");
    bridgeApi = bridgeApi || require("./motorcycle-technical-profile-bridge.js");
  }

  const api = factory(contextApi, bridgeApi);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfileReadiness = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createReadinessModule(defaultContextApi, defaultBridge) {
  "use strict";

  function createReadinessService(options = {}) {
    const contextAdapter = options.contextAdapter || defaultContextApi;
    const bridge = options.bridge || defaultBridge;

    async function getTechnicalProfileReadiness(motorcycle) {
      let contextResult;
      try {
        contextResult = contextAdapter.buildTechnicalContext(motorcycle);
        const resolutionContext = describeResolutionContext(contextResult.context);
        if (contextResult.status !== "ready") {
          return { ...cloneData(contextResult), resolutionContext };
        }

        const opened = await bridge.openProfileForMotorcycle(motorcycle);
        const common = {
          context: cloneData(contextResult.context),
          resolutionContext,
          discovery: cloneData(opened.discovery || null)
        };
        if (opened.status === "ambiguous") {
          return { ...common, status: "ambiguous-profile", matchingProfileIds: cloneData(opened.matchingProfileIds || []) };
        }
        if (opened.status === "not-found") return { ...common, status: "not-found" };
        if (opened.status !== "loaded") {
          return { ...common, status: "load-error", error: opened.error || opened.status };
        }
        if (!opened.validation || !opened.validation.valid) {
          return {
            ...common,
            status: "invalid-profile",
            profileId: opened.profile && opened.profile.profile ? opened.profile.profile.id : null,
            validation: cloneData(opened.validation || null)
          };
        }
        return {
          ...common,
          status: "ready",
          profileId: opened.profile.profile.id,
          descriptor: cloneData(opened.descriptor),
          validation: cloneData(opened.validation),
          applicability: cloneData(opened.applicability)
        };
      } catch (error) {
        return {
          status: "load-error",
          error: error && error.message ? error.message : "Technical Profile subsystem failure.",
          context: contextResult ? cloneData(contextResult.context) : null,
          resolutionContext: contextResult ? describeResolutionContext(contextResult.context) : null,
          discovery: null
        };
      }
    }

    return Object.freeze({ getTechnicalProfileReadiness });
  }

  function describeResolutionContext(context = {}) {
    return {
      region: context.region === null ? "unknown" : "known",
      abs: context.abs === null ? "unknown" : "known",
      equipment: context.equipment === null ? "unknown" : "known"
    };
  }

  function cloneData(value) { return value === undefined ? undefined : JSON.parse(JSON.stringify(value)); }

  const defaultService = createReadinessService();
  return Object.freeze({ ...defaultService, createReadinessService, describeResolutionContext });
});
