(function attachMotorcycleTechnicalProfileBridge(root, factory) {
  let contextApi = root && root.RevLogMotorcycleTechnicalContext;
  let runtimeApi = root && root.RevLogTechnicalProfileRuntime;
  if (typeof module === "object" && module.exports) {
    contextApi = contextApi || require("./motorcycle-technical-context.js");
    runtimeApi = runtimeApi || require("./technical-profile-runtime.js");
  }

  const api = factory(contextApi, runtimeApi);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogMotorcycleTechnicalProfileBridge = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createBridgeModule(defaultContextApi, defaultRuntime) {
  "use strict";

  function createMotorcycleTechnicalProfileBridge(options = {}) {
    const contextAdapter = options.contextAdapter || defaultContextApi;
    const runtime = options.runtime || defaultRuntime;

    async function openProfileForMotorcycle(motorcycle) {
      const contextResult = contextAdapter.buildTechnicalContext(motorcycle);
      if (contextResult.status !== "ready") return cloneData(contextResult);
      const runtimeResult = await runtime.openProfile(contextResult.context);
      return { ...runtimeResult, technicalContext: cloneData(contextResult.context) };
    }

    async function resolveEntryForMotorcycle(motorcycle, entryId) {
      const contextResult = contextAdapter.buildTechnicalContext(motorcycle);
      if (contextResult.status !== "ready") return cloneData(contextResult);
      const runtimeResult = await runtime.resolveEntryForContext(contextResult.context, entryId);
      return { ...runtimeResult, technicalContext: cloneData(contextResult.context) };
    }

    return Object.freeze({ openProfileForMotorcycle, resolveEntryForMotorcycle });
  }

  function cloneData(value) {
    return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
  }

  const defaultBridge = createMotorcycleTechnicalProfileBridge();
  return Object.freeze({ ...defaultBridge, createMotorcycleTechnicalProfileBridge });
});
