(function attachTechnicalProfileRegistryData(root, factory) {
  const descriptors = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = descriptors;
  }

  if (root) {
    root.RevLogTechnicalProfileRegistryData = descriptors;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createRegistryData() {
  "use strict";

  return Object.freeze([
    Object.freeze({
      profileId: "honda.vfr800.rc46-vtec-gen1.2002",
      catalogVariantKeys: Object.freeze(["honda.vfr800.rc46.vtec.gen1"]),
      years: Object.freeze({ from: 2002, to: 2002 }),
      moduleId: "data/technical/honda/vfr800/rc46-vtec-gen1/profile-2002.js",
      status: "review",
      schemaVersion: "revlog-technical-profile/v1"
    }),
    Object.freeze({
      profileId: "ducati.monster937.2021",
      catalogVariantKeys: Object.freeze(["ducati.monster.937"]),
      years: Object.freeze({ from: 2021, to: 2021 }),
      moduleId: "data/technical/ducati/monster937/profile-2021.js",
      status: "review",
      schemaVersion: "revlog-technical-profile/v1"
    })
  ]);
});
