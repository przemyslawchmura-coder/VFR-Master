(function attachTechnicalProfileRuntime(root, factory) {
  let loaderApi = root && root.RevLogTechnicalProfileLoader;
  let resolverApi = root && root.RevLogTechnicalProfileResolver;
  if (typeof module === "object" && module.exports) {
    loaderApi = loaderApi || require("./technical-profile-loader.js");
    resolverApi = resolverApi || require("./technical-profile-resolver.js");
  }

  const api = factory(loaderApi, resolverApi);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.RevLogTechnicalProfileRuntime = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function createRuntime(defaultLoader, resolverApi) {
  "use strict";

  function createTechnicalProfileRuntime(options = {}) {
    const loader = options.loader || defaultLoader;

    async function openProfile(context) {
      const loaded = await loader.loadProfileForContext(context);
      if (loaded.status !== "loaded") return loaded;
      const applicability = resolverApi.resolveProfileApplicability(loaded.profile, context);
      return { ...loaded, applicability };
    }

    async function resolveEntryForContext(context, entryId) {
      const opened = await openProfile(context);
      if (opened.status !== "loaded" || opened.applicability.status !== "profile-applicable") return opened;
      const entry = opened.profile.entries.find(item => item.id === entryId);
      if (!entry) return { ...opened, status: "entry-not-found", entryId };
      return { ...opened, entryResolution: resolverApi.resolveEntry(entry, context) };
    }

    return Object.freeze({ openProfile, resolveEntryForContext });
  }

  const defaultRuntime = createTechnicalProfileRuntime();
  return Object.freeze({ ...defaultRuntime, createTechnicalProfileRuntime });
});
